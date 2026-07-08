# 우리집 사슴벌레

브라우저에서 바로 실행되는 작은 정적 웹 토이입니다. 배경 화면 위의 사슴벌레가 자동으로 쉬고, 깜빡이고, 걸어 다니며, 사용자가 터치하면 반응한 뒤 기분 좋은 애니메이션을 보여줍니다.

## 목표

- 사슴벌레를 바라보고 상호작용하는 가벼운 디지털 토이를 만든다.
- HTML, CSS, JavaScript만으로 실행 가능한 구조를 유지한다.
- 초보자도 코드를 읽고 기능을 하나씩 추가할 수 있게 단순한 상태 흐름을 유지한다.
- 장기적으로 먹이 주기, 감정 반응, 회복/도망 같은 작은 행동을 확장한다.

## 개발 환경

- 정적 HTML/CSS/JavaScript
- 빌드 도구 없음
- 패키지 매니저 없음
- 로컬 확인용 서버가 필요할 때만 Python 내장 서버 사용

## 현재 진행 상황

현재 구현된 기능은 다음과 같습니다.

- 전체 화면 배경 표시
- 사슴벌레 기본 표시
- Idle 상태와 깜빡임 애니메이션
- 랜덤 위치로 걷는 Walk 상태
- 사슴벌레 터치 반응
- Touch 이후 Happy 애니메이션 연결

먹기 애니메이션과 젤리 이미지는 애셋으로 준비되어 있지만, 아직 실제 상호작용에는 연결되지 않았습니다.

## 실행 방법

가장 간단한 방법은 `index.html`을 브라우저에서 직접 여는 것입니다.

로컬 서버로 확인하려면 프로젝트 루트에서 다음 명령을 실행합니다.

```powershell
python -m http.server 8000
```

그 다음 브라우저에서 `http://localhost:8000`을 엽니다.

## 폴더 구조

```text
stag-beetle-toy/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── bg/
│   │   └── bg_main.png
│   ├── beetle/
│   │   ├── beetle_idle_*.png
│   │   ├── beetle_walk_*.png
│   │   ├── beetle_touch_*.png
│   │   ├── beetle_happy_*.png
│   │   ├── beetle_eat_oepn_*.png
│   │   ├── beetle_eat_chew_*.png
│   │   └── jelly.png
│   ├── sound/
│   └── ui/
└── docs/
    ├── PROJECT_STATUS.md
    ├── CHANGELOG.md
    ├── TODO.md
    ├── ANIMATION_GUIDE.md
    ├── DEVELOPMENT_RULE.md
    └── PROJECT_ANALYSIS.md
```

## 문서

- 현재 상태: `docs/PROJECT_STATUS.md`
- 변경 내역: `docs/CHANGELOG.md`
- 다음 작업: `docs/TODO.md`
- 애니메이션 규칙: `docs/ANIMATION_GUIDE.md`
- 개발 원칙: `docs/DEVELOPMENT_RULE.md`
