const items = JSON.parse(localStorage.getItem('items2')) || []; 

// const picker = document.getElementById('picker');
// const startBtn = document.getElementById('startBtn');
// const historyList = document.getElementById('history');


// let history = [];

// function pickResult() {
//     picker.classList.add('active');
  
//     const selectedItem = weightedRandom(items);
  
//     picker.textContent = selectedItem.name;
  
//     saveResult(selectedItem.name);
  
//     setTimeout(() => {
//       picker.classList.remove('active');
//     }, 300);
//   }
  
//   // 가중치 기반 랜덤 함수
//   function weightedRandom(items) {
//     const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
//     let randomNum = Math.random() * totalWeight;
    
//     for (let item of items) {
//       if (randomNum < item.weight) {
//         return item;
//       }
//       randomNum -= item.weight;
//     }
//   }
  

// function saveResult(item) {
//   history.unshift(item);
//   if (history.length > 10) {
//     history.pop();
//   }
//   renderHistory();
// }

// function renderHistory() {
//   historyList.innerHTML = '';
//   history.forEach((item, idx) => {
//     const li = document.createElement('li');
//     li.textContent = `${idx + 1}. ${item}`;
//     historyList.appendChild(li);
//   });
// }

// startBtn.addEventListener('click', pickResult);

const slot = document.getElementById('slot');
const startBtn = document.getElementById('startBtn');
const historyList = document.getElementById('history2');

let history = [];
let animationFrame;
let position = 0;
let speed = 30;

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