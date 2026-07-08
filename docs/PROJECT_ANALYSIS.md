# 프로젝트 분석 문서

마지막 업데이트: 2026-07-08

이 문서는 프로젝트의 상세 분석을 한곳에 길게 쌓기보다, 장기 관리 문서들이 어디에 있는지 안내하는 역할을 한다. 이전에 이 문서에 있던 상세 상태, 애니메이션, 리소스 설명은 아래 문서로 나누어 정리했다.

## 문서 지도

- 현재 진행 상황과 코드 구조: `docs/PROJECT_STATUS.md`
- 날짜별 개발 내역: `docs/CHANGELOG.md`
- 앞으로 할 일: `docs/TODO.md`
- 애니메이션 규칙: `docs/ANIMATION_GUIDE.md`
- 개발 원칙: `docs/DEVELOPMENT_RULE.md`
- GitHub 첫 화면 소개: `README.md`

## 현재 분석 요약

프로젝트는 빌드 도구 없이 `index.html`, `css/style.css`, `js/main.js`, `assets/`로 구성된 정적 브라우저 토이다.

핵심 상태는 `js/main.js`의 `beetle` 객체가 관리한다.

```js
const beetle = {
    x: 50,
    y: 50,
    state: "idle",
    direction: "right",
    currentFrame: 1
};
```

현재 실제 상태는 `idle`, `walk`, `touch`, `happy`이며, 화면 갱신은 `updateBeetleView()`를 통해 이루어진다. `clearTimers()`는 idle 타이머, 프레임 타이머, 이동 애니메이션 프레임을 정리하는 중심 함수다.

현재 가장 가까운 확장 지점은 젤리 먹이 주기다. 관련 애셋인 `jelly.png`, `beetle_eat_oepn_*.png`, `beetle_eat_chew_*.png`는 이미 준비되어 있지만 아직 코드 상태에는 연결되지 않았다.

## 관리 방침

이 문서는 중복 설명을 길게 늘리지 않는다. 기능 구현 후에는 실제로 바뀐 영역에 맞춰 아래 문서를 우선 업데이트한다.

- 기능 상태 변경: `PROJECT_STATUS.md`
- 애니메이션 변경: `ANIMATION_GUIDE.md`
- 완료 기록: `CHANGELOG.md`
- 남은 작업 변경: `TODO.md`
- 원칙 변경: `DEVELOPMENT_RULE.md`
