const items = JSON.parse(localStorage.getItem('items2')) || []; 

const slot = document.getElementById('slot');
const startBtn = document.getElementById('startBtn');
const historyList = document.getElementById('history2');

let history = [];
let animationFrame;
let position = 0;
let speed = 30;

const fullscreenBtn = document.getElementById('fullscreenBtn');

// 전체화면 진입 버튼 클릭
fullscreenBtn.addEventListener('click', openFullscreen);

// 전체화면 요청
function openFullscreen() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
}

// 전체화면 상태 변화 감지
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    // 전체화면 모드 진입했으면 버튼 숨기기
    fullscreenBtn.style.display = 'none';
  } else {
    // 전체화면 종료했으면 버튼 다시 보이기
    fullscreenBtn.style.display = 'block';
  }
});




// 초기 슬롯 셋업
function initSlot() {
  slot.innerHTML = '';
  // 항목을 충분히 많이 복제해서 길게 만든다
  for (let i = 0; i < 50; i++) {
    const itemDiv = document.createElement('div');
    const randomItem = weightedRandom(items);
    itemDiv.textContent = randomItem.name;
    slot.appendChild(itemDiv);
  }
}

// 가중치 기반 랜덤
function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let randomNum = Math.random() * totalWeight;
  for (let item of items) {
    if (randomNum < item.weight) {
      return item;
    }
    randomNum -= item.weight;
  }
}

// 뽑기 시작
function startRolling() {
  cancelAnimationFrame(animationFrame);
  initSlot();
  position = 0;
  speed = 30; // 초기 빠른 속도
  rolling();
}

// 롤링 애니메이션
function rolling() {
  position += speed;
  slot.style.top = `-${position}px`;

  // 끝까지 가면 다시 위로
  if (position > slot.scrollHeight - 100) {
    position = 0;
  }

  // 감속 시작
  if (speed > 1) {
    speed *= 0.97; // 점점 느려짐
    animationFrame = requestAnimationFrame(rolling);
  } else {
    stopAtResult();
  }
}

// 멈추기
function stopAtResult() {
  const finalTop = Math.round(position / 100) * 100;
  slot.style.top = `-${finalTop}px`;

  const index = Math.floor(finalTop / 100) % slot.children.length;
  const selectedItem = slot.children[index].textContent;

  saveResult(selectedItem);
}

// 결과 저장
function saveResult(item) {
  history.unshift(item);
  if (history.length > 20) {
    history.pop();
  }
  renderHistory();
}

// 기록 렌더링
function renderHistory() {
  historyList.innerHTML = '';
  history.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${item}`;
    historyList.appendChild(li);
  });
}

startBtn.addEventListener('click', startRolling);

// 초기 셋업
initSlot();