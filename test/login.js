const loginBtn = document.getElementById('loginBtn');
const loginMenu = document.getElementById('loginMenu');
const passwordInput = document.getElementById('passwordInput');
const submitPassword = document.getElementById('submitPassword');

loginBtn.addEventListener('click', () => {
  const password = prompt('비밀번호를 입력하세요');

  if (password === '7905') {
    // 성공: 다음 페이지로 이동
    window.location.href = 'admin.html'; // 👉 여기에 이동할 페이지 경로 입력!
  } else {
    // 실패: 알림창 띄우기
    alert('비밀번호가 틀렸습니다.');
  }
});


// 비밀번호 제출
submitPassword.addEventListener('click', () => {
  const password = passwordInput.value;
  if (password === '7905') {
    window.location.href = 'admin.html'; // 정답이면 admin.html로 이동
  } else {
    alert('비밀번호가 틀렸습니다.');
    passwordInput.value = '';
    passwordInput.focus();
  }
});