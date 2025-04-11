const loginBtn = document.getElementById('loginBtn');
const loginMenu = document.getElementById('loginMenu');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');

loginBtn.addEventListener('click', () => {
  const password = prompt('비밀번호를 입력하세요');

  if (password === '7905') {
    // 성공: 다음 페이지로 이동
    window.location.href = 'monthlyAdmin.html'; // 👉 여기에 이동할 페이지 경로 입력!
  } else {
    // 실패: 알림창 띄우기
    alert('비밀번호가 틀렸습니다.');
  }
});