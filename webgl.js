/* APEX Robotics Academy — Neural Network Background */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const GREEN = '16,185,129';
  const BLUE  = '14,165,233';
  const NODE_COUNT = 90;
  const PARTICLE_COUNT = 280;
  let nodes = [], particles = [], time = 0, raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.4 + .4,
      col: i % 3 === 0 ? BLUE : GREEN,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * .004 + .002
    }));
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: Math.random() * .7 + .2,
      a: Math.random() * .22 + .04
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += .006;

    /* connections */
    const MAX = Math.min(W, H) * .145;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          const a = (1 - d / MAX) * .11;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${nodes[i].col},${a})`;
          ctx.lineWidth = .55;
          ctx.stroke();
        }
      }
    }

    /* nodes */
    nodes.forEach(n => {
      n.x += n.vx + Math.sin(time + n.phase) * .12;
      n.y += n.vy + Math.cos(time + n.phase * .7) * .12;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.col},.52)`;
      ctx.fill();
    });

    /* particles */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN},${p.a})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => { resize(); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !raf) draw();
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
  });
})();
