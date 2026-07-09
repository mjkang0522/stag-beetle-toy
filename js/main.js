console.log("우리집 사슴벌레 시작!");

// ==============================
// 이미지 경로 설정
// ==============================

const beetleImageFolder = "assets/beetle/";

const beetleFrames = {
    idle: [
        "beetle_idle_01.png",
        "beetle_idle_02.png",
        "beetle_idle_03.png"
    ],

    walk: [
        "beetle_walk_01.png",
        "beetle_walk_02.png"
    ],

    touch: [
        "beetle_touch_01.png",
        "beetle_touch_02.png",
        "beetle_touch_03.png"
    ],

    happy: [
        "beetle_happy_01.png",
        "beetle_happy_02.png",
        "beetle_happy_03.png"
    ]
};

// ==============================
// 애니메이션 설정
// ==============================

const animationSettings = {
    idleBlink: {
        state: "idle",
        frameOrder: [2, 3, 2, 1],
        frameDelay: 100
    },

    touch: {
        state: "touch",
        frameOrder: [1, 2, 3, 2, 1, 1, 1, 1, 1],
        frameDelay: 100
    },

    happy: {
        state: "happy",
        frameOrder: [1, 2, 3, 2, 1, 2, 3, 2],
        frameDelay: 80
    }
};

// ==============================
// HTML 요소 가져오기
// ==============================

const beetleElement = document.getElementById("beetle");
const beetleImageElement = document.getElementById("beetle_image");
const gameScreenElement = document.getElementById("game_screen");
const jellyElement = document.getElementById("jelly");

// ==============================
// 사슴벌레 객체
// ==============================

const beetle = {
    x: 50,
    y: 50,
    state: "idle",
    direction: "right",
    currentFrame: 1
};

const jelly = {
    x: 50,
    y: 78,
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0
};

// ==============================
// 타이머 관리용 변수
// ==============================

let idleTimer = null;
let frameTimer = null;
let moveAnimationId = null;

// ==============================
// 화면 갱신
// ==============================

function updateBeetleView() {
    beetleElement.style.left = beetle.x + "%";
    beetleElement.style.top = beetle.y + "%";

    // 현재 사슴벌레 원본 이미지는 왼쪽을 바라보고 있다.
    // 그래서 오른쪽으로 이동할 때만 좌우 반전한다.
    if (beetle.direction === "right") {
        beetleElement.style.transform = "translate(-50%, -50%) scaleX(-1)";
    } else {
        beetleElement.style.transform = "translate(-50%, -50%) scaleX(1)";
    }

    const frameList = beetleFrames[beetle.state];
    const imageFileName = frameList[beetle.currentFrame - 1];

    beetleImageElement.src = beetleImageFolder + imageFileName;
}

function updateJellyView() {
    jellyElement.style.left = jelly.x + "%";
    jellyElement.style.top = jelly.y + "%";
}

// ==============================
// 공통 기능
// ==============================

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function clearTimers() {
    if (idleTimer !== null) {
        clearTimeout(idleTimer);
        idleTimer = null;
    }

    if (frameTimer !== null) {
        clearInterval(frameTimer);
        frameTimer = null;
    }

    if (moveAnimationId !== null) {
        cancelAnimationFrame(moveAnimationId);
        moveAnimationId = null;
    }
}

function playAnimation(animationSetting, onComplete) {
    beetle.state = animationSetting.state;
    beetle.currentFrame = animationSetting.frameOrder[0];

    updateBeetleView();

    let frameIndex = 0;

    frameTimer = setInterval(function() {
        frameIndex = frameIndex + 1;

        if (frameIndex >= animationSetting.frameOrder.length) {
            clearInterval(frameTimer);
            frameTimer = null;

            if (onComplete) {
                onComplete();
            }

            return;
        }

        beetle.currentFrame = animationSetting.frameOrder[frameIndex];
        updateBeetleView();
    }, animationSetting.frameDelay);
}

// ==============================
// Idle 상태
// ==============================

function startIdleState() {
    clearTimers();

    beetle.state = "idle";
    beetle.currentFrame = 1;

    updateBeetleView();
    scheduleNextIdleAction();
}

function scheduleNextIdleAction() {
    const waitTime = getRandomNumber(1000, 4000);

    idleTimer = setTimeout(function() {
        const walkChance = 0.45;

        if (Math.random() < walkChance) {
            startWalkState();
        } else {
            playIdleBlink();
        }
    }, waitTime);
}

function playIdleBlink() {
    playAnimation(animationSettings.idleBlink, function() {
        scheduleNextIdleAction();
    });
}

// ==============================
// Walk 상태
// ==============================

function startWalkState() {
    clearTimers();

    beetle.state = "walk";
    beetle.currentFrame = 1;

    const startX = beetle.x;
    const startY = beetle.y;

    const targetX = getRandomTargetX(startX);
    const targetY = getRandomTargetY(startY);

    updateBeetleDirection(startX, targetX);

    startWalkAnimation();
    moveBeetleTo(startX, startY, targetX, targetY);
}

function updateBeetleDirection(startX, targetX) {
    if (targetX < startX) {
        beetle.direction = "left";
    } else {
        beetle.direction = "right";
    }
}

function getRandomTargetX(currentX) {
    const moveDistance = getRandomNumber(15, 30);
    const moveDirection = Math.random() < 0.5 ? -1 : 1;

    let targetX = currentX + moveDistance * moveDirection;

    if (targetX < 15) {
        targetX = 15;
    }

    if (targetX > 85) {
        targetX = 85;
    }

    return targetX;
}

function getRandomTargetY(currentY) {
    const moveDistance = getRandomNumber(5, 16);
    const moveDirection = Math.random() < 0.5 ? -1 : 1;

    let targetY = currentY + moveDistance * moveDirection;

    if (targetY < 20) {
        targetY = 20;
    }

    if (targetY > 80) {
        targetY = 80;
    }

    return targetY;
}

function startWalkAnimation() {
    const frameDelay = 180;

    frameTimer = setInterval(function() {
        if (beetle.currentFrame === 1) {
            beetle.currentFrame = 2;
        } else {
            beetle.currentFrame = 1;
        }

        updateBeetleView();
    }, frameDelay);
}

function moveBeetleTo(startX, startY, targetX, targetY) {
    const moveDuration = getRandomNumber(2500, 4000);
    const startTime = performance.now();

    function move(currentTime) {
        const elapsedTime = currentTime - startTime;
        let progress = elapsedTime / moveDuration;

        if (progress > 1) {
            progress = 1;
        }

        beetle.x = startX + (targetX - startX) * progress;
        beetle.y = startY + (targetY - startY) * progress;

        updateBeetleView();

        if (progress < 1) {
            moveAnimationId = requestAnimationFrame(move);
        } else {
            startIdleState();
        }
    }

    moveAnimationId = requestAnimationFrame(move);
}

// ==============================
// Touch 상태
// ==============================

function startTouchReaction() {
    if (beetle.state === "touch" || beetle.state === "happy") {
        return;
    }

    clearTimers();

    playAnimation(animationSettings.touch, function() {
        playAnimation(animationSettings.happy, function() {
            startIdleState();
        });
    });
}

beetleElement.addEventListener("pointerdown", function(event) {
    event.preventDefault();

    startTouchReaction();
});

// ==============================
// 젤리 드래그
// ==============================

function getJellyPositionFromPointer(event) {
    const screenRect = gameScreenElement.getBoundingClientRect();
    const jellyRect = jellyElement.getBoundingClientRect();
    const minX = jellyRect.width / 2;
    const minY = jellyRect.height / 2;
    const maxX = screenRect.width - minX;
    const maxY = screenRect.height - minY;

    let pointerX = event.clientX - screenRect.left - jelly.dragOffsetX;
    let pointerY = event.clientY - screenRect.top - jelly.dragOffsetY;

    if (pointerX < minX) {
        pointerX = minX;
    }

    if (pointerY < minY) {
        pointerY = minY;
    }

    if (pointerX > maxX) {
        pointerX = maxX;
    }

    if (pointerY > maxY) {
        pointerY = maxY;
    }

    return {
        x: pointerX / screenRect.width * 100,
        y: pointerY / screenRect.height * 100
    };
}

function startJellyDrag(event) {
    event.preventDefault();
    event.stopPropagation();

    const jellyRect = jellyElement.getBoundingClientRect();

    jelly.isDragging = true;
    jelly.dragOffsetX = event.clientX - (jellyRect.left + jellyRect.width / 2);
    jelly.dragOffsetY = event.clientY - (jellyRect.top + jellyRect.height / 2);

    jellyElement.classList.add("dragging");
    jellyElement.setPointerCapture(event.pointerId);
}

function moveJelly(event) {
    if (!jelly.isDragging) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const nextPosition = getJellyPositionFromPointer(event);

    jelly.x = nextPosition.x;
    jelly.y = nextPosition.y;

    updateJellyView();
}

function stopJellyDrag(event) {
    if (!jelly.isDragging) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    jelly.isDragging = false;
    jelly.dragOffsetX = 0;
    jelly.dragOffsetY = 0;

    jellyElement.classList.remove("dragging");

    if (jellyElement.hasPointerCapture(event.pointerId)) {
        jellyElement.releasePointerCapture(event.pointerId);
    }
}

jellyElement.addEventListener("pointerdown", startJellyDrag);
jellyElement.addEventListener("lostpointercapture", stopJellyDrag);
document.addEventListener("pointermove", moveJelly);
document.addEventListener("pointerup", stopJellyDrag);
document.addEventListener("pointercancel", stopJellyDrag);

// ==============================
// 시작
// ==============================

updateBeetleView();
updateJellyView();
startIdleState();
