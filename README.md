# Maple Assignment - 개발 및 설계 과정

## 1. 프로젝트 설명

### 프로젝트 구조(아키텍처)

- 각 모듈별로 **Presentation - Application - Domain - Infra** 형태의 레이어드 아키텍처를 따릅니다.
- Domain에는 repository interface를 두고, Infra에 DB 의존 repository 구현체를 두는 DIP(Dependency Inversion Principle) 방식을 선호하지만, 본 프로젝트는 **YAGNI(You Aren't Gonna Need It)** 원칙에 따라 Infra 구현체를 직접 Service에 주입하는 방식을 선택했습니다.
- 요구사항과 프로젝트 규모를 고려한 결정입니다.

### DDD(Domain Driven Design)

- DDD를 선호하지만, **직접적으로 적용하지는 않았습니다**.  
  (요구사항과 프로젝트 규모를 고려했을 때, DDD 적용이 과하다고 판단)
- 각 애그리거트(모듈)별로 **책임과 역할을 명확히 분리**하는 부분에 집중하여 설계하였습니다.

### 이벤트 관련 설계

- **이벤트(Event)는 타입과 조건을 두는 방식**으로 설계하였습니다.
- 초반에는 자유롭게 이벤트와 조건을 추가하는 방식을 고려했으나, 이벤트의 형태와 조건이 한정될 것이라 판단하여 **특정 이벤트 타입에는 그에 맞는 조건을 강제**하는 구조로 변경하였습니다.
- 이를 위해 `EventWithConditionValidator`를 만들어, **API 호출 시 특정 이벤트에 가능한 조건이 맞는지 검사** 후 컨트롤러 로직으로 진입하도록 하였습니다.
- 현재 코드에 적용되어 있는 이벤트는 아래와 같습니다.
  1. 신규유저 이벤트 
  2. 출석 이벤트
  3. 친구초대 이벤트
  4. 특별한 날 이벤트(크리스마스, 새해 등)
- 유저가 이벤트에 대한 조건을 달성하는 데이터는 **UserEventProgress(유저-이벤트)** 엔티티에 별도로 관리합니다. 이는 게임 서버에서 게이트 웨이 서버를 통해 이벤트 서버를 호출하는 것으로 가정하였습니다. 이를 통해 유저의 이벤트 달성 여부를 확인할 때 UserEventProgress 데이터를 활용할 수 있습니다.

- (아쉬운 점) UserEventProgress 데이터 적재는 대량의 데이터일 것을 고려하여 메시지 큐로 구현하는 것이 좋다고 판단하였지만 HTTP 요청 방식으로 구현하였으며, 게임 서버에서 데이터를 보낸다고 가정하고 IP 화이트리스트 방식으로 제한하였습니다.

#### 이벤트 조건 검증 로직

- **유저가 보상을 요청하는 API**에서는 해당 이벤트의 조건을 충족하는지 검증이 필요합니다.
- 이 검증 로직은 `EventConditionValidateManager`(`event-server/src/event-condition-validate-manager/event-condition-validate.manager.ts`)에서 일괄적으로 관리합니다.
- 이벤트 타입별로 조건 검증을 담당하는 핸들러들을 내부적으로 관리하며, 이벤트의 조건과 유저의 진행 정보를 받아 적합한 핸들러를 통해 조건 충족 여부를 판단합니다.
- 조건을 만족하지 못할 경우 예외를 발생시켜, API에서 적절한 에러 메시지를 반환할 수 있도록 합니다.
- 이 구조를 통해 이벤트 조건 검증 로직을 한 곳에서 일관성 있게 관리할 수 있으며, 새로운 이벤트 타입이 추가될 때도 별도의 핸들러만 구현하여 쉽게 확장할 수 있습니다.

### 중복 보상 요청 처리
- 기본적인 중복 신청 요청은 서비스 코드에서 일반적인 조회 + 검증 로직을 통해 진행하였습니다.
- 하지만 빠르게 요청되는 보상 신청 생성에 대해, 단순히 서비스 코드에서 기존 데이터를 조회하여 중복을 체크하는 것만으로는 동시성(Concurrency) 상황에서 완벽하게 중복을 방지할 수 없다고 판단하였습니다.
- 따라서 몽고DB Unique 인덱스를 활용하여 userId + eventId + rewardId 조합에 대해 중복 데이터가 저장되는 것을 DB 레벨에서 강력하게 차단하였습니다. 또한 저장 로직에 try/catch를 활용하여 이미 보상 신청 이력이 있다는 메시지도 추가하였습니다.

### 보상에 대한 이벤트 연결
- 보상 관련 요청에 대해서, 보상과 연결된 이벤트도 함께 응답하도록 API 설계하였습니다.

### 테스트 코드

- 테스트 코드는 **Application 레이어의 Service**에 대해 작성하였습니다.
- 이벤트 조건 검증이 중요한 부분이라 판단하여, `EventConditionValidateManager`에 대해서도 테스트 코드를 작성하였습니다.

---

## 2. 실행 방법

1. **필수 환경**
   - Node.js 18.x 이상
   - npm 또는 yarn
   - Docker, Docker Compose

2. **의존성 설치**
   - 각 서버별로 아래 명령어를 실행합니다.
     ```bash
     cd gateway-server && npm install
     cd ../auth-server && npm install
     cd ../event-server && npm install
     ```

3. **환경 변수**
   - 환경 변수 없이도 실행되도록 구성되어 있습니다.

4. **도커로 전체 서비스 실행**
   - 아래 명령어로 모든 서비스를 실행할 수 있습니다.
     ```bash
     docker-compose up -d
     ```
   - MongoDB, gateway, auth, event 서버가 모두 컨테이너로 실행됩니다.

5. **Swagger API 문서**
   - 각 서버의 `/api` 또는 `/docs` 경로에서 Swagger 문서를 확인할 수 있습니다.  
     (gateway에는 Swagger 미적용, 각 마이크로서비스에만 적용)

---

## 3. 폴더/코드 구조 설명

### 프로젝트 루트

- `gateway-server/` : API Gateway 역할, 각 마이크로서비스로 프록시 및 인증/권한 관리
- `auth-server/` : 인증/인가 및 사용자 관리 마이크로서비스
- `event-server/` : 이벤트, 보상, 유저 이벤트 진행 관리 마이크로서비스
- `docker-compose.yml` : 전체 서비스 도커 컴포즈 설정

### gateway-server/src

- `auth-proxy/`  
  인증/유저 관련 API를 auth-server로 프록시하는 컨트롤러 포함
- `event-proxy/`  
  이벤트, 보상, 보상 요청, 유저 이벤트 진행 관련 API를 event-server로 프록시하는 컨트롤러 포함
- `common/guards/`  
  인증/권한 관련 NestJS Guard 및 데코레이터(`jwt-auth.guard.ts`, `roles.guard.ts`, `roles.decorator.ts`, `jwt.strategy.ts` 등)

### event-server/src

- `event/` : 이벤트 도메인(엔티티, 서비스, 컨트롤러 등)
- `reward/` : 보상 도메인
- `reward-request/` : 보상 요청 도메인
- `user-event/` : 유저-이벤트 진행상황 도메인
- `event-condition-validate-manager/` : 이벤트 조건 검증 매니저(핸들러, 매니저 등)

### auth-server/src

- `auth/` : 인증/인가 도메인(엔티티, 서비스, 컨트롤러 등)
- `users/` : 사용자 도메인

---

이 구조를 통해 각 도메인별 책임이 명확히 분리되어 있으며,  
gateway-server가 모든 외부 요청을 받아 각 마이크로서비스로 프록시하는 구조입니다.  
인증/권한은 gateway에서 1차적으로 처리하며,  
각 마이크로서비스는 자신의 도메인 로직에 집중할 수 있도록 설계되어 있습니다.

## 4. 과제 요구사항 체크리스트
### 🧱 아키텍처 (3개 서버로 구성)

#### ✅ Gateway Server
- [x] 모든 API 요청을 받는 진입점 역할 수행
- [x] JWT 토큰 검증
- [x] 사용자 역할(Role) 기반 권한 검사
- [x] NestJS의 `@nestjs/passport`, `AuthGuard`, `RolesGuard` 사용

#### ✅ Auth Server
- [x] 유저 등록
- [x] 유저 로그인
- [x] 역할(Role) 관리
- [x] JWT 발급

#### ✅ Event Server
##### 1. 이벤트 등록 / 조회
- [x] 운영자 또는 관리자가 이벤트 생성 가능
- [x] 이벤트에 조건, 기간, 상태(활성/비활성) 포함
- [x] 이벤트 목록 및 상세 조회 기능

##### 2. 보상 등록 / 조회
- [x] 이벤트에 연결된 보상 정보 등록 가능
- [x] 보상은 포인트/아이템/쿠폰 등 자유롭게 구성
- [x] 보상 수량 포함
- [x] 보상과 이벤트 연결 명확히 표현

##### 3. 유저 보상 요청
- [x] 유저가 특정 이벤트에 대해 보상 요청 가능
- [x] 조건 충족 여부 검증 로직 포함
- [x] 중복 요청 방지
- [x] 요청 상태(성공/실패 등) 기록

##### 4. 보상 요청 내역 확인
- [x] 유저는 자신의 요청 이력을 조회 가능
- [x] 운영자, 감사자, 관리자는 전체 유저의 요청 기록 조회 가능
- [x] (선택) 이벤트별/상태별 필터링 기능

---

### 🔐 인증 및 권한
- [x] JWT 기반 인증 구현
- [x] 역할(Role)에 따라 접근 제어 구현

---

### 🧪 테스트 및 기타
- [x] (선택) 단위 테스트 또는 통합 테스트 작성
- [x] 설계 이유/고민 등은 `README.md`에 기술
