클랩풋볼 서비스의 백엔드 코드입니다. (nodejs express server)

라우터는 아래 다섯가지입니다.

| 라우터명 | 기능 |
| --- | --- |
| authRouter   (/auth) | 회원가입(/join, post)    로그인(/login, post)   로그아웃(/logout, get) |
| userRouter   (/user) | 사용자의 신청 경기 조회 |
| matchRouter   (/match) | 경기 정보 조회(get) / 신규 경기 등록(post) / 경기정보 수정(patch) |
| playerRouter   (/player) | 경기 참가 신청(post) / 경기 신청 정보 수정(patch) |
| stadiumRouter   (/stadium) | 경기장 정보 조회(/:id, get) / 신규 경기장 등록(post) / 경기장 정보 수정(patch) |

Sequelize에서 mysql 테이블 생성하여 사용하였습니다.

| 테이블명 | 컬럼 |
| --- | --- |
| user\[ 회원 테이블 \] | userId(사용자Id), email(계정 이메일), nick(닉네임), password(비밀번호), sex(성별), level(사용자 레벨), provider(계정 제공자), snsId(sns ID) |
| match \[경기 테이블\]  | matchId(id), 경기 일자(scheduleDate), 경기 시간(scheduleTime), 경기장 이름(scheduleInfo), 참가자 성별(optionSex), 경기 유형(optionMatch), 경기 수준(optionLevel), 총 경기 인원(optionSize), 경기 신청 마감 여부(optionEnd), 경기장 id(stadiumId) |
| player \[경기 신청자 테이블\] | userId(사용자 id), isPlayer(최종 신청여부), matchId(경기 id) |
| stadium \[ 경기장 테이블 \] | name(경기장 이름), address(경기장 주소), size(면적), isShower(샤워실 유무), parkingOption(주차 유/무료), parkingInfo(주차장 정보), shoesOption(풋살화 대여), shoesInfo(대여정보), clothesOption(운동복 대여), clothesInfo(운동복 대여 정보), stadiumInfo(경기장 설명) |