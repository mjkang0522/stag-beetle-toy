# 변경 내역

이 문서는 현재 코드, 애셋 생성 시각, Git 기록을 기준으로 정리한다. 현재 Git 기록에는 2026-07-08 `Initial commit` 하나만 있으므로, 세부 항목은 확인 가능한 프로젝트 상태를 기준으로 분리했다.

## 2026-06-30

### Initial Project

- `index.html`, `css/style.css`, `js/main.js` 중심의 정적 웹 토이 구조를 시작했다.
- 빌드 도구와 프레임워크 없이 브라우저에서 바로 실행하는 방향을 정했다.
- 전체 화면 게임 영역과 사슴벌레 표시 영역의 기본 구조를 만들었다.

## 2026-07-02

### Background Asset

- `assets/bg/bg_main.png` 배경 이미지를 추가했다.
- `#game_screen`에서 전체 화면 배경으로 사용하도록 구성했다.

### Idle Animation

- `beetle_idle_01.png`부터 `beetle_idle_03.png`까지 3프레임 idle 애셋을 준비했다.
- 기본 대기 상태와 깜빡임 애니메이션을 구성했다.

### Walk Animation

- `beetle_walk_01.png`, `beetle_walk_02.png` 2프레임 걷기 애셋을 준비했다.
- Idle 중 일정 확률로 Walk 상태에 진입하도록 구성했다.
- 랜덤 목표 좌표, 이동 시간, 좌우 방향 반전을 구현했다.

## 2026-07-07

### Touch Animation

- `beetle_touch_01.png`부터 `beetle_touch_03.png`까지 3프레임 touch 애셋을 준비했다.
- 사슴벌레를 터치하면 현재 idle/walk 흐름을 정리하고 touch 반응을 재생하도록 구성했다.

### Happy Animation

- `beetle_happy_01.png`부터 `beetle_happy_03.png`까지 3프레임 happy 애셋을 준비했다.
- Touch 애니메이션 완료 후 Happy 애니메이션이 이어지고, 완료 후 Idle로 돌아가도록 구성했다.

### Eat And Jelly Assets

- `jelly.png`를 추가했다.
- `beetle_eat_oepn_01.png`부터 `beetle_eat_oepn_04.png`까지 Eat(Open) 후보 애셋을 추가했다.
- `beetle_eat_chew_01.png`, `beetle_eat_chew_02.png` Eat(Chew) 후보 애셋을 추가했다.
- 현재 이 애셋들은 코드에 아직 연결되지 않았다.

## 2026-07-08

### Initial Commit

- 현재 프로젝트 상태를 Git에 최초 커밋했다.

### Project Documentation

- 장기 관리용 문서 구조를 정리했다.
- `PROJECT_STATUS.md`, `CHANGELOG.md`, `TODO.md`, `ANIMATION_GUIDE.md`, `DEVELOPMENT_RULE.md`를 추가했다.
- GitHub 첫 화면용 `README.md`를 추가했다.
- 기존 `PROJECT_ANALYSIS.md`를 중복이 적은 문서 안내와 분석 요약으로 정리했다.

## 2026-07-09

### Sprint 0 - Day 6 Jelly Follow

- 젤리를 드래그해서 놓으면 현재 젤리 위치를 목표 좌표로 저장하도록 했다.
- `follow` 상태를 추가하고, Follow 중에는 Walk 프레임을 반복 재생하도록 했다.
- 사슴벌레가 젤리 방향으로 천천히 이동하고, 젤리 근처에 도착하면 Idle로 돌아가도록 했다.
- Follow 시작 시 기존 idle, walk, frame timer, 이동 프레임을 정리하도록 기존 `clearTimers()` 흐름을 재사용했다.
- 사슴벌레 방향 값을 `flipX`, `flipY`로 분리해 좌우 이동과 상하 이동 플립을 함께 표현하도록 했다.
- 젤리 드래그 중에는 젤리가 사슴벌레보다 앞에 보이고, 드래그가 끝나면 사슴벌레가 다시 앞에 보이도록 레이어를 보정했다.
- Eat(Open), Eat(Chew), 젤리 먹기 완료 흐름은 아직 연결하지 않았다.

## 2026-07-10

### Sprint 0 - Day 7 Feeding Loop

- Follow 도착 시 Idle로 돌아가지 않고 `eatOpen` 상태로 진입하도록 연결했다.
- `beetle_eat_oepn_01.png`부터 `beetle_eat_oepn_04.png`까지 Eat(Open) 애니메이션을 1회 재생하도록 했다.
- `beetle_eat_chew_01.png`, `beetle_eat_chew_02.png` Eat(Chew) 애니메이션을 1, 2번째 먹기 단계에서 각각 4회 반복하도록 했다.
- 각 Eat(Open) 종료 직후 `jelly_eaten_01.png`, `jelly_eaten_02.png`, `jelly_empty_plate.png` 순서로 젤리 이미지를 바꾸도록 했다.
- 먹기 완료 후 기존 Happy 애니메이션을 1회 재생하고, 빈 접시를 opacity 방식으로 깜빡인 뒤 숨기도록 했다.
- 새 `jelly.png`가 화면 위쪽에서 기본 위치로 떨어진 뒤 다시 드래그 가능해지도록 했다.
- 먹는 중과 새 젤리 낙하 중에는 Touch 입력과 젤리 드래그를 무시하도록 잠금 상태를 추가했다.
- `feedingLoop.isActive`로 먹이 주기 루프가 동시에 두 번 시작되지 않도록 했다.
- Live Server(`python -m http.server 8000`)에서 Eat(Open), Eat(Chew), 젤리 단계 이미지, Happy, 빈 접시 숨김, 새 젤리 낙하, 최종 드래그 재활성화, 콘솔 에러 없음을 확인했다.

### Feeding Timing Adjustment

- 먹기 시퀀스를 새로 만들지 않고 기존 먹이 주기 루프의 순서만 조정했다.
- 각 젤리 이미지 변경 타이밍을 Eat(Open) 시작 시점이나 Eat(Chew) 완료 시점이 아니라 Eat(Open) 종료 직후로 맞췄다.
- 1, 2번째 먹기 단계에서는 Eat(Open) 후 젤리 이미지를 바꾸고 Eat(Chew)를 4회 반복하도록 했다.
- 마지막 먹기 단계에서는 Eat(Open) 후 `jelly_empty_plate.png`로 바꾸고 Eat(Chew) 없이 Happy로 넘어가도록 했다.
- 빈 접시 깜빡임, 새 젤리 낙하, 드래그 재활성화, Idle 복귀 흐름은 기존 구현을 유지했다.

### Beetle Drag And Drop

- 기존 Touch -> Happy -> Idle 흐름을 유지하면서 사슴벌레 Drag & Drop 입력을 추가했다.
- 사슴벌레 드래그 중에는 Idle Blink, Walk, Follow 타이머를 정리하고 사슴벌레를 가장 앞 레이어로 올리도록 했다.
- 드래그 중 사슴벌레 위치를 포인터 좌표에 맞춰 갱신하고, 화면 밖으로 완전히 나가지 않도록 이동 범위를 제한했다.
- 드롭 후에는 현재 위치를 저장한 뒤 Happy를 1회 재생하고 Idle로 돌아가도록 했다.
- `happy`, `eatOpen`, `eatChew`, 먹이 주기 루프, 새 젤리 낙하, 젤리 드래그 중에는 사슴벌레 드래그가 시작되지 않도록 잠금 조건을 보강했다.
- Happy 중 젤리 드래그로 Follow가 끼어들지 않도록 젤리 드래그 잠금 조건을 보강했다.
- 브라우저 favicon 404가 콘솔 에러로 잡히지 않도록 빈 데이터 favicon을 선언했다.
- Live Server(`python -m http.server 8001`)와 headless Chrome CDP에서 사슴벌레 드래그, 드롭 후 Happy/Idle 복귀, 기존 젤리 먹이 루프, 콘솔 에러 없음을 확인했다.

### Beetle Hold Touch Loop Adjustment

- 사슴벌레 입력에서 짧은 터치, 긴 터치, 드래그 구분을 제거했다.
- Touch 1회 종료 후 `beetle_touch_03.png`를 고정하던 처리를 제거했다.
- 사슴벌레를 누르고 있는 동안 `touch.frameOrder` 전체를 계속 반복 재생하도록 바꿨다.
- 포인터 이동 여부와 상관없이 잡고 있는 동안 같은 Touch 반복 애니메이션을 유지하도록 했다.
- 포인터가 움직이면 기존 화면 제한과 드래그 오프셋 계산을 유지한 채 사슴벌레 위치만 갱신하도록 했다.
- `pointerup` 또는 `pointercancel`이 발생하면 Touch 반복을 종료하고 Happy 1회 재생 후 Idle로 돌아가도록 했다.
