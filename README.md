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
- 유저가 이벤트에 대한 조건을 달성하는 데이터는 **UserEventProgress(유저-이벤트)** 엔티티에 별도로 관리합니다. 이를 통해 유저의 이벤트 달성 여부를 확인할 때 UserEventProgress 데이터를 활용할 수 있습니다.
- 현재 코드에 적용되어 있는 이벤트는 아래와 같습니다.
  1. 신규유저 이벤트 
  2. 출석 이벤트
  3. 친구초대 이벤트
  4. 특별한 날 이벤트(크리스마스, 새해 등)
- (아쉬운 점) UserEventProgress 데이터 적재는 메시지 큐 대신 HTTP 요청 방식으로 구현하였으며, 게임 서버에서 데이터를 보낸다고 가정하고 IP 화이트리스트 방식으로 제한하였습니다.

#### 이벤트 조건 검증 로직

- **유저가 보상을 요청하는 API**에서는 해당 이벤트의 조건을 충족하는지 검증이 필요합니다.
- 이 검증 로직은 `EventConditionValidateManager`(`event-server/src/event-condition-validate-manager/event-condition-validate.manager.ts`)에서 일괄적으로 관리합니다.
- 이벤트 타입별로 조건 검증을 담당하는 핸들러들을 내부적으로 관리하며, 이벤트의 조건과 유저의 진행 정보를 받아 적합한 핸들러를 통해 조건 충족 여부를 판단합니다.
- 조건을 만족하지 못할 경우 예외를 발생시켜, API에서 적절한 에러 메시지를 반환할 수 있도록 합니다.
- 이 구조를 통해 이벤트 조건 검증 로직을 한 곳에서 일관성 있게 관리할 수 있으며, 새로운 이벤트 타입이 추가될 때도 별도의 핸들러만 구현하여 쉽게 확장할 수 있습니다.

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