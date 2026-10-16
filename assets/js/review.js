const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlFBgUtQYZiWvohdZFqPDpRiw0Yd7t-Q4ifrpUkmo_ra6V56KM-h27Ur5HpC_DZ1lcZGsNk87yEaT9/pub?gid=1510363189&single=true&output=csv';

const slot = document.getElementById('slot');
const startBtn = document.getElementById('startBtn');
const historyList = document.getElementById('history2');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const historyModal = document.getElementById('historyModal');
const loadingOverlay = document.getElementById('loadingOverlay');

let items = [];
let history = [];
let animationFrame;
let position = 0;
let speed = 30;
let isRolling = false;

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
    fullscreenBtn.style.visibility = 'hidden';
  } else {
    fullscreenBtn.style.visibility = 'visible';
  }
});


// 기록 보기 버튼 → 팝업 열기
showHistoryBtn.addEventListener('click', () => {
  historyModal.classList.remove('hidden');
});

// 닫기 버튼 → 팝업 닫기
closeHistoryBtn.addEventListener('click', () => {
  historyModal.classList.add('hidden');
});


//csv파일 로드
// csv파일 로드
async function loadItemsFromCSV() {
  const res = await fetch(csvUrl);
  const csv = await res.text();
  const lines = csv.trim().split('\n');

  items = lines.slice(1).map(line => {
    const columns = line.split(','); // CSV의 각 열을 나눔
    const name = columns[9]?.trim(); // J열의 데이터를 참조
    const weight = parseInt(columns[10]?.trim()); // K열의 데이터를 참조

    // J열과 K열이 비어있지 않은 경우에만 반환
    if (name && !isNaN(weight)) {
      return {
        name: name,
        weight: weight
      };
    }
  }).filter(item => item); // undefined 항목 제거

  initSlot();
  loadingOverlay.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
  loadItemsFromCSV();
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
  if (isRolling) return;
  isRolling = true;
  startBtn.classList.add('disabled');
  cancelAnimationFrame(animationFrame);
  initSlot();
  position = 0;
  speed = 30;
  rolling();
}

// 롤링 애니메이션
function rolling() {
  position += speed;
  slot.style.top = `-${position}px`;

  if (position > slot.scrollHeight - 100) {
    position = 0;
  }

  if (speed > 0.2) {
    speed *= 0.96;
    animationFrame = requestAnimationFrame(rolling);
  } else {
    stopAtResult();
  }
}

// 멈추기
function stopAtResult() {
  const itemHeight = slot.children[0]?.offsetHeight || 250;
  const finalTop = Math.round(position / itemHeight) * itemHeight;
  slot.style.top = `-${finalTop}px`;

  const index = Math.floor(finalTop / itemHeight) % slot.children.length;
  saveResult(slot.children[index].textContent);

  setTimeout(() => {
    isRolling = false;
    startBtn.classList.remove('disabled');
  }, 300);
}

// 결과 저장
function saveResult(item) {
  const now = new Date();
  const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  history.unshift({ name: item, time });
  if (history.length > 20) history.pop();
  renderHistory();
}

// 기록 렌더링
function renderHistory() {
  historyList.innerHTML = '';
  history.forEach((entry, idx) => {
    const li = document.createElement('li');
    li.innerHTML =
      `<span class="history-num">${idx + 1}</span>` +
      `<span class="history-name">${entry.name}</span>` +
      `<span class="history-time">${entry.time}</span>`;
    historyList.appendChild(li);
  });
}

startBtn.addEventListener('click', startRolling);

// 초기 셋업
initSlot();