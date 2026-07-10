console.log("우리집 사슴벌레 시작!");

// ==============================
// 이미지 경로 설정
// ==============================

const beetleImageFolder = "assets/beetle/";

const jellyImages = {
    full: "jelly.png",
    eaten01: "jelly_eaten_01.png",
    eaten02: "jelly_eaten_02.png",
    emptyPlate: "jelly_empty_plate.png"
};

const jellyRespawnSettings = {
    initialX: 50,
    initialY: 78,
    fallStartY: -12,
    fallDuration: 900,
    respawnDelay: 220,
    blinkDelay: 170,
    blinkToggleCount: 6
};

const feedingSettings = {
    finalBiteCount: 3,
    chewRepeatCount: 4
};

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
    ],

    eatOpen: [
        "beetle_eat_oepn_01.png",
        "beetle_eat_oepn_02.png",
        "beetle_eat_oepn_03.png",
        "beetle_eat_oepn_04.png"
    ],

    eatChew: [
        "beetle_eat_chew_01.png",
        "beetle_eat_chew_02.png"
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
    },

    eatOpen: {
        state: "eatOpen",
        frameOrder: [1, 2, 3, 4],
        frameDelay: 120
    },

    eatChew: {
        state: "eatChew",
        frameOrder: [1, 2],
        frameDelay: 160
    }
};

// ==============================
// HTML 요소 가져오기
// ==============================

const beetleElement = document.getElementById("beetle");
const beetleImageElement = document.getElementById("beetle_image");
const gameScreenElement = document.getElementById("game_screen");
const jellyElement = document.getElementById("jelly");
const jellyImageElement = document.getElementById("jelly_image");

// ==============================
// 레이어 설정
// ==============================

const LAYERS = {
    background: 0,
    jelly: 3,
    beetle: 4,
    draggingJelly: 10,
    draggingBeetle: 11
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
    x: jellyRespawnSettings.initialX,
    y: jellyRespawnSettings.initialY,
    targetX: jellyRespawnSettings.initialX,
    targetY: jellyRespawnSettings.initialY,
    imageFileName: jellyImages.full,
    opacity: 1,
    isVisible: true,
    isInteractionLocked: false,
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0
};

const feedingLoop = {
    isActive: false
};

const beetleInteraction = {
    activePointerId: null,
    isPointerDown: false,
    isHolding: false,
    dragOffsetX: 0,
    dragOffsetY: 0
};

// ==============================
// 타이머 관리용 변수
// ==============================

let idleTimer = null;
let frameTimer = null;
let moveAnimationId = null;
let jellyBlinkTimer = null;
let jellyRespawnTimer = null;
let jellyFallAnimationId = null;

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
    jellyElement.style.opacity = jelly.opacity;
    jellyElement.style.visibility = jelly.isVisible ? "visible" : "hidden";
    jellyElement.style.pointerEvents = jelly.isInteractionLocked || !jelly.isVisible ? "none" : "auto";
    jellyElement.disabled = jelly.isInteractionLocked || !jelly.isVisible;

    jellyImageElement.src = beetleImageFolder + jelly.imageFileName;
}

function updateObjectLayers() {
    beetleElement.style.zIndex = beetleInteraction.isHolding ? LAYERS.draggingBeetle : LAYERS.beetle;
    jellyElement.style.zIndex = jelly.isDragging ? LAYERS.draggingJelly : LAYERS.jelly;
}

function setJellyDraggingLayer(isDragging) {
    jelly.isDragging = isDragging;
    updateObjectLayers();
}

function setBeetleHoldingLayer(isHolding) {
    beetleInteraction.isHolding = isHolding;
    updateObjectLayers();
}

// ==============================
// 공통 기능
// ==============================

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function clampNumber(value, min, max) {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
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

    if (jellyBlinkTimer !== null) {
        clearInterval(jellyBlinkTimer);
        jellyBlinkTimer = null;
    }

    if (jellyRespawnTimer !== null) {
        clearTimeout(jellyRespawnTimer);
        jellyRespawnTimer = null;
    }

    if (jellyFallAnimationId !== null) {
        cancelAnimationFrame(jellyFallAnimationId);
        jellyFallAnimationId = null;
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
    if (feedingLoop.isActive) {
        return;
    }

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
        startFeedingLoop();
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
            startFeedingLoop();
        }
    }

    moveAnimationId = requestAnimationFrame(move);
}

// ==============================
// 먹이 주기 상태
// ==============================

function startFeedingLoop() {
    if (feedingLoop.isActive) {
        return;
    }

    clearTimers();

    feedingLoop.isActive = true;
    jelly.isDragging = false;
    jelly.isInteractionLocked = true;
    jelly.imageFileName = jellyImages.full;
    jelly.opacity = 1;
    jelly.isVisible = true;
    jelly.dragOffsetX = 0;
    jelly.dragOffsetY = 0;

    jellyElement.classList.remove("dragging");
    setJellyDraggingLayer(false);
    updateJellyView();

    playBiteStep(1);
}

function playBiteStep(biteCount) {
    playAnimation(animationSettings.eatOpen, function() {
        updateJellyImageAfterOpen(biteCount);

        if (biteCount < feedingSettings.finalBiteCount) {
            playChewRepeats(1, function() {
                playBiteStep(biteCount + 1);
            });
        } else {
            playAnimation(animationSettings.happy, function() {
                blinkEmptyPlate();
            });
        }
    });
}

function playChewRepeats(repeatCount, onComplete) {
    playAnimation(animationSettings.eatChew, function() {
        if (repeatCount < feedingSettings.chewRepeatCount) {
            playChewRepeats(repeatCount + 1, onComplete);
        } else if (onComplete) {
            onComplete();
        }
    });
}

function updateJellyImageAfterOpen(biteCount) {
    if (biteCount === 1) {
        jelly.imageFileName = jellyImages.eaten01;
    }

    if (biteCount === 2) {
        jelly.imageFileName = jellyImages.eaten02;
    }

    if (biteCount === 3) {
        jelly.imageFileName = jellyImages.emptyPlate;
    }

    updateJellyView();
}

function blinkEmptyPlate() {
    jelly.imageFileName = jellyImages.emptyPlate;
    jelly.opacity = 1;
    jelly.isVisible = true;
    updateJellyView();

    let toggleCount = 0;

    jellyBlinkTimer = setInterval(function() {
        toggleCount = toggleCount + 1;
        jelly.opacity = jelly.opacity === 1 ? 0 : 1;

        updateJellyView();

        if (toggleCount >= jellyRespawnSettings.blinkToggleCount) {
            clearInterval(jellyBlinkTimer);
            jellyBlinkTimer = null;
            hideEmptyPlateBeforeRespawn();
        }
    }, jellyRespawnSettings.blinkDelay);
}

function hideEmptyPlateBeforeRespawn() {
    jelly.opacity = 0;
    jelly.isVisible = false;
    updateJellyView();

    jellyRespawnTimer = setTimeout(function() {
        jellyRespawnTimer = null;
        dropNewJelly();
    }, jellyRespawnSettings.respawnDelay);
}

function dropNewJelly() {
    jelly.x = jellyRespawnSettings.initialX;
    jelly.y = jellyRespawnSettings.fallStartY;
    jelly.imageFileName = jellyImages.full;
    jelly.opacity = 1;
    jelly.isVisible = true;
    jelly.isInteractionLocked = true;

    updateJellyView();

    const startY = jellyRespawnSettings.fallStartY;
    const targetY = jellyRespawnSettings.initialY;
    const startTime = performance.now();

    function fall(currentTime) {
        const elapsedTime = currentTime - startTime;
        let progress = elapsedTime / jellyRespawnSettings.fallDuration;

        if (progress > 1) {
            progress = 1;
        }

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        jelly.y = startY + (targetY - startY) * easedProgress;
        updateJellyView();

        if (progress < 1) {
            jellyFallAnimationId = requestAnimationFrame(fall);
        } else {
            jellyFallAnimationId = null;
            finishFeedingLoop();
        }
    }

    jellyFallAnimationId = requestAnimationFrame(fall);
}

function finishFeedingLoop() {
    jelly.x = jellyRespawnSettings.initialX;
    jelly.y = jellyRespawnSettings.initialY;
    jelly.imageFileName = jellyImages.full;
    jelly.opacity = 1;
    jelly.isVisible = true;
    jelly.isInteractionLocked = false;
    feedingLoop.isActive = false;

    updateJellyView();
    startIdleState();
}

// ==============================
// Touch 상태
// ==============================

function startBeetleInteraction(event) {
    event.preventDefault();

    if (isBeetleInteractionLocked()) {
        return;
    }

    clearTimers();

    beetleInteraction.activePointerId = event.pointerId;
    beetleInteraction.isPointerDown = true;

    setBeetleDragOffset(event);

    captureBeetlePointer(event.pointerId);

    beetleElement.classList.add("dragging");
    setBeetleHoldingLayer(true);
    playLoopAnimation(animationSettings.touch);
}

function isBeetleInteractionLocked() {
    return beetleInteraction.activePointerId !== null ||
        jelly.isDragging ||
        jelly.isInteractionLocked ||
        beetle.state === "touch" ||
        beetle.state === "happy" ||
        beetle.state === "eatOpen" ||
        beetle.state === "eatChew" ||
        feedingLoop.isActive;
}

function setBeetleDragOffset(event) {
    const beetleRect = beetleElement.getBoundingClientRect();

    beetleInteraction.dragOffsetX = event.clientX - (beetleRect.left + beetleRect.width / 2);
    beetleInteraction.dragOffsetY = event.clientY - (beetleRect.top + beetleRect.height / 2);
}

function isActiveBeetlePointer(event) {
    return beetleInteraction.activePointerId === event.pointerId;
}

function moveBeetleInteraction(event) {
    if (!isActiveBeetlePointer(event) || !beetleInteraction.isPointerDown) {
        return;
    }

    event.preventDefault();
    moveHeldBeetleToPointer(event.clientX, event.clientY);
}

function moveHeldBeetleToPointer(clientX, clientY) {
    const nextPosition = getBeetlePositionFromPointer(clientX, clientY);

    updateBeetleFlip(beetle.x, beetle.y, nextPosition.x, nextPosition.y);

    beetle.x = nextPosition.x;
    beetle.y = nextPosition.y;
    beetle.state = "touch";

    updateBeetleView();
}

function getBeetlePositionFromPointer(clientX, clientY) {
    const screenRect = gameScreenElement.getBoundingClientRect();
    const beetleRect = beetleElement.getBoundingClientRect();
    let minX = beetleRect.width / 2;
    let minY = beetleRect.height / 2;
    let maxX = screenRect.width - minX;
    let maxY = screenRect.height - minY;

    if (minX > maxX) {
        minX = screenRect.width / 2;
        maxX = minX;
    }

    if (minY > maxY) {
        minY = screenRect.height / 2;
        maxY = minY;
    }

    const pointerX = clientX - screenRect.left - beetleInteraction.dragOffsetX;
    const pointerY = clientY - screenRect.top - beetleInteraction.dragOffsetY;

    return {
        x: clampNumber(pointerX, minX, maxX) / screenRect.width * 100,
        y: clampNumber(pointerY, minY, maxY) / screenRect.height * 100
    };
}

function stopBeetleInteraction(event) {
    if (!isActiveBeetlePointer(event)) {
        return;
    }

    event.preventDefault();
    beetleInteraction.isPointerDown = false;
    moveHeldBeetleToPointer(event.clientX, event.clientY);
    finishBeetleInteractionWithHappy();
}

function cancelBeetleInteraction(event) {
    if (!isActiveBeetlePointer(event)) {
        return;
    }

    event.preventDefault();
    beetleInteraction.isPointerDown = false;
    finishBeetleInteractionWithHappy();
}

function finishBeetleInteractionWithHappy() {
    const pointerId = beetleInteraction.activePointerId;

    clearTimers();
    resetBeetleInteraction();
    releaseBeetlePointerCapture(pointerId);

    playAnimation(animationSettings.happy, function() {
        startIdleState();
    });
}

function resetBeetleInteraction() {
    beetleElement.classList.remove("dragging");
    setBeetleHoldingLayer(false);

    beetleInteraction.activePointerId = null;
    beetleInteraction.isPointerDown = false;
    beetleInteraction.dragOffsetX = 0;
    beetleInteraction.dragOffsetY = 0;
}

function releaseBeetlePointerCapture(pointerId) {
    if (pointerId === null) {
        return;
    }

    if (!beetleElement.hasPointerCapture || !beetleElement.releasePointerCapture) {
        return;
    }

    try {
        if (beetleElement.hasPointerCapture(pointerId)) {
            beetleElement.releasePointerCapture(pointerId);
        }
    } catch (error) {
        return;
    }
}

function captureBeetlePointer(pointerId) {
    if (!beetleElement.setPointerCapture) {
        return;
    }

    try {
        beetleElement.setPointerCapture(pointerId);
    } catch (error) {
        return;
    }
}

beetleElement.addEventListener("pointerdown", startBeetleInteraction);
document.addEventListener("pointermove", moveBeetleInteraction);
document.addEventListener("pointerup", stopBeetleInteraction);
document.addEventListener("pointercancel", cancelBeetleInteraction);

// ==============================
// 젤리 드래그
// ==============================

function isJellyDragLocked() {
    return beetleInteraction.activePointerId !== null ||
        beetle.state === "happy" ||
        jelly.isInteractionLocked ||
        feedingLoop.isActive ||
        !jelly.isVisible;
}

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

    if (isJellyDragLocked()) {
        return;
    }

    const jellyRect = jellyElement.getBoundingClientRect();

    jelly.isDragging = true;
    jelly.dragOffsetX = event.clientX - (jellyRect.left + jellyRect.width / 2);
    jelly.dragOffsetY = event.clientY - (jellyRect.top + jellyRect.height / 2);

    jellyElement.classList.add("dragging");
    setJellyDraggingLayer(true);
    jellyElement.setPointerCapture(event.pointerId);
}

function moveJelly(event) {
    if (!jelly.isDragging || isJellyDragLocked()) {
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

    if (shouldStartFollow && !isJellyDragLocked()) {
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
