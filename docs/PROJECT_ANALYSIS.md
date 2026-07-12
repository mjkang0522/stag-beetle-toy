# 프로젝트 분석 문서

마지막 업데이트: 2026-07-13

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
    flipX: -1,
    flipY: 1,
    currentFrame: 1
};
```

현재 실제 상태는 `idle`, `walk`, `follow`, `touch`, `happy`, `eatOpen`, `eatChew`이며, 화면 갱신은 `updateBeetleView()`를 통해 이루어진다. 사슴벌레 방향은 `flipX`, `flipY`로 관리하고, 평소에는 사슴벌레가 젤리보다 앞에 보인다. 젤리를 드래그하는 동안에는 젤리를 가장 앞으로 올리고, 사슴벌레를 드래그하는 동안에는 사슴벌레를 가장 앞으로 올린다. `clearTimers()`는 idle 타이머, 프레임 타이머, 이동 애니메이션 프레임을 정리하는 중심 함수다.

젤리는 화면에 표시되고 드래그할 수 있으며, 드래그해서 놓으면 사슴벌레가 `follow` 상태로 젤리 근처까지 이동한 뒤 먹이 주기 루프에 들어간다. 먹이 주기는 Eat(Open), Eat(Chew), 젤리 단계 이미지, Happy, 빈 접시 깜빡임, 새 젤리 낙하, Idle 복귀 순서로 연결되어 있다.

사슴벌레 입력은 짧은 터치, 긴 터치, 드래그를 구분하지 않고 같은 잡기 상태로 처리한다. 누르고 있는 동안에는 Touch 프레임 순서를 계속 반복하고, 포인터가 움직이면 사슴벌레 위치를 함께 갱신한다. `pointerup` 또는 `pointercancel`이 발생하면 현재 위치를 저장하고 Happy를 재생한 뒤 Idle로 돌아간다.

모바일 입력은 게임 화면 전체에서 가장 먼저 들어온 포인터 하나만 활성 입력으로 사용한다. `gameInput.activePointerId`가 화면 단위 잠금을 맡고, 사슴벌레와 젤리는 각각 자신의 `activePointerId`를 확인해 두 번째 손가락의 이동, 해제, 취소, 캡처 상실 이벤트가 현재 조작에 영향을 주지 않게 한다.

## 관리 방침

이 문서는 중복 설명을 길게 늘리지 않는다. 기능 구현 후에는 실제로 바뀐 영역에 맞춰 아래 문서를 우선 업데이트한다.

- 기능 상태 변경: `PROJECT_STATUS.md`
- 애니메이션 변경: `ANIMATION_GUIDE.md`
- 완료 기록: `CHANGELOG.md`
- 남은 작업 변경: `TODO.md`
- 원칙 변경: `DEVELOPMENT_RULE.md`
