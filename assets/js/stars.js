(function () {
  const field = document.getElementById('starField');
  if (!field) return;

  // 별
  const twinkle = ['t1', 't2', 't3'];
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    const size = Math.random() * 2.5 + 0.8;
    s.className = 'star ' + twinkle[i % 3];
    s.style.cssText =
      `width:${size}px;height:${size}px;` +
      `top:${Math.random() * 100}%;left:${Math.random() * 100}%;` +
      `animation-delay:${(Math.random() * 3).toFixed(2)}s;`;
    field.appendChild(s);
  }

  // 유성
  for (let i = 0; i < 3; i++) {
    const m = document.createElement('div');
    m.className = 'meteor';
    const w = Math.random() * 100 + 80;
    m.style.cssText =
      `width:${w}px;` +
      `top:${Math.random() * 35 + 5}%;left:${Math.random() * 40 + 55}%;` +
      `animation-delay:${(i * 4.2).toFixed(1)}s;` +
      `animation-duration:${(Math.random() * 2 + 4).toFixed(1)}s;`;
    field.appendChild(m);
  }

  // 떠다니는 간식 이모지
  const snacks = ['🍪', '🍫', '🍭', '🍬', '🍩', '🎁', '🍡', '🧁'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'snack-float';
    el.textContent = snacks[i % snacks.length];
    const duration = (Math.random() * 8 + 10).toFixed(1);
    const delay    = (Math.random() * 10).toFixed(1);
    el.style.cssText =
      `left:${Math.random() * 95}%;` +
      `bottom:-60px;` +
      `animation-duration:${duration}s;` +
      `animation-delay:${delay}s;` +
      `font-size:${Math.random() * 14 + 20}px;`;
    field.appendChild(el);
  }
})();
