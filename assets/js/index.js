
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlFBgUtQYZiWvohdZFqPDpRiw0Yd7t-Q4ifrpUkmo_ra6V56KM-h27Ur5HpC_DZ1lcZGsNk87yEaT9/pub?gid=143793284&single=true&output=csv';

const slot = document.getElementById('slot');
const startBtn = document.getElementById('startBtn');
const historyList = document.getElementById('history');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const historyModal = document.getElementById('historyModal');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let items = [];
let history = [];
let animationFrame;
let position = 0;
let speed = 30;



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


// 기록 보기 버튼 → 팝업 열기
showHistoryBtn.addEventListener('click', () => {
  historyModal.classList.remove('hidden');
});

// 닫기 버튼 → 팝업 닫기
closeHistoryBtn.addEventListener('click', () => {
  historyModal.classList.add('hidden');
});

//csv파일 로드
async function loadItemsFromCSV() {
  const res = await fetch(csvUrl);
  const csv = await res.text();
  const lines = csv.trim().split('\n');

  items = lines.slice(1).map(line => {
    const [name, weight] = line.split(',');
    return {
      name: name.trim(),
      weight: parseInt(weight)
    };
  });

  initSlot(); // 슬롯에 반영
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
  const itemHeight = 250;
  const finalTop = Math.round(position / itemHeight) * itemHeight;
  slot.style.top = `-${finalTop}px`;

  const index = Math.floor(finalTop / itemHeight) % slot.children.length;
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