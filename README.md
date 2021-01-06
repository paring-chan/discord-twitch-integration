# 디스코드 - 트위치 연동 시스템

### 이 프로젝트에 있는것들
- 디스코드/트위치 간 채팅 연동
- 방송 시작 알림

### 설치

#### 컴파일

```shell
# 패키지 설치
yarn
# 또는 npm 사용
npm i
# 타입스크립트 컴파일
yarn tsc
# npm 사용
npx tsc
```

#### 설정

```json5
{
  "tokens": {
    "discord": "" // 디스코드 토큰
  },
  "twitch": {
    "username": "", // 트위치 봇 ID
    "password": "", // 트위치 봇 oauth2 토큰
    "clientID": "", // 트위치 클라이언트 ID
    "clientSecret": "", // 트위치 클라이언트 시크릿
    "webhook": {
      "hostName": "", // 이 프로젝트를 실행하는 서버에 접속 가능한 IP 또는 도메인
      "listenerPort": 8090 // 웹훅 서버가 실행되는 서버 주소(포트포워딩 필요)
    }
  },
  "channels": [
    {
      "discord": "", // 디스코드 채널 ID
      "twitch": "", // 트위치 ID(스트리머)
      "webhook": {
        "id": "", // 디스코드 웹훅 ID
        "secret": "" // 디스코드 웹훅 토큰
      },
      "notifyMessage": "" // 방송 시작 알림 메시지
    }
  ]
}
```

#### 실행

```shell
node dist
```
