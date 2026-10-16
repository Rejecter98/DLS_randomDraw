const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSlFBgUtQYZiWvohdZFqPDpRiw0Yd7t-Q4ifrpUkmo_ra6V56KM-h27Ur5HpC_DZ1lcZGsNk87yEaT9/pub?gid=377177771&single=true&output=csv';

const startBtn = document.getElementById('startBtn');
const historyList = document.getElementById('history2');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const historyModal = document.getElementById('historyModal');
const loadingOverlay = document.getElementById('loadingOverlay');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let items = [];
let history = [];
let isAnimating = false;

const CARD_COUNT = 3;

// 전체화면
fullscreenBtn.addEventListener('click', () => {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
});
document.addEventListener('fullscreenchange', () => {
  fullscreenBtn.style.visibility = document.fullscreenElement ? 'hidden' : 'visible';
});

showHistoryBtn.addEventListener('click', () => historyModal.classList.remove('hidden'));
closeHistoryBtn.addEventListener('click', () => historyModal.classList.add('hidden'));

// CSV 로드
async function loadItemsFromCSV() {
  const res = await fetch(csvUrl);
  const csv = await res.text();
  items = csv.trim().split('\n').slice(1).map(line => {
    const cols = line.split(',');
    const name = cols[7]?.trim();
    const weight = parseInt(cols[8]?.trim());
    return { name, weight };
  }).filter(i => i.name && !isNaN(i.weight));
  initCard();
  loadingOverlay.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', loadItemsFromCSV);

// 가중치 랜덤
function weightedRandom() {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return items[0];
}

function setBtn(disabled) {
  isAnimating = disabled;
  startBtn.classList.toggle('disabled', disabled);
}

// 카드 초기화
function initCard() {
  const container = document.getElementById('cardContainer');
  container.innerHTML = '';
  for (let i = 0; i < CARD_COUNT; i++) {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">🎁</div>
        <div class="flip-card-back"></div>
      </div>`;
    container.appendChild(card);
  }
  document.getElementById('cardHint').textContent = '';
}

// START 클릭
startBtn.addEventListener('click', () => {
  if (isAnimating || items.length === 0) return;
  startCard();
});

function startCard() {
  setBtn(true);
  const winner = weightedRandom();
  const cards = [...document.querySelectorAll('.flip-card')];

  cards.forEach(c => {
    c.querySelector('.flip-card-inner').classList.remove('flipped');
    c.classList.remove('selectable');
    c.onclick = null;
    c.querySelector('.flip-card-back').textContent = '';
  });

  document.getElementById('cardHint').textContent = '카드를 섞는 중...';

  shuffleCards(cards, () => {
    document.getElementById('cardHint').textContent = '카드를 선택하세요!';
    const freshCards = [...document.querySelectorAll('.flip-card')];
    freshCards.forEach(card => {
      card.classList.add('selectable');
      card.onclick = () => {
        freshCards.forEach(c => { c.classList.remove('selectable'); c.onclick = null; });
        card.querySelector('.flip-card-back').textContent = winner.name;
        card.querySelector('.flip-card-inner').classList.add('flipped');
        document.getElementById('cardHint').textContent = '';
        saveResult(winner.name);
        setTimeout(() => setBtn(false), 800);
      };
    });
  });
}

function shuffleCards(cards, callback) {
  const container = document.getElementById('cardContainer');
  const GAP = 20;
  const cardW = cards[0].offsetWidth;
  const cardH = cards[0].offsetHeight;

  container.style.position = 'relative';
  container.style.height = cardH + 'px';
  container.style.width = ((cardW + GAP) * CARD_COUNT - GAP) + 'px';

  let pos = cards.map((_, i) => i);

  cards.forEach((c, i) => {
    c.style.position = 'absolute';
    c.style.left = (i * (cardW + GAP)) + 'px';
    c.style.top = '0';
    c.style.transition = 'left 0.25s ease';
  });

  function swap(a, b) {
    const slotA = pos[a], slotB = pos[b];
    cards[a].style.left = (slotB * (cardW + GAP)) + 'px';
    cards[b].style.left = (slotA * (cardW + GAP)) + 'px';
    pos[a] = slotB; pos[b] = slotA;
  }

  const seq = [[0,1],[1,2],[0,2],[0,1],[1,2]];
  seq.forEach((s, i) => setTimeout(() => swap(s[0], s[1]), i * 230));

  setTimeout(() => {
    [...cards].sort((a, b) => pos[cards.indexOf(a)] - pos[cards.indexOf(b)])
              .forEach(c => container.appendChild(c));
    cards.forEach(c => {
      c.style.position = '';
      c.style.left = '';
      c.style.top = '';
      c.style.transition = '';
    });
    container.style.position = '';
    container.style.height = '';
    container.style.width = '';
    callback();
  }, seq.length * 230 + 250);
}

// 기록 저장 및 렌더링
function saveResult(name) {
  const time = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  history.unshift({ name, time });
  if (history.length > 20) history.pop();
  renderHistory();
}

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
