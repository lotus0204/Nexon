# 베이스 이미지
FROM node:18

# 작업 디렉토리 생성
WORKDIR /app

# package.json, package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 (NestJS는 보통 빌드 필요)
RUN npm run build

# 컨테이너 시작 시 실행할 명령
CMD ["npm", "run", "start:prod"]