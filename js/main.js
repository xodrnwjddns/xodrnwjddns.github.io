/* =========================================================
   WON 우리카드 AI Renewal — main.js
   Vanilla JS (no library)
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2400);
  };

  /* ---------- Image fallback (mascot images) ---------- */
  $$('img[data-fallback]').forEach((img) => {
    const fail = () => { img.style.visibility = 'hidden'; img.parentElement.classList.add('img-fallback'); };
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail, { once: true });
  });

  /* ---------- Count-up numbers ---------- */
  const countUp = (el, to, { decimals = 0, suffix = '', comma = false, duration = 1600 } = {}) => {
    const from = 0;
    const start = performance.now();
    const fmt = (v) => {
      const n = decimals ? v.toFixed(decimals) : Math.round(v).toString();
      return (comma ? Number(n).toLocaleString('ko-KR', { minimumFractionDigits: decimals }) : n) + suffix;
    };
    if (reduceMotion) { el.textContent = fmt(to); return; }
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const runCounters = (scope) => {
    $$('[data-count]', scope).forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      countUp(el, parseFloat(el.dataset.count), {
        decimals: Number(el.dataset.decimals || 0),
        suffix: el.dataset.suffix || '',
        comma: el.dataset.format === 'comma',
      });
    });
  };

  /* ---------- Reveal on scroll (one by one) ---------- */
  $$('.reveal').forEach((el) => el.style.setProperty('--d', el.dataset.delay || 0));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      runCounters(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Header: scrolled / hide on scroll down / progress ---------- */
  const header = $('#header');
  const progress = $('.scroll-progress span');
  const toTop = $('#toTop');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${(y / max) * 100}%`;
    header.classList.toggle('is-scrolled', y > 40);
    const menuOpen = $('#gnb').classList.contains('is-open') || !$('#searchPanel').hidden;
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !menuOpen);
    toTop.classList.toggle('is-show', y > 800);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Scroll spy for GNB ---------- */
  const navLinks = $$('.gnb a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- Mobile menu + search panel ---------- */
  const gnb = $('#gnb');
  const menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = gnb.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  navLinks.forEach((a) => a.addEventListener('click', () => { gnb.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

  const searchPanel = $('#searchPanel');
  $('#searchBtn').addEventListener('click', () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) $('#searchInput').focus();
  });
  $$('.search-tags button').forEach((b) => b.addEventListener('click', () => { $('#searchInput').value = b.textContent; $('#searchInput').focus(); }));
  $('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#searchInput').value.trim();
    toast(q ? `"${q}" 에 대해 AI가 분석을 시작했어요` : '검색어를 입력해 주세요');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    searchPanel.hidden = true;
    gnb.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });

  /* ---------- Ripple on buttons ---------- */
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn || reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  });

  /* ---------- HERO: mouse parallax ---------- */
  const hero = $('#hero');
  const tiles = $$('.float-tile', hero);
  const mascot = $('#heroMascot');
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiles.forEach((t) => {
        const d = Number(t.dataset.depth);
        t.style.transform = `translate(${x * d}px, ${y * d}px)`;
      });
      mascot.style.transform = `translate(${x * -14}px, ${y * -10}px)`;
    });
    hero.addEventListener('pointerleave', () => {
      tiles.forEach((t) => (t.style.transform = ''));
      mascot.style.transform = '';
    });
  }

  /* ---------- HERO: live mini chart + assistant modes ---------- */
  const miniBars = $$('#miniBars i');
  const miniRate = $('#miniRate');
  const status = $('#assistantStatus');
  const modes = {
    portfolio: { label: '수익률', value: () => `+${(10 + Math.random() * 5).toFixed(1)}%` },
    report: { label: '절약액', value: () => `${Math.round(5 + Math.random() * 6)}만원` },
    card: { label: '혜택', value: () => `${(3 + Math.random() * 2.5).toFixed(1)}%` },
  };
  let mode = 'portfolio';
  const shuffleMini = () => {
    miniBars.forEach((b, i) => {
      const base = i === miniBars.length - 1 ? 40 : 14;
      b.style.setProperty('--h', Math.round(base + Math.random() * (54 - base)));
    });
    miniRate.previousElementSibling.textContent = modes[mode].label;
    miniRate.textContent = modes[mode].value();
  };
  let analyzing = true;
  setInterval(() => {
    if (document.hidden) return;
    shuffleMini();
    analyzing = !analyzing;
    status.textContent = analyzing ? '● AI 분석 중...' : '● 분석 완료';
    status.classList.toggle('done', !analyzing);
  }, 2600);
  $$('.assistant__tags .tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      $$('.assistant__tags .tag').forEach((t) => t.classList.toggle('is-on', t === tag));
      mode = tag.dataset.mode;
      shuffleMini();
    });
  });

  /* ---------- QUICK SERVICES: select / pin ---------- */
  const pinCount = $('#pinCount');
  $$('.q-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-active');
      card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
      const n = $$('.q-card.is-active').length;
      pinCount.textContent = n;
      const name = $('b', card).textContent;
      toast(card.classList.contains('is-active') ? `'${name}'을(를) 자주 쓰는 서비스로 고정했어요` : `'${name}' 고정을 해제했어요`);
    });
  });

  /* ---------- AI ASSET: risk profile → chart ---------- */
  const riskData = {
    safe:       { weight: 48, sub: '주식 20% · 채권 28%', ret: 4.2, bars: [20, 28, 12, 8, 22, 10] },
    balance:    { weight: 62, sub: '주식 42% · 채권 20%', ret: 6.8, bars: [42, 20, 14, 10, 8, 6] },
    aggressive: { weight: 78, sub: '주식 64% · 채권 14%', ret: 9.6, bars: [64, 14, 9, 7, 3, 3] },
  };
  const barEls = $$('#assetBars .bar');
  const sumWeight = $('#sumWeight');
  const sumWeightSub = $('#sumWeightSub');
  const sumReturn = $('#sumReturn');
  const bubble = $('#assetBubble');
  const MAX_BAR = 150;
  const applyRisk = (key) => {
    const d = riskData[key];
    const max = Math.max(...d.bars);
    barEls.forEach((bar, i) => {
      const px = Math.max(20, Math.round((d.bars[i] / max) * MAX_BAR));
      bar.style.setProperty('--v', px);
      $('i', bar).style.setProperty('--v', px);
      $('.bar__val', bar).textContent = `${d.bars[i]}%`;
    });
    countUp(sumWeight, d.weight, { suffix: '%', duration: 900 });
    countUp(sumReturn, d.ret, { suffix: '%', decimals: 1, duration: 900 });
    sumWeightSub.textContent = d.sub;
    bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
  };
  $$('.risk button').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.risk button').forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
      applyRisk(btn.dataset.risk);
    });
  });
  // dashboard bars grow when the dashboard enters the viewport
  const dashWrap = $('.dash-wrap');
  new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $('#assetBars').parentElement.classList.add('is-in');
      setTimeout(() => applyRisk('balance'), 300);
      obs.disconnect();
    });
  }, { threshold: 0.3 }).observe(dashWrap);
  $('#assetRun').addEventListener('click', (e) => {
    e.preventDefault();
    bubble.textContent = 'AI 분석 중...';
    const current = $('.risk button.is-on').dataset.risk;
    barEls.forEach((bar) => $('i', bar).style.setProperty('--v', 20));
    setTimeout(() => { applyRisk(current); bubble.textContent = 'AI 분석 완료!'; toast('투자성향에 맞춘 자산배분을 새로 계산했어요'); }, 700);
  });

  /* ---------- CONSUMPTION: month tabs → chart ---------- */
  const monthData = {
    4: { vals: [29, 25, 13, 9], tip: '<b class="hl">쇼핑 부문</b>이 전월 대비 18% 늘었어요. 장바구니 알림을 켜면 <b>5만원</b>을 아낄 수 있습니다.' },
    5: { vals: [31, 23, 14, 9], tip: '<b class="hl">구독 부문</b>에서 3개월간 사용하지 않은 서비스 2건을 해지하면 <b>2만원</b>이 절약됩니다.' },
    6: { vals: [34, 21, 15, 8], tip: '<b class="hl">식비 부문</b>에서 정기 배달앱 사용을 줄이시면 이번 달 예상 저축액을 <b>7만원</b> 더 늘릴 수 있습니다.' },
  };
  const spendCols = $$('#spendBars .spend__col');
  const report = $('.report');
  const reportTip = $('#reportTip');
  const applyMonth = (m) => {
    const d = monthData[m];
    const max = 34;
    spendCols.forEach((col, i) => {
      const px = Math.round((d.vals[i] / max) * 120);
      $('i', col).style.setProperty('--v', px);
      $('small', col).textContent = `${d.vals[i]}만`;
    });
    $('#reportTitle').textContent = `${m}월 소비 분석 리포트`;
    reportTip.style.opacity = 0;
    setTimeout(() => { reportTip.innerHTML = d.tip; reportTip.style.opacity = 1; }, 200);
  };
  reportTip.style.transition = 'opacity .25s';
  $$('.month-tabs button').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.month-tabs button').forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
      applyMonth(btn.dataset.month);
    });
  });
  $('#consumeRun').addEventListener('click', (e) => {
    e.preventDefault();
    report.classList.remove('is-in');
    setTimeout(() => report.classList.add('is-in'), 350);
    report.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('최근 결제 데이터로 소비 패턴을 다시 분석했어요');
  });

  /* ---------- CARD BENEFITS: 3D tilt + select ---------- */
  const bCards = $$('.b-card');
  bCards.forEach((card) => {
    card.style.setProperty('--accent', card.dataset.accent);
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
      card.addEventListener('pointermove', (e) => {
        if (!card.classList.contains('is-in')) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -8}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    }
    const select = () => {
      bCards.forEach((c) => c.classList.toggle('is-selected', c === card && !card.classList.contains('is-selected')));
    };
    card.addEventListener('click', (e) => { if (!e.target.closest('[data-apply]')) select(); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
  $$('[data-apply]').forEach((btn) => btn.addEventListener('click', () => toast(`${btn.dataset.apply} 혜택 신청 페이지로 이동합니다`)));

  /* ---------- SECURITY: live counter + status rotation ---------- */
  const blocked = $('#blockedCount');
  let blockedN = 12480;
  const shieldSub = $('#shieldSub');
  const chips = $$('.s-chip');
  const messages = ['비정상 금융 접근 차단 시스템 1등급 활성화', '의심 송금 패턴 0.05초 만에 판별 중', '보이스피싱 의심 번호 실시간 대조 중'];
  let msgIdx = 0;
  let secVisible = false;
  new IntersectionObserver((entries) => { secVisible = entries[0].isIntersecting; }, { threshold: 0.2 }).observe($('#security'));
  setInterval(() => {
    if (!secVisible || document.hidden) return;
    blockedN += Math.ceil(Math.random() * 4);
    blocked.textContent = blockedN.toLocaleString('ko-KR');
    const chip = chips[Math.floor(Math.random() * chips.length)];
    chip.classList.add('flash');
    setTimeout(() => chip.classList.remove('flash'), 500);
  }, 1500);
  setInterval(() => {
    if (!secVisible || document.hidden) return;
    msgIdx = (msgIdx + 1) % messages.length;
    shieldSub.style.opacity = 0;
    setTimeout(() => { shieldSub.textContent = messages[msgIdx]; shieldSub.style.opacity = 1; }, 300);
  }, 3500);

  /* ---------- prevent empty links from jumping ---------- */
  $$('a[href="#"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); toast('과제용 데모 페이지입니다'); }));
})();
