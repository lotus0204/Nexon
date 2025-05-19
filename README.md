# Maple Assignment - 개발 및 설계 과정

## 3. 폴더 구조 및 개발환경 세팅

### 3-1. 폴더 구조 예시

```
maple-assignment/
├── gateway/           # Gateway Server (NestJS)
├── auth/              # Auth Server (NestJS)
├── event/             # Event Server (NestJS)
├── docker-compose.yml # 전체 서비스 실행용
├── README.md
└── docs/              # 설계 문서, 다이어그램 등 (선택)
```

- 각 서버는 독립적인 NestJS 프로젝트로 구성
- 루트에 `docker-compose.yml` 파일을 두어, 모든 서버와 MongoDB를 한 번에 실행

### 3-2. 개발환경 세팅 절차

1. **각 서버 NestJS 프로젝트 생성**
   ```sh
   nest new gateway
   nest new auth
   nest new event
   ```
   - 각 폴더(gateway, auth, event)에서 독립적으로 NestJS 프로젝트 생성

2. **공통 의존성 설치**
   - 각 서버 폴더에서 아래 패키지 설치
     ```sh
     npm install @nestjs/mongoose mongoose @nestjs/passport passport passport-jwt jsonwebtoken
     ```
   - 필요에 따라 `@nestjs/config`, `class-validator`, `bcrypt` 등도 추가

3. **Docker 및 docker-compose 설정**
   - 루트에 `docker-compose.yml` 파일 생성
   - 예시:
     ```yaml
     version: '3'
     services:
       mongo:
         image: mongo:6
         container_name: mongo
         ports:
           - "27017:27017"
         volumes:
           - ./mongo-data:/data/db

       gateway:
         build: ./gateway
         ports:
           - "3000:3000"
         depends_on:
           - auth
           - event
           - mongo

       auth:
         build: ./auth
         ports:
           - "3001:3001"
         depends_on:
           - mongo

       event:
         build: ./event
         ports:
           - "3002:3002"
         depends_on:
           - mongo
     ```
   - 각 서버 폴더에 `Dockerfile` 작성 필요

4. **환경 변수 관리**
   - 각 서버에 `.env` 파일 생성 (예: DB 연결, JWT 시크릿 등)

5. **실행**
   - 루트에서 아래 명령어로 전체 서비스 실행
     ```sh
     docker-compose up --build
     ``` 


# 프로젝트 설명

## 프로젝트 구조(아키텍처)

- 프로젝트 구조는 각 모듈별로 **Presentation - Application - Domain - Infra** 형태로 구성된 레이어드 아키텍처를 따릅니다.
- 일반적으로는 Domain에 repository interface를 두고, Infra에 데이터베이스에 의존하는 repository 구현체를 두어 DIP(Dependency Inversion Principle)를 적용하는 방식을 선호합니다.
- 하지만 본 프로젝트에서는 **YAGNI(You Aren't Gonna Need It)** 원칙을 적용하여, Infra에 구현체를 직접 Service에 주입하는 방식을 선택하였습니다.  
  (현재 요구사항과 프로젝트 규모를 고려한 결정입니다.)

## DDD(Domain Driven Design)

- DDD를 선호하지만, **직접적으로 적용하지는 않았습니다**.  
  (요구사항과 프로젝트 규모를 고려했을 때, DDD 적용이 과하다고 판단)
- 다만, 각 애그리거트(모듈)별로 **책임과 역할을 명확히 분리**하는 부분에 대해서는 충분히 고민하여 설계하였습니다.

## 이벤트 관련 설계

- **이벤트(Event)는 타입과 조건을 두는 방식**으로 설계하였습니다.
- 초반에는 자유롭게 이벤트와 조건을 추가하는 방식을 고려했으나,  
  이벤트의 형태와 조건이 한정될 것이라 판단하여  
  **특정 이벤트 타입에는 그에 맞는 조건을 강제**하는 구조로 변경하였습니다.
- 이를 위해 `EventWithConditionValidator`를 만들어,  
  **API 호출 시 특정 이벤트에 가능한 조건이 맞는지 검사** 후 컨트롤러 로직으로 진입하도록 하였습니다.
- 이후 유저의 이벤트 조건 충족 검사도  
  **타입과 강제된 조건을 통해 검사 로직이 단순해집니다.**

- 유저가 이벤트에 대한 조건을 달성하는 데이터는  
  **UserEventProgress(유저-이벤트)** 엔티티에 별도로 관리합니다.  
  이를 통해 유저의 이벤트 달성 여부를 확인할 때  
  UserEventProgress 데이터를 활용할 수 있습니다.

- 현재 코드에 적용되어 있는 이벤트는 아래와 같습니다.
  1. 신규유저 이벤트 
  2. 출석 이벤트
  3. 친구초대 이벤트
  4. 특별한 날 이벤트(크리스마스 이벤트, 새해 맞이 이벤트 등으로 활용)


- (아쉬운 점)  
  UserEventProgress 데이터를 쌓는 부분은  
  요청이 많을 것을 예상하여 Kafka나 RabbitMQ 같은 메시지 큐를 적용하고 싶었으나,  
  현재는 **HTTP 요청 방식**으로 구현하였습니다.
  대신 게임 서버에서 데이터를 보낸다고 가정하고 권한 적용 대신, IP 화이트리스트 방식으로 게임 서버에 대한 IP만 받는 방식으로 구현하였습니다.

### 이벤트 조건 검증 로직

- **유저가 보상을 요청하는 API**에서는 해당 이벤트의 조건을 충족하는지 검증이 필요합니다.
- 이 검증 로직은  
  `EventConditionValidateManager`  
  (`event-server/src/event-condition-validate-manager/event-condition-validate.manager.ts`)  
  에서 **일괄적으로 관리**합니다.
- ```EventConditionValidateManager```는  
  이벤트 타입별로 조건 검증을 담당하는 핸들러들을 내부적으로 관리하며,  
  이벤트의 조건과 유저의 진행 정보를 받아  
  **적합한 핸들러를 통해 조건 충족 여부를 판단**합니다.
- 조건을 만족하지 못할 경우에는 예외를 발생시켜,  
  API에서 적절한 에러 메시지를 반환할 수 있도록 합니다.
- 이 구조를 통해 이벤트 조건 검증 로직을 한 곳에서 일관성 있게 관리할 수 있으며,  
  **새로운 이벤트 타입이 추가될 때도 별도의 핸들러만 구현하여 쉽게 확장**할 수 있습니다.

## 테스트 코드
- 테스트 코드는 **Application 레이어의 Service**에 대해 작성하였습니다.
- 추가적으로 이벤트 조건을 충족하는 부분이 중요하다고 판단하여, ```EventConditionValidateManager``` 에 대해서도 테스트 코드를 작성하였습니다.