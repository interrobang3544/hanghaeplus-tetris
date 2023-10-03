// 전역변수 선언
const blocks = {
  I: [
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
  ],
  SQ: [
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 2],
    ],
  ],
  T: [
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
  ],
  L: [
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  ],
  J: [
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 0],
    ],
    [
      [0, 2],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [2, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  ],
  S: [
    [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
  ],
  Z: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 0],
    ],
  ],
};
let nextBlock = {
  x: 3,
  y: 0,
  shape: makeNextBlock(),
  direction: 0,
};
let currentBlock, gameTimeInterval, downInterval, levelInterval, level;

// 게임 시작
gameStart();
function gameStart() {
  currentBlock = Object.assign({}, nextBlock);

  // 게임 시간 초기화 및 설정
  document.getElementById("time").innerText = "0 sec";
  let startTime = performance.now();
  clearInterval(gameTimeInterval);
  gameTimeInterval = setInterval(() => {
    let endTime = performance.now();
    let gameTime = endTime - startTime;
    let gameTimeSecond = Math.floor(gameTime / 1000) % 60;
    let gameTimeMinute = Math.floor(gameTime / 1000 / 60) % 60;
    let gameTimeHour = Math.floor(gameTime / 1000 / 60 / 60);

    let time = document.getElementById("time");
    text = "";
    if (gameTimeHour !== 0) {
      text += gameTimeHour + " hr ";
    }
    if (gameTimeMinute !== 0) {
      text += gameTimeMinute + " min ";
    }
    text += gameTimeSecond + " sec ";
    time.innerText = text;
  }, 1000);

  // 레벨 초기화 및 설정
  level = 1;
  document.getElementById("level").innerText = level;
  clearInterval(levelInterval);
  levelInterval = setInterval(() => {
    increaseLevel();
    if (level === 10) {
      clearInterval(levelInterval);
    }
  }, 30000);

  // 점수 초기화
  document.getElementById("score").innerText = 0;

  // 블럭 인터벌 초기화
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("y", 1);
  }, 1000);

  // 엘리먼트, 이벤트 초기화
  generateGameTbody();
  renderBlock();
  nextBlock.shape = makeNextBlock();
  document.addEventListener("keydown", keyDownEvent);
  document.querySelector(".restart").blur();

  // game over 숨기기
  const endAlert = document.querySelector(".game-end");
  endAlert.style.color = "rgba(255, 0, 0, 0)";
  endAlert.style.backgroundColor = "rgba(0, 0, 0, 0)";
}

// 키입력 케이스 설정
function keyDownEvent(e) {
  switch (e.key) {
    case "ArrowRight":
      moveBlock("x", 1);
      break;
    case "ArrowLeft":
      moveBlock("x", -1);
      break;
    case "ArrowDown":
      moveBlock("y", 1);
      break;
    case "ArrowUp":
      rotateBlock();
      break;
    case " ":
      dropBlock();
      break;
    default:
      break;
  }
}

// 게임 레벨(속도) 증가
function increaseLevel() {
  level += 1;
  if (level === 10) {
    document.getElementById("level").innerText = level + " (MAX)";
  } else {
    document.getElementById("level").innerText = level;
  }
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("y", 1);
  }, 1000 - 70 * level);
}

// 게임판 생성
function generateGameTbody() {
  let tbody = "";
  for (let i = 0; i < 20; i++) {
    tbody += "<tr>";
    for (let j = 0; j < 10; j++) {
      tbody += "<td></td>";
    }
    tbody += "</tr>";
  }

  document.querySelector(".game-tbody").innerHTML = tbody;
}

// 다음 블럭 표시판 생성
function generateNextBlockTbody() {
  let tbody = "";
  for (let i = 0; i < 4; i++) {
    tbody += "<tr>";
    for (let j = 0; j < 3; j++) {
      tbody += "<td></td>";
    }
    tbody += "</tr>";
  }

  document.querySelector(".next-block-tbody").innerHTML = tbody;
}

// 다음 블럭 shape 랜덤 생성
function makeNextBlock() {
  const blockKeyArray = Object.keys(blocks);
  const randomIndex = Math.floor(Math.random() * blockKeyArray.length);
  const shape = blockKeyArray[randomIndex];
  renderNextBlock(shape);
  return shape;
}

// 다음 블럭 표시
function renderNextBlock(shape) {
  generateNextBlockTbody();

  blocks[shape][0].forEach((block) => {
    const target = document.querySelector(".next-block-tbody").childNodes[block[0]].childNodes[block[1]];
    target.classList.add(shape, "next-block");
  });
}

// 현재 블럭 표시
function renderBlock() {
  const { x, y, shape, direction } = currentBlock;

  document.querySelectorAll(".moving").forEach((block) => {
    block.classList.remove(shape, "moving");
  });

  blocks[shape][direction].forEach((block) => {
    const yCoord = block[0] + y;
    const xCoord = block[1] + x;

    const target = document.querySelector(".game-tbody").childNodes[yCoord].childNodes[xCoord];

    if (checkGameEnd()) {
      target.classList.add(shape, "fix");
      endGame();
    } else {
      target.classList.add(shape, "moving");
    }
  });
}

// 현재 블럭 이동(← → ↓)
function moveBlock(where, amount) {
  currentBlock[where] += amount;
  if (checkMovingBlock(where)) {
    renderBlock();
  } else {
    currentBlock[where] -= amount;
    renderBlock();
  }
}

// 현재 블럭 회전(↑)
function rotateBlock() {
  currentBlock.direction === 3 ? (currentBlock.direction = 0) : (currentBlock.direction += 1);
  if (checkRotatingBlock()) {
    renderBlock();
  } else {
    currentBlock.direction === 0 ? (currentBlock.direction = 3) : (currentBlock.direction -= 1);
    renderBlock();
  }
}

// 현재 블럭 드롭(spacebar)
function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("y", 1);
  }, 2);
}

// 이동 불가능한 블럭 고정
function fixBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("y", 1);
  }, 1000 - 70 * level);

  document.querySelectorAll(".moving").forEach((block) => {
    block.classList.remove("moving");
    block.classList.add("fix");
  });

  breakBlock();

  currentBlock = Object.assign({}, nextBlock);
  nextBlock.shape = makeNextBlock();
}

// 완성 라인 파괴
function breakBlock() {
  let tbody = document.querySelector(".game-tbody");
  let score = document.getElementById("score");
  tbody.childNodes.forEach((tr) => {
    if (Object.values(tr.childNodes).every((td) => td.classList.contains("fix"))) {
      tr.remove();

      let newTr = document.createElement("tr");
      let HTML = "";
      for (let j = 0; j < 10; j++) {
        HTML += "<td></td>";
      }
      newTr.innerHTML = HTML;
      score.innerText = parseInt(score.innerText) + 1;
      tbody.prepend(newTr);
    }
  });
}

// 현재 블럭 이동 유효성 검사
function checkMovingBlock(where = "") {
  const { x, y, shape, direction } = currentBlock;
  let isIn = true;

  for (let block of blocks[shape][direction]) {
    const yCoord = block[0] + y;
    const xCoord = block[1] + x;
    const target = document.querySelector(".game-tbody").childNodes[yCoord]
      ? document.querySelector(".game-tbody").childNodes[yCoord].childNodes[xCoord]
      : null;

    if (xCoord < 0 || xCoord > 9) {
      isIn = false;
      break;
    } else if (yCoord > 19) {
      fixBlock();
      isIn = true;
      break;
    } else if (where === "x" && target && target.classList.contains("fix")) {
      isIn = false;
      break;
    } else if (target && target.classList.contains("fix")) {
      fixBlock();
      isIn = true;
      break;
    }
  }

  return isIn;
}

// 현재 블럭 회전 유효성 검사
function checkRotatingBlock() {
  const { x, y, shape, direction } = currentBlock;
  let isIn = true;

  blocks[shape][direction].forEach((block) => {
    const yCoord = block[0] + y;
    const xCoord = block[1] + x;
    const target = document.querySelector(".game-tbody").childNodes[yCoord]
      ? document.querySelector(".game-tbody").childNodes[yCoord].childNodes[xCoord]
      : null;

    if (xCoord < 0 || xCoord > 9) {
      isIn = false;
    } else if (yCoord > 19) {
      isIn = false;
    } else if (target && target.classList.contains("fix")) {
      isIn = false;
    }
  });

  return isIn;
}

// 게임 종료 검사
function checkGameEnd() {
  const { x, y, shape, direction } = currentBlock;
  let isEnd = false;

  for (let block of blocks[shape][direction]) {
    const yCoord = block[0] + y;
    const xCoord = block[1] + x;
    const target = document.querySelector(".game-tbody").childNodes[yCoord].childNodes[xCoord];

    if (target && target.classList.contains("fix")) {
      isEnd = true;
      break;
    }
  }

  return isEnd;
}

// 게임 종료
function endGame() {
  clearInterval(downInterval);
  clearInterval(gameTimeInterval);

  let tbody = document.querySelector(".game-tbody");

  tbody.childNodes.forEach((tr, index) => {
    tr.childNodes.forEach((td) => {
      setTimeout(() => {
        if (td.classList.contains("fix")) {
          td.style.backgroundColor = "gray";
        }
      }, 30 * index);
    });
  });

  setTimeout(() => {
    const endModal = document.querySelector(".game-end");
    endModal.style.color = "rgba(255, 0, 0, 1)";
    endModal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  }, 600);

  document.removeEventListener("keydown", keyDownEvent);
}
