// const items = [
//     { name: '60퍼', weight: 60 },
//     { name: '30퍼', weight: 30 },
//     { name: '10퍼', weight: 10 }
//   ];

const items = JSON.parse(localStorage.getItem('items')) || []; 


const picker = document.getElementById('picker');
const startBtn = document.getElementById('startBtn');
const historyList = document.getElementById('history');





let history = [];

function pickResult() {
    picker.classList.add('active');
  
    const selectedItem = weightedRandom(items);
  
    picker.textContent = selectedItem.name;
  
    saveResult(selectedItem.name);
  
    setTimeout(() => {
      picker.classList.remove('active');
    }, 300);
  }
  
  // 가중치 기반 랜덤 함수
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
  

function saveResult(item) {
  history.unshift(item);
  if (history.length > 10) {
    history.pop();
  }
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${item}`;
    historyList.appendChild(li);
  });
}

startBtn.addEventListener('click', pickResult);
