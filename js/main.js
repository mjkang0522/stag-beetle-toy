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

    follow: [
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

    walk: {
        state: "walk",
        frameOrder: [1, 2],
        frameDelay: 180
    },

    follow: {
        state: "follow",
        frameOrder: [1, 2],
        frameDelay: 180
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
// 레이어 설정
// ==============================

const LAYERS = {
    background: 0,
    jelly: 3,
    beetle: 4,
    draggingJelly: 10
};

// ==============================
// 사슴벌레 객체
// ==============================

const beetle = {
    x: 50,
    y: 50,
    state: "idle",
    flipX: -1,
    flipY: 1,
    currentFrame: 1
};

const jelly = {
    x: 50,
    y: 78,
    targetX: 50,
    targetY: 78,
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
    beetleElement.style.transform = "translate(-50%, -50%) scale(" + beetle.flipX + ", " + beetle.flipY + ")";

    const frameList = beetleFrames[beetle.state];
    const imageFileName = frameList[beetle.currentFrame - 1];

    beetleImageElement.src = beetleImageFolder + imageFileName;
}

function updateJellyView() {
    jellyElement.style.left = jelly.x + "%";
    jellyElement.style.top = jelly.y + "%";
}

function setJellyDraggingLayer(isDragging) {
    beetleElement.style.zIndex = LAYERS.beetle;
    jellyElement.style.zIndex = isDragging ? LAYERS.draggingJelly : LAYERS.jelly;
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

    updateBeetleFlip(startX, startY, targetX, targetY);

    startWalkAnimation();
    moveBeetleTo(startX, startY, targetX, targetY);
}

function updateBeetleFlip(startX, startY, targetX, targetY) {
    const directionThreshold = 0.1;
    const dx = targetX - startX;
    const dy = targetY - startY;

    if (dx > directionThreshold) {
        beetle.flipX = -1;
    }

    if (dx < -directionThreshold) {
        beetle.flipX = 1;
    }

    if (dy > directionThreshold) {
        beetle.flipY = -1;
    }

    if (dy < -directionThreshold) {
        beetle.flipY = 1;
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
    playLoopAnimation(animationSettings.walk);
}

function playLoopAnimation(animationSetting) {
    beetle.state = animationSetting.state;
    beetle.currentFrame = animationSetting.frameOrder[0];

    updateBeetleView();

    let frameIndex = 0;

    frameTimer = setInterval(function() {
        frameIndex = frameIndex + 1;

        if (frameIndex >= animationSetting.frameOrder.length) {
            frameIndex = 0;
        }

        beetle.currentFrame = animationSetting.frameOrder[frameIndex];

        updateBeetleView();
    }, animationSetting.frameDelay);
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
// Follow 상태
// ==============================

function startFollowState() {
    clearTimers();

    jelly.targetX = jelly.x;
    jelly.targetY = jelly.y;

    const startX = beetle.x;
    const startY = beetle.y;
    const targetX = jelly.targetX;
    const targetY = jelly.targetY;

    updateBeetleFlip(startX, startY, targetX, targetY);

    const distanceToJelly = getDistance(startX, startY, targetX, targetY);
    const arriveDistance = 7;

    if (distanceToJelly <= arriveDistance) {
        startIdleState();
        return;
    }

    playLoopAnimation(animationSettings.follow);
    moveBeetleToJelly(startX, startY, targetX, targetY, arriveDistance);
}

function getDistance(startX, startY, targetX, targetY) {
    const distanceX = targetX - startX;
    const distanceY = targetY - startY;

    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

function moveBeetleToJelly(startX, startY, targetX, targetY, arriveDistance) {
    const distanceToJelly = getDistance(startX, startY, targetX, targetY);
    const followSpeed = 8;
    const moveDuration = distanceToJelly / followSpeed * 1000;
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

        const remainingDistance = getDistance(beetle.x, beetle.y, targetX, targetY);

        if (remainingDistance > arriveDistance && progress < 1) {
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
    setJellyDraggingLayer(true);
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
    finishJellyDrag(event, true);
}

function cancelJellyDrag(event) {
    finishJellyDrag(event, false);
}

function finishJellyDrag(event, shouldStartFollow) {
    if (!jelly.isDragging) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    jelly.isDragging = false;
    jelly.dragOffsetX = 0;
    jelly.dragOffsetY = 0;

    jellyElement.classList.remove("dragging");
    setJellyDraggingLayer(false);

    if (jellyElement.hasPointerCapture(event.pointerId)) {
        jellyElement.releasePointerCapture(event.pointerId);
    }

    if (shouldStartFollow) {
        startFollowState();
    }
}

jellyElement.addEventListener("pointerdown", startJellyDrag);
jellyElement.addEventListener("lostpointercapture", stopJellyDrag);
document.addEventListener("pointermove", moveJelly);
document.addEventListener("pointerup", stopJellyDrag);
document.addEventListener("pointercancel", cancelJellyDrag);

// ==============================
// 시작
// ==============================

updateBeetleView();
updateJellyView();
setJellyDraggingLayer(false);
startIdleState();
