/* انتكاسة — كل البيانات محلية على الجهاز بس */
(function () {
  'use strict';

  const KEY = 'intikasa.v1';
  const DAY = 86400000;
  /* أوسمة بأسماء ومعاني، بفترات متنوعة لحد ١٠٠٠ يوم */
  const MEDALS = [
    { d: 3,    name: 'وسام الشرارة',  desc: 'أول شرارة — كل رحلة بتبدأ بخطوة', icon: 'flame',    col: '#fde047' },
    { d: 7,    name: 'وسام الشجاعة',  desc: 'أسبوع كامل وأنت واقف على رجلك',   icon: 'shield',   col: '#fb923c' },
    { d: 16,   name: 'وسام العزيمة',  desc: 'أكتر من أسبوعين من غير رجوع',      icon: 'bolt',     col: '#f472b6' },
    { d: 28,   name: 'وسام القوة',    desc: '٤ أسابيع كاملة — قوتك بانت',       icon: 'dumbbell', col: '#e879f9' },
    { d: 40,   name: 'وسام الإرادة',  desc: 'إرادتك بقت أقوى من العادة',        icon: 'mountain', col: '#c084fc' },
    { d: 60,   name: 'وسام الصمود',   desc: 'شهرين كاملين صامد',                icon: 'anchor',   col: '#a78bfa' },
    { d: 90,   name: 'وسام الانضباط', desc: '٩٠ يوم من الالتزام الكامل',        icon: 'clock',    col: '#818cf8' },
    { d: 120,  name: 'وسام التحكم',   desc: 'إنت اللي بتحكم، مش العادة',        icon: 'target',   col: '#60a5fa' },
    { d: 160,  name: 'وسام النور',    desc: 'نورك بقى أوضح من الضلمة',          icon: 'sun',      col: '#38bdf8' },
    { d: 210,  name: 'وسام العملاق',  desc: '٧ شهور — إنت بقيت عملاق',          icon: 'rocket',   col: '#22d3ee' },
    { d: 270,  name: 'وسام الصقر',    desc: '٩ شهور بتحلق فوق كل حاجة',         icon: 'wings',    col: '#2dd4bf' },
    { d: 330,  name: 'وسام النجم',    desc: 'على مقربة من السنة — إنت نجم',     icon: 'star',     col: '#4ade80' },
    { d: 365,  name: 'وسام الذهب',    desc: 'سنة كاملة! إنجاز ذهبي',            icon: 'medal',    col: '#facc15' },
    { d: 500,  name: 'وسام التاج',    desc: '٥٠٠ يوم — إنت ملك نفسك',           icon: 'crown',    col: '#fbbf24' },
    { d: 650,  name: 'وسام القمر',    desc: '٦٥٠ يوم من الثبات الهادي',         icon: 'moon',     col: '#67e8f9' },
    { d: 800,  name: 'وسام الماس',    desc: '٨٠٠ يوم — نادر زي الماس',          icon: 'diamond',  col: '#93c5fd' },
    { d: 1000, name: 'وسام الأسطورة', desc: '١٠٠٠ يوم! اسمك اتحفر مع الأساطير', icon: 'legend',   col: '#f0abfc' }
  ];
  const MILESTONES = MEDALS.map((m) => m.d);
  const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const WDAYS = ['سبت','أحد','اثنين','تلات','أربع','خميس','جمعه']; // Saturday first
  const REASONS = ['ملل', 'وحدة', 'وقت فراغ بالليل', 'الموبايل والسوشيال ميديا', 'زعل أو ضغط', 'تفكير زيادة', 'محتوى خارجي', 'سبب تاني'];
  const ACCENTS = ['#2dd4bf', '#38bdf8', '#a78bfa', '#f472b6', '#4ade80'];
  const DEFAULT_PHRASES = [
    'كل يوم بتعدّيه، إنت أقوى من إمبارح.',
    'الرغبة موجة: بتعلي وبتنزل. اركبها، متغرقش فيها.',
    'الانتكاسة مش نهاية، دي معلومة جديدة عن نفسك.',
    'جسمك وعقلك بيشكروك دلوقتي.',
    'متعدّش الأيام، خلّي الأيام هي اللي تعدّك.',
    'الانضباط أعلى شكل من أشكال حب النفس.',
    'الرغبة هتعدّي. فخرك بنفسك هيفضل.',
    'يوم واحد كل مرة، وبس.',
    'لن تنال الراحة بالراحة'
  ];
  const HABIT_LABELS = { secret: 'العادة السرية', smoking: 'التدخين', custom: '' };
  /* عبارات حسب طول السلسلة (اقتراح 19) */
  const PHRASE_STAGES = [
    [0, [ // أول يومين / بعد انتكاسة
      'البداية من جديد مش هزيمة.. دي شجاعة.',
      'وقعت؟ طبيعي. المهم إنك قمت أسرع من المرة اللي فاتت.',
      'اليوم ده أهم يوم في الرحلة كلها، وإنت عايشه دلوقتي.',
      'متحاسبش نفسك.. ركّز في الساعة الجاية بس.',
      'كل بطل عدّى باليوم الصفري ده بالظبط.'
    ]],
    [3, [ // ٣-٦ أيام
      '٣ أيام؟ جسمك بدأ يحس بالفرق فعلاً.',
      'أصعب مرحلة بتعدّي دلوقتي.. وإنت عدّيتها قبل كده.',
      'الرغبة بتزور أكتر في الأيام دي.. زيارة وبتروح، مش ساكنة.',
      'أسبوعك الأول قرب.. استحمل شوية كمان.'
    ]],
    [7, [ // أسبوع لشهر
      'أسبوع كامل! إنت رسمي بقت أقوى من العادة.',
      'العادة بتضعف كل يوم.. وإنت بتقوى كل يوم.',
      'شوف الرقم ده وافتخر.. ناس كتير بتمنى توصله.',
      'دماغك بتعيد برمجة نفسها دلوقتي.. سيبها تكمل.'
    ]],
    [30, [ // شهر لـ ٩٩ يوم
      'شهر وأكتر.. إنت بقيت قدوة لنفسك قبل أي حد.',
      'الرقم ده مش حظ.. ده انضباط يوم بيوم.',
      'افتكر إنت كنت فين، وبص إنت فين دلوقتي.',
      'السلسلة دي بقت أغلى حاجة عندك.. احميها.'
    ]],
    [100, [ // ١٠٠+
      '١٠٠+ يوم.. إنت رسمي من النوع النادر اللي بينفذ.',
      'إنت مش بتقلع عن عادة.. إنت بنيت شخصية جديدة.',
      'الأساطير مش بتتولد.. بتتصنع يوم بيوم. زيك بالظبط.',
      'إنت الدليل إنها ممكنة. كمّل للنهاية.'
    ]]
  ];
  /* نقاط الخبرة ومستوياتها */
  const LEVELS = [[0, 'مبتدئ 🌱'], [100, 'مجتهد ✨'], [250, 'ملتزم 🎯'], [500, 'محارب ⚔️'], [900, 'بطل 🏆'], [1400, 'بطل خارق 🦸'], [2000, 'أسطورة 👑']];
  function xpNow(now) {
    const earned = MEDALS.filter((m) => milestoneReached(m.d, now)).length;
    return totalCleanDays(now) * 10 + earned * 50 + (state.wchWins || 0) * 100;
  }
  function levelOf(xp) { let li = 0; for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i][0]) li = i; return li; }

  let state = null;
  let page = 'home';
  let calCursor = null; // Date at first of viewed month
  let urgeTimer = null, urgeSecs = 0, breathTimer = null, phraseTimer = null, urgeOpenTs = 0;

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const pad2 = (n) => (n < 10 ? '0' : '') + n;
  const dayKey = (ts) => { const d = new Date(ts); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
  const startOfDay = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };

  function unit(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n >= 3 && n <= 10) return few;
    return many;
  }
  const U = {
    week: (n) => unit(n, 'أسبوع', 'أسبوعين', 'أسابيع', 'أسبوع'),
    day: (n) => unit(n, 'يوم', 'يومين', 'أيام', 'يوم'),
    hour: (n) => unit(n, 'ساعة', 'ساعتين', 'ساعات', 'ساعة'),
    min: (n) => unit(n, 'دقيقة', 'دقيقتين', 'دقايق', 'دقيقة'),
    sec: (n) => unit(n, 'ثانية', 'ثانيتين', 'ثواني', 'ثانية'),
    rel: (n) => unit(n, 'انتكاسة', 'انتكاستين', 'انتكاسات', 'انتكاسة')
  };

  function toast(msg, ms) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.add('hidden'), ms || 2600);
  }

  /* ---------- state ---------- */
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); pushWidget(); }
  /* بنبعت بداية العداد ولونه للويدجت بتاع الشاشة الرئيسية */
  function pushWidget() {
    if (!window.AndroidBridge || !AndroidBridge.saveWidget) return;
    try { AndroidBridge.saveWidget(String(state.startTs || Date.now()), String(state.accent || '#2dd4bf')); } catch (e) {}
  }
  function load() {
    try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { state = null; }
    if (state && state.v === 1) {
      state.dayNotes = state.dayNotes || {}; state.avatar = state.avatar || null; state.profileName = state.profileName || ''; state.theme = state.theme || 'dark';
      state.hardDays = state.hardDays || []; state.medalStyle = state.medalStyle || 'neon';
      state.event = state.event || null; state.stealth = !!state.stealth; state.bio = !!state.bio;
      state.icon = (state.icon === 'cap' || state.icon === 'stick') ? state.icon : 'main';
      state.stealth = false;
      state.batman3 = !!state.batman3;
      state.tasks = state.tasks || {};
      state.counterAccent = state.counterAccent || '';
      state.abajouraUntil = state.abajouraUntil || 0;
      state.topPhotoIdx = state.topPhotoIdx || 0;
      state.wchallenge = state.wchallenge || null;
      state.wchWins = state.wchWins || 0;
      state.pwCount = state.pwCount || 0;
      if (state.pwRunAwards === undefined) state.pwRunAwards = -1; // -1 = أول مرة، تهيئة من غير بالون
      if (state.pwRunStart === undefined) state.pwRunStart = 0;
      state.urges = state.urges || [];
      state.styles = (Array.isArray(state.styles) ? state.styles.filter((s) => STYLES.includes(s)) : []);
      if (!state.styles.length) state.styles = STYLES.slice();
      if (!state.styles.includes(state.style)) state.style = state.styles[0];
      // العبارات الافتراضية الجديدة تنضم للموجود عند كل تحديث
      state.phrases = state.phrases || [];
      DEFAULT_PHRASES.forEach((p) => { if (!state.phrases.includes(p)) state.phrases.push(p); });
      state.challenge = state.challenge || null;
      state.devThanks = !!state.devThanks;
      state.lastReminderMonth = state.lastReminderMonth || '';
      return true;
    }
    state = null;
    return false;
  }

  /* لون العداد ممكن يبقى مختلف عن لون التطبيق؛ فاضي = نفس لون التطبيق */
  function counterAccent() { return state.counterAccent || state.accent || '#2dd4bf'; }
  function applyAccent() {
    document.documentElement.style.setProperty('--acc', state.accent);
    const c = $('counter');
    if (c) c.style.setProperty('--acc', counterAccent());
  }
  function applyTheme() { document.body.classList.toggle('light', state.theme === 'light'); }

  /* ---------- derived stats ---------- */
  function relapseList() { return (state.relapses || []).slice().sort((a, b) => a.ts - b.ts); }

  function streaks(now) {
    // [start, end] intervals of clean time
    const pts = [state.trackingSince].concat(relapseList().map((r) => r.ts)).concat([now]);
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) out.push([pts[i], pts[i + 1]]);
    return out;
  }
  function currentStreak(now) { return now - state.startTs; }
  function longestStreak(now) {
    let m = 0;
    for (const [a, b] of streaks(now)) m = Math.max(m, b - a);
    return m;
  }
  function shortestStreak(now) {
    let m = Infinity;
    for (const [a, b] of streaks(now)) m = Math.min(m, b - a);
    return m === Infinity ? 0 : m;
  }
  function totalCleanDays(now) {
    let d = 0;
    for (const [a, b] of streaks(now)) d += Math.floor((b - a) / DAY);
    return d;
  }
  function relapseDaysSet() {
    const s = new Set();
    for (const r of relapseList()) s.add(dayKey(r.ts));
    return s;
  }
  function isCleanDay(ts, now) {
    const d0 = startOfDay(ts);
    if (d0 < startOfDay(state.trackingSince) || d0 > startOfDay(now)) return false;
    return !relapseDaysSet().has(dayKey(d0));
  }
  function milestoneReached(m, now) {
    for (const [a, b] of streaks(now)) {
      if (b - a >= m * DAY) return a + m * DAY;
    }
    return 0;
  }

  /* ---------- counter ---------- */
  function parts(secs) {
    return {
      w: Math.floor(secs / 604800),
      d: Math.floor(secs / 86400) % 7,
      h: Math.floor(secs / 3600) % 24,
      m: Math.floor(secs / 60) % 60,
      s: secs % 60
    };
  }

  /* ---------- counter (build once, tick changed values) ---------- */
  const STYLES = ['pills', 'ring', 'rings5', 'digits', 'sentence', 'bars', 'minis'];
  const STYLE_NAMES = { pills: 'الحبوب', ring: 'الحلقة', rings5: 'الحلقات المتعددة', digits: 'الأرقام', sentence: 'الجملة', bars: 'الأشرطة', minis: 'الحلقات الصغيرة' };
  let cRefs = null;

  function pop(elm) {
    elm.classList.remove('pop');
    void elm.offsetWidth;
    elm.classList.add('pop');
  }

  function nextMedalSecs(now) {
    const days = currentStreak(now) / 86400;
    const next = MILESTONES.find((m) => m > Math.floor(days)) || (Math.floor(days) + 30);
    return next * 86400;
  }

  const UNITS = [['w', 'week'], ['d', 'day'], ['h', 'hour'], ['m', 'min'], ['s', 'sec']];

  function buildCounter() {
    const c = $('counter');
    cRefs = { style: state.style };
    const st = state.style;
    if (st === 'pills') {
      c.innerHTML = '';
      UNITS.forEach(([k]) => {
        const row = el('div', 'pill-row');
        const fill = el('div', 'pill-fill');
        const v = el('span', 'v', '0');
        const u = el('span', 'u', '');
        row.appendChild(fill); row.appendChild(v); row.appendChild(u);
        c.appendChild(row);
        cRefs[k] = { v, u, fill, last: null };
      });
    } else if (st === 'ring') {
      const R = 100, CIRC = 2 * Math.PI * R;
      c.innerHTML =
        `<div class="ring-wrap"><svg class="ring-svg" viewBox="0 0 230 230">
          <circle cx="115" cy="115" r="${R}" fill="none" style="stroke:var(--track)" stroke-width="13"/>
          <circle id="ring-arc" cx="115" cy="115" r="${R}" fill="none" stroke="var(--acc)" stroke-width="13"
            stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"
            transform="rotate(-90 115 115)" style="transition:stroke-dashoffset .8s"/>
          <text id="ring-days" x="115" y="118" text-anchor="middle" class="ring-days">0</text>
          <text id="ring-sub" x="115" y="152" text-anchor="middle" class="ring-sub"></text>
        </svg>
        <div class="ring-hms" id="ring-hms">00:00:00</div>
        <div class="ring-target" id="ring-target"></div></div>`;
      cRefs.arc = $('ring-arc'); cRefs.days = $('ring-days'); cRefs.sub = $('ring-sub');
      cRefs.hms = $('ring-hms'); cRefs.target = $('ring-target'); cRefs.circ = CIRC;
      cRefs.lastSec = null; cRefs.lastDay = null;
    } else if (st === 'digits') {
      c.innerHTML = '';
      const grid = el('div', 'digits-grid');
      UNITS.forEach(([k]) => {
        const box = el('div', 'digit-box');
        const v = el('div', 'v', '00');
        const u = el('div', 'u', '');
        box.appendChild(v); box.appendChild(u);
        grid.appendChild(box);
        cRefs[k] = { v, u, last: null };
      });
      c.appendChild(grid);
    } else if (st === 'sentence') {
      c.innerHTML = '';
      const box = el('div', 'sentence-box');
      UNITS.forEach(([k], i) => {
        if (i > 0) box.appendChild(el('span', 'sent-sep', ' و'));
        const v = el('span', 'sent-num', '0');
        const u = el('span', 'sent-unit', '');
        box.appendChild(v); box.appendChild(u);
        cRefs[k] = { v, u, last: null };
      });
      c.appendChild(box);
    } else if (st === 'bars') {
      c.innerHTML = '';
      const wrap = el('div', 'ubars');
      UNITS.forEach(([k]) => {
        const col = el('div', 'ubar-col');
        const track = el('div', 'ubar-track');
        const fill = el('div', 'ubar-fill');
        track.appendChild(fill);
        const v = el('div', 'ubar-v', '0');
        const u = el('div', 'ubar-u', '');
        col.appendChild(track); col.appendChild(v); col.appendChild(u);
        wrap.appendChild(col);
        cRefs[k] = { v, u, fill, last: null };
      });
      c.appendChild(wrap);
    } else if (st === 'rings5') {
      const RADS = [100, 84, 68, 52, 36];
      let rings = '';
      RADS.forEach((r, i) => {
        const C = 2 * Math.PI * r;
        const shade = `color-mix(in srgb, var(--acc) ${100 - i * 17}%, #ffffff)`;
        rings += `<circle cx="115" cy="115" r="${r}" fill="none" style="stroke:var(--track)" stroke-width="10"/>`;
        rings += `<circle id="rings5-arc-${i}" cx="115" cy="115" r="${r}" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 115 115)" style="stroke:${shade}; transition:stroke-dashoffset .8s"/>`;
      });
      c.innerHTML = `<div class="ring-wrap"><svg class="ring-svg" viewBox="0 0 230 230">${rings}
        <text id="rings5-days" x="115" y="112" text-anchor="middle" class="ring-days" style="font-size:36px">0</text>
        <text id="rings5-sub" x="115" y="138" text-anchor="middle" class="ring-sub"></text></svg>
        <div class="rings5-legend" id="rings5-legend"></div></div>`;
      UNITS.forEach(([k], i) => {
        cRefs[k] = { v: null, u: null, arc: $('rings5-arc-' + i), circ: 2 * Math.PI * RADS[i], last: null };
      });
      cRefs.centerDays = $('rings5-days'); cRefs.centerSub = $('rings5-sub'); cRefs.lastDayC = null;
      const lg = $('rings5-legend');
      UNITS.forEach(([k], i) => {
        const chip = el('span', 'rings5-chip');
        chip.innerHTML = `<i style="background:color-mix(in srgb, var(--acc) ${100 - i * 17}%, #ffffff)"></i><b>0</b><span></span>`;
        lg.appendChild(chip);
        cRefs[k].v = chip.querySelector('b');
        cRefs[k].u = chip.querySelector('span:last-child');
      });
    } else { // minis
      c.innerHTML = '';
      const wrap = el('div', 'minis-wrap');
      UNITS.forEach(([k]) => {
        const R = 34, CIRC = 2 * Math.PI * R;
        const item = el('div', 'mini-ring-item');
        item.innerHTML =
          `<svg viewBox="0 0 90 90" class="mini-ring-svg">
            <circle cx="45" cy="45" r="${R}" fill="none" style="stroke:var(--track)" stroke-width="8"/>
            <circle class="mini-arc" cx="45" cy="45" r="${R}" fill="none" stroke="var(--acc)" stroke-width="8"
              stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"
              transform="rotate(-90 45 45)" style="transition:stroke-dashoffset .5s"/>
            <text x="45" y="52" text-anchor="middle" class="mini-v">0</text>
          </svg>
          <div class="mini-u"></div>`;
        wrap.appendChild(item);
        cRefs[k] = { arc: item.querySelector('.mini-arc'), v: item.querySelector('.mini-v'), u: item.querySelector('.mini-u'), circ: CIRC, last: null };
      });
      c.appendChild(wrap);
    }
    const dots = $('style-dots');
    dots.innerHTML = '';
    const enabled = enabledStyles();
    dots.style.display = enabled.length > 1 ? 'flex' : 'none';
    enabled.forEach((s2) => {
      const b = el('button', s2 === state.style ? 'active' : '');
      b.title = STYLE_NAMES[s2];
      b.onclick = () => switchStyle(s2, enabled.indexOf(s2) > enabled.indexOf(state.style) ? 'l' : 'r');
      dots.appendChild(b);
    });
  }

  /* تنقّل سموذ بين شكال العداد المختارة */
  function enabledStyles() { return STYLES.filter((s2) => (state.styles || STYLES).includes(s2)); }
  function switchStyle(s2, dir) {
    if (!s2 || s2 === state.style) return;
    const c = $('counter');
    const outCls = dir === 'r' ? 'cslide-out-r' : 'cslide-out-l';
    c.classList.remove('cslide-in-r', 'cslide-in-l', 'cslide-out-r', 'cslide-out-l');
    c.classList.add(outCls);
    setTimeout(() => {
      state.style = s2;
      save();
      renderStylePicker();
      buildCounter();
      tickCounter(true);
      c.classList.remove(outCls);
      c.classList.add(dir === 'r' ? 'cslide-in-r' : 'cslide-in-l');
    }, 180);
  }
  function stepStyle(step) {
    const enabled = enabledStyles();
    if (enabled.length < 2) return;
    const i = enabled.indexOf(state.style);
    const n = (i + step + enabled.length) % enabled.length;
    switchStyle(enabled[n], step > 0 ? 'l' : 'r');
  }

  function unitFracs(p, secs, now) {
    // progress fraction for each unit (for fills, bars, mini rings)
    const medalFrac = Math.min(1, secs / nextMedalSecs(now));
    return {
      w: medalFrac,                       // toward next medal
      d: (secs % 604800) / 604800,        // within current week
      h: (secs % 86400) / 86400,          // within current day
      m: (secs % 3600) / 3600,
      s: (secs % 60) / 60
    };
  }

  function tickCounter(force) {
    if (!state) return;
    /* ميم الاباجورة: ٣ دقايق مكان العداد بعد الانتكاسة */
    const abOn = (state.abajouraUntil || 0) > Date.now();
    $('abajoura').classList.toggle('hidden', !abOn);
    $('counter').classList.toggle('hidden', abOn);
    $('style-dots').classList.toggle('hidden', abOn);
    if (abOn) return;
    if (!cRefs || cRefs.style !== state.style) buildCounter();
    const now = Date.now();
    const secs = Math.max(0, Math.floor((now - state.startTs) / 1000));
    const p = parts(secs);
    const fr = unitFracs(p, secs, now);
    const st = cRefs.style;
    const map = { w: U.week, d: U.day, h: U.hour, m: U.min, s: U.sec };

    if (st === 'ring') {
      if (cRefs.lastSec !== secs || force) {
        cRefs.hms.textContent = pad2(p.h) + ':' + pad2(p.m) + ':' + pad2(p.s);
        cRefs.lastSec = secs;
      }
      const days = Math.floor(secs / 86400);
      if (cRefs.lastDay !== days || force) {
        const nextMd = MEDALS.find((m) => m.d > days);
        cRefs.target.textContent = nextMd ? 'الوسام الجاي: ' + nextMd.name + ' (' + nextMd.d + ' ' + U.day(nextMd.d) + ')' : 'وصلت لكل الأوسمة 🤯';
        cRefs.days.textContent = days;
        cRefs.sub.textContent = U.day(days);
        cRefs.lastDay = days;
      }
      const medalFrac = Math.min(1, secs / nextMedalSecs(now));
      cRefs.arc.style.strokeDashoffset = cRefs.circ * (1 - medalFrac);
      return;
    }
    if (st === 'rings5') {
      const dd = Math.floor(secs / 86400);
      if (cRefs.lastDayC !== dd || force) {
        cRefs.centerDays.textContent = dd;
        cRefs.centerSub.textContent = U.day(dd);
        cRefs.lastDayC = dd;
      }
    }
    for (const [k] of UNITS) {
      const ref = cRefs[k];
      if (ref.last !== p[k] || force) {
        const val = (st === 'digits') ? pad2(p[k]) : p[k];
        ref.v.textContent = val;
        ref.u.textContent = map[k](p[k]);
        if (ref.last !== null && !force) pop(ref.v);
        ref.last = p[k];
      }
      if (ref.fill) {
        if (st === 'pills') ref.fill.style.width = (fr[k] * 100).toFixed(2) + '%';
        else if (st === 'bars') ref.fill.style.height = (Math.max(2, fr[k] * 100)).toFixed(2) + '%';
      }
      if (ref.arc) ref.arc.style.strokeDashoffset = ref.circ * (1 - fr[k]);
    }
    const msL = $('ms-longest'), msR = $('ms-relapses'), msT = $('ms-total'), msS = $('ms-shortest');
    if (msL) {
      msL.textContent = Math.floor(longestStreak(now) / DAY);
      msR.textContent = state.relapses.length;
      msT.textContent = totalCleanDays(now);
      if (msS) msS.textContent = Math.floor(shortestStreak(now) / DAY);
    }
  }

  /* ---------- pages ---------- */
  const PAGES = { home: 'page-home', calendar: 'page-calendar', tasks: 'page-tasks', stats: 'page-stats', tree: 'page-tree', ach: 'page-ach', profile: 'page-profile', settings: 'page-settings' };
  function showPage(p) {
    page = p;
    for (const k in PAGES) $(PAGES[k]).classList.toggle('hidden', k !== p);
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.page === p));
    if (p === 'calendar') renderCalendar();
    if (p === 'stats') renderStats();
    if (p === 'ach') renderAch();
    if (p === 'tree') renderTree();
    if (p === 'profile') renderProfile();
    if (p === 'settings') renderSettings();
    if (p === 'tasks') renderTasksFan();
  }

  /* ---------- heatmap ---------- */
  function renderHeatmap() {
    const g = $('hm-grid');
    if (!g) return;
    const now = Date.now();
    const rel = relapseDaysSet();
    const today0 = startOfDay(now);
    const satOffset = (new Date(today0).getDay() + 1) % 7;
    const thisSat = today0 - satOffset * DAY;
    const WEEKS = 15;
    g.innerHTML = '';
    for (let w = WEEKS - 1; w >= 0; w--) {
      const col = el('div', 'hm-col');
      for (let d = 0; d < 7; d++) {
        const ts = thisSat - w * 7 * DAY + d * DAY;
        const cell = el('div', 'hm-cell');
        if (ts > today0) cell.style.visibility = 'hidden';
        else if (rel.has(dayKey(ts))) cell.classList.add('rel');
        else if (isCleanDay(ts, now)) cell.classList.add('clean');
        if (dayKey(ts) === dayKey(now)) cell.classList.add('today');
        col.appendChild(cell);
      }
      g.appendChild(col);
    }
  }

  /* ---------- day notes ---------- */
  let noteDayKey = null;
  function openNote(k) {
    noteDayKey = k;
    const d = new Date(k + 'T00:00:00');
    $('note-title').textContent = 'ملاحظة يوم ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
    $('note-text').value = state.dayNotes[k] || '';
    $('note-delete').style.visibility = state.dayNotes[k] ? 'visible' : 'hidden';
    $('note-modal').classList.remove('hidden');
  }
  function bindNotes() {
    $('note-save').onclick = () => {
      const v = $('note-text').value.trim();
      if (v) state.dayNotes[noteDayKey] = v; else delete state.dayNotes[noteDayKey];
      save();
      $('note-modal').classList.add('hidden');
      renderCalendar();
      toast('اتحفظت الملاحظة ✓');
    };
    $('note-delete').onclick = () => {
      delete state.dayNotes[noteDayKey];
      save();
      $('note-modal').classList.add('hidden');
      renderCalendar();
      toast('اتمسحت الملاحظة');
    };
  }

  /* ---------- calendar ---------- */
  function renderCalendar() {
    const now = Date.now();
    if (!calCursor) calCursor = new Date(now);
    const y = calCursor.getFullYear(), mo = calCursor.getMonth();
    $('cal-title').textContent = MONTHS[mo] + ' ' + y;
    $('cal-week').innerHTML = WDAYS.map((w) => `<div>${w}</div>`).join('');

    const first = new Date(y, mo, 1);
    // Saturday-first offset: JS getDay() 0=Sun..6=Sat ; satIdx = (getDay()+1)%7
    const offset = (first.getDay() + 1) % 7;
    const dim = new Date(y, mo + 1, 0).getDate();
    const rel = relapseDaysSet();
    const todayK = dayKey(now);
    const grid = $('cal-grid');
    grid.innerHTML = '';
    for (let i = 0; i < offset; i++) grid.appendChild(el('div', 'cal-day other', ''));
    for (let d = 1; d <= dim; d++) {
      const ts = new Date(y, mo, d).getTime();
      const k = dayKey(ts);
      const cell = el('div', 'cal-day', String(d));
      if (rel.has(k)) cell.classList.add('rel');
      else if (isCleanDay(ts, now)) cell.classList.add('clean');
      if (k === todayK) cell.classList.add('today');
      if (state.dayNotes && state.dayNotes[k]) cell.classList.add('has-note');
      let lp = null;
      const startLp = () => { lp = setTimeout(() => openNote(k), 500); };
      const cancelLp = () => { clearTimeout(lp); };
      cell.addEventListener('mousedown', startLp);
      cell.addEventListener('touchstart', startLp, { passive: true });
      cell.addEventListener('mouseup', cancelLp);
      cell.addEventListener('mouseleave', cancelLp);
      cell.addEventListener('touchend', cancelLp);
      grid.appendChild(cell);
    }
    let cleanCount = 0;
    for (let d = 1; d <= dim; d++) if (isCleanDay(new Date(y, mo, d).getTime(), now)) cleanCount++;
    $('cal-summary').textContent = cleanCount + ' ' + U.day(cleanCount) + ' انضباط هذا الشهر';
  }

  /* ---------- stats ---------- */
  /* مدة بأيام → يوم/شهر/سنة بشكل أنيق (1 شهر و 15 يوم) */
  function fmtDurParts(d) {
    const um = (n) => unit(n, 'شهر', 'شهرين', 'شهور', 'شهر');
    const uy = (n) => unit(n, 'سنة', 'سنتين', 'سنين', 'سنة');
    if (d < 30) return [[d, U.day(d)]];
    if (d < 365) {
      const m = Math.floor(d / 30), r = d % 30;
      const out = [[m, um(m)]];
      if (r) out.push([r, U.day(r)]);
      return out;
    }
    const y = Math.floor(d / 365), rem = d % 365, m = Math.floor(rem / 30), rd = rem % 30;
    const out = [[y, uy(y)]];
    if (m) out.push([m, um(m)]);
    else if (rd) out.push([rd, U.day(rd)]);
    return out;
  }
  function fmtDurHTML(d) {
    return fmtDurParts(d).map(([n, u]) => '<span class="v">' + n + '</span><span class="unit">' + u + '</span>').join('<span class="unit"> و </span>');
  }
  function countUpDur(elm, target) {
    const t0 = performance.now(), dur = 750;
    const step = (t) => {
      const f = Math.min(1, (t - t0) / dur);
      const ease = 1 - Math.pow(1 - f, 3);
      elm.innerHTML = fmtDurHTML(Math.round(target * ease));
      if (f < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function countUp(elm, target, suffix, unit) {
    const t0 = performance.now(), dur = 750;
    const u = unit ? '<span class="unit">' + unit + '</span>' : '';
    const step = (t) => {
      const f = Math.min(1, (t - t0) / dur);
      const ease = 1 - Math.pow(1 - f, 3);
      if (unit) elm.innerHTML = Math.round(target * ease) + u;
      else elm.textContent = Math.round(target * ease) + (suffix || '');
      if (f < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function renderStats() {
    const now = Date.now();
    countUpDur($('st-longest'), Math.floor(longestStreak(now) / DAY));
    countUpDur($('st-current'), Math.floor(currentStreak(now) / DAY));
    countUpDur($('st-shortest'), Math.floor(shortestStreak(now) / DAY));
    countUp($('st-relapses'), state.relapses.length);
    const sd = new Date(state.trackingSince);
    $('st-since').textContent = sd.getDate() + ' ' + MONTHS[sd.getMonth()] + ' ' + sd.getFullYear();

    // الإحصائيات الإضافية
    const relTs = relapseList().map((r) => r.ts).sort((a, b) => a - b);
    const totalD1 = Math.max(1, Math.floor((startOfDay(now) - startOfDay(state.trackingSince)) / DAY) + 1);
    countUp($('st-pct'), Math.min(100, Math.round(totalCleanDays(now) / totalD1 * 100)), '%');
    const dcur = new Date(now);
    const mc = monthStats(dcur.getFullYear(), dcur.getMonth(), now);
    const mpd = new Date(dcur.getFullYear(), dcur.getMonth() - 1, 1);
    const mprev = monthStats(mpd.getFullYear(), mpd.getMonth(), now);
    countUpDur($('st-month'), mc.clean);
    $('st-month-label').textContent = 'الشهر ده 🆚 اللي فات (' + mprev.clean + ' ' + U.day(mprev.clean) + ')';
    let gap = 0;
    const gpts = [state.trackingSince].concat(relTs);
    for (let i = 0; i < gpts.length - 1; i++) gap = Math.max(gap, gpts[i + 1] - gpts[i]);
    if (relTs.length) countUpDur($('st-gap'), Math.floor(gap / DAY));
    else $('st-gap').textContent = '—';
    const streakD1 = Math.floor(currentStreak(now) / DAY);
    const nextMd = MEDALS.find((m) => m.d > streakD1);
    if (nextMd) {
      countUpDur($('st-nextmedal'), nextMd.d - streakD1);
      $('st-nextmedal-label').textContent = 'باقي على ' + nextMd.name;
    } else {
      $('st-nextmedal').textContent = '🏆';
      $('st-nextmedal-label').textContent = 'وصلت لآخر وسام';
    }
    const resisted = (state.urges || []).filter((u) => u.resisted !== false).length;
    countUp($('st-resist'), resisted);
    if (!relTs.length) {
      $('st-recovery').textContent = '—';
    } else {
      const gapsD = [];
      for (let i = 0; i < relTs.length - 1; i++) gapsD.push((relTs[i + 1] - relTs[i]) / DAY);
      if (relTs.length === 1) gapsD.push(currentStreak(now) / DAY);
      countUpDur($('st-recovery'), Math.round(gapsD.reduce((a, b) => a + b, 0) / gapsD.length));
    }
    const hardTs = (state.hardDays || []).map((h) => h.ts);
    const lastHard = hardTs.length ? Math.max.apply(null, hardTs) : state.trackingSince;
    countUpDur($('st-nohard'), Math.max(0, Math.floor((startOfDay(now) - startOfDay(lastHard)) / DAY)));

    // weekly bars: last 8 weeks, Saturday-first
    const wb = $('week-bars');
    wb.innerHTML = '';
    const today0 = startOfDay(now);
    const today = new Date(today0);
    const satOffset = (today.getDay() + 1) % 7; // days since Saturday
    const thisSat = today0 - satOffset * DAY;
    for (let i = 7; i >= 0; i--) {
      const wStart = thisSat - i * 7 * DAY;
      let clean = 0;
      for (let d = 0; d < 7; d++) {
        const ts = wStart + d * DAY;
        if (ts > today0) break;
        if (isCleanDay(ts, now)) clean++;
      }
      const col = el('div', 'bar-col');
      const bar = el('div', 'bar');
      bar.style.height = '0%';
      setTimeout(() => { bar.style.height = Math.max(3, clean / 7 * 100) + '%'; }, 120 + (7 - i) * 70);
      const ws = new Date(wStart);
      col.appendChild(bar);
      col.appendChild(el('div', 'bar-label', ws.getDate() + '/' + (ws.getMonth() + 1)));
      col.appendChild(el('div', 'bar-label', String(clean)));
      wb.appendChild(col);
    }

    // reasons ranking
    const counts = {};
    for (const r of state.relapses) if (r.reason) counts[r.reason] = (counts[r.reason] || 0) + 1;
    const rl = $('reason-list');
    rl.innerHTML = '';
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!entries.length) rl.innerHTML = '<div class="empty">لسه مفيش انتكاسات مسجلة، وده كويس 💪</div>';
    const max = entries.length ? entries[0][1] : 1;
    entries.forEach(([name, cnt], idx) => {
      const item = el('div', 'reason-item' + (idx === 0 ? ' top' : ''));
      item.appendChild(el('div', 'reason-name', esc(name) + (idx === 0 ? ' 🔥' : '')));
      const wrap = el('div', 'reason-bar-wrap');
      const bar = el('div', 'reason-bar');
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = (cnt / max * 100) + '%'; }, 100 + idx * 90);
      wrap.appendChild(bar);
      item.appendChild(wrap);
      item.appendChild(el('div', 'reason-count', cnt + ' ' + U.rel(cnt)));
      rl.appendChild(item);
    });

    renderReport();
    renderHardDays(now);
    renderDiscipline(now);
    renderDiscCalendar();
    renderMonthCompare(now);
  }

  /* ---------- 📆 سجل الانضباط (ستايل مرجعي: شبكة مصغرة + تقويم شهري) ---------- */
  let dcCursor = 0;
  function renderDiscCalendar() {
    const now = Date.now();
    const today0 = startOfDay(now);
    const rel = relapseDaysSet();
    const hd = {};
    (state.hardDays || []).forEach((h) => { hd[dayKey(h.ts)] = true; });
    const trk0 = startOfDay(state.trackingSince);
    // الشبكة المصغرة: آخر 26 أسبوع (سبت → جمعة)، كل شهر متفصل بخط خفيف
    const cg = $('cg-grid');
    cg.innerHTML = '';
    const satOffset = (new Date(today0).getDay() + 1) % 7;
    const thisSat = today0 - satOffset * DAY;
    const W = 26;
    const startSat = thisSat - (W - 1) * 7 * DAY;
    for (let col = 0; col < W; col++) {
      const w0 = startSat + col * 7 * DAY;
      const colEl = el('div', 'cg-col');
      let mLabel = null;
      for (let r = 0; r < 7; r++) {
        const ts = w0 + r * DAY;
        const dd = new Date(ts);
        if (dd.getDate() === 1 && !mLabel) {
          mLabel = { label: MONTHS[dd.getMonth()], y: dd.getFullYear(), m: dd.getMonth() };
          if (col > 0) colEl.classList.add('mstart');
        }
        const c = el('div', 'cg-c');
        c.style.animationDelay = (col * 20 + r * 8) + 'ms';
        const k = dayKey(ts);
        if (ts > today0) c.classList.add('fut');
        else {
          c.classList.add('tap');
          c.onclick = () => { dcCursor = new Date(dd.getFullYear(), dd.getMonth(), 1).getTime(); renderDiscCalendar(); };
          if (rel.has(k)) c.classList.add('r');
          else if (hd[k]) c.classList.add('h');
          else if (isCleanDay(ts, now)) c.classList.add('c');
        }
        colEl.appendChild(c);
      }
      if (mLabel) {
        const s = el('span', 'cg-mlabel', mLabel.label);
        s.onclick = () => { dcCursor = new Date(mLabel.y, mLabel.m, 1).getTime(); renderDiscCalendar(); };
        colEl.appendChild(s);
      }
      cg.appendChild(colEl);
    }
    // التقويم الشهري
    if (!dcCursor) { const d0 = new Date(now); dcCursor = new Date(d0.getFullYear(), d0.getMonth(), 1).getTime(); }
    const cur = new Date(dcCursor);
    const y = cur.getFullYear(), m = cur.getMonth();
    $('dc-title').textContent = MONTHS[m] + ' ' + y;
    const nowD = new Date(now);
    $('dc-next').style.visibility = (nowD.getFullYear() === y && nowD.getMonth() === m) ? 'hidden' : 'visible';
    const daysEl = $('dc-days');
    daysEl.innerHTML = '';
    ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'].forEach((d) => daysEl.appendChild(el('span', '', d)));
    const g = $('dc-grid');
    g.innerHTML = '';
    const offset = (new Date(y, m, 1).getDay() + 1) % 7;
    for (let i = 0; i < offset; i++) g.appendChild(el('div', 'dc-cell empty'));
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const ts = new Date(y, m, d).getTime();
      const cell = el('div', 'dc-cell');
      cell.style.animationDelay = (d * 18) + 'ms';
      cell.appendChild(el('span', 'dc-num', String(d)));
      const k = dayKey(ts);
      let filled = false;
      if (ts > today0) cell.classList.add('future');
      else if (rel.has(k)) { cell.classList.add('rel'); cell.appendChild(el('span', 'dc-x', '✕')); }
      else if (hd[k]) { cell.classList.add('hard'); filled = true; }
      else if (isCleanDay(ts, now)) { cell.classList.add('clean'); filled = true; }
      else if (ts < trk0) cell.classList.add('before');
      if (filled) cell.appendChild(el('span', 'dc-dot'));
      if (k === dayKey(now)) cell.classList.add('today');
      if (ts <= today0) {
        cell.classList.add('tap');
        cell.onclick = () => openDayModal(ts);
      }
      g.appendChild(cell);
    }
  }

  function resyncStart() {
    const relTs = (state.relapses || []).map((r) => r.ts);
    state.startTs = relTs.length ? Math.max.apply(null, relTs.concat([state.trackingSince])) : state.trackingSince;
  }

  /* تفاصيل يوم من سجل الانضباط */
  function refreshAfterDayEdit() {
    resyncStart();
    save();
    tickCounter(true);
    renderDiscCalendar();
    renderStats();
  }
  function openDayModal(ts) {
    const now = Date.now();
    const k = dayKey(ts);
    const d = new Date(ts);
    $('dm-title').textContent = WDAYS[(d.getDay() + 1) % 7] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    const body = $('dm-body');
    body.innerHTML = '';
    const rel = (state.relapses || []).filter((r) => dayKey(r.ts) === k);
    const hard = (state.hardDays || []).some((h) => dayKey(h.ts) === k);
    const urges = (state.urges || []).filter((u) => dayKey(u.ts) === k);
    const stateRow = el('div', 'dm-state');
    if (rel.length) { stateRow.classList.add('rel'); stateRow.textContent = '✕ يوم انتكاسة'; }
    else if (hard) { stateRow.classList.add('hard'); stateRow.textContent = '🥭 يوم صعب — وعدّى'; }
    else if (isCleanDay(ts, now)) { stateRow.classList.add('clean'); stateRow.textContent = '💚 يوم نضيف'; }
    else { stateRow.textContent = 'يوم عادي'; }
    body.appendChild(stateRow);
    rel.forEach((r) => {
      const box = el('div', 'dm-block');
      box.appendChild(el('div', 'dm-label', 'سبب الانتكاسة'));
      box.appendChild(el('div', 'dm-val', r.reason ? esc(r.reason) : 'مش مكتوب'));
      if (r.note) {
        box.appendChild(el('div', 'dm-label', 'ملاحظة'));
        box.appendChild(el('div', 'dm-val', esc(r.note)));
      }
      body.appendChild(box);
    });
    if (urges.length) {
      const box = el('div', 'dm-block');
      box.appendChild(el('div', 'dm-label', 'الرغبات في اليوم ده'));
      const NAMES = { 1: '🍃 خفيفة', 2: '🌊 متوسطة', 3: '🔥 قوية' };
      urges.forEach((u) => {
        const t = new Date(u.ts);
        const hh = t.getHours() % 12 || 12;
        const ap = t.getHours() < 12 ? 'ص' : 'م';
        box.appendChild(el('div', 'dm-val', (NAMES[u.s] || '🌊 متوسطة') + ' • ' + hh + ' ' + ap + ' — ' + (u.resisted !== false ? 'قاومتها ✓' : 'آخرها انتكاسة')));
      });
      body.appendChild(box);
    }
    if (state.dayNotes && state.dayNotes[k]) {
      const box = el('div', 'dm-block');
      box.appendChild(el('div', 'dm-label', 'ملاحظتك عن اليوم'));
      box.appendChild(el('div', 'dm-val', esc(state.dayNotes[k])));
      body.appendChild(box);
    }
    if (ts < startOfDay(state.trackingSince)) body.appendChild(el('div', 'hint', 'اليوم ده قبل بداية المتابعة، لكن تقدر تسجل فيه برضه.'));
    // تسجيل/تعديل اليوم
    const act = el('div', 'dm-actions');
    if (!rel.length) {
      const reasonIn = el('input', 'text-input');
      reasonIn.placeholder = 'سبب الانتكاسة (اختياري)';
      reasonIn.maxLength = 40;
      reasonIn.style.marginBottom = '8px';
      body.appendChild(reasonIn);
      const bRel = el('button', 'btn danger', '✕ سجّل انتكاسة');
      bRel.onclick = () => {
        state.relapses.push({ ts: ts + 12 * 3600e3, reason: reasonIn.value.trim(), note: '' });
        state.hardDays = (state.hardDays || []).filter((h) => dayKey(h.ts) !== k);
        refreshAfterDayEdit();
        openDayModal(ts);
        toast('اتسجلت ✓');
      };
      act.appendChild(bRel);
    }
    if (!hard && !rel.length) {
      const bHard = el('button', 'btn ghost', '🥭 يوم صعب');
      bHard.onclick = () => {
        state.hardDays = state.hardDays || [];
        state.hardDays.push({ ts: ts + 12 * 3600e3 });
        refreshAfterDayEdit();
        openDayModal(ts);
        toast('اتسجل يوم صعب 💙');
      };
      act.appendChild(bHard);
    }
    if (rel.length || hard) {
      const bClear = el('button', 'btn ghost', '💚 مسح العلامة (يوم نضيف)');
      bClear.onclick = () => {
        state.relapses = (state.relapses || []).filter((r) => dayKey(r.ts) !== k);
        state.hardDays = (state.hardDays || []).filter((h) => dayKey(h.ts) !== k);
        refreshAfterDayEdit();
        openDayModal(ts);
        toast('اتمسحت العلامة ✓');
      };
      act.appendChild(bClear);
    }
    body.appendChild(act);
    $('day-modal').classList.remove('hidden');
  }

  /* ---------- الشهر ده قد اللي فات ---------- */
  function monthStats(y, m, now) {
    const dim = new Date(y, m + 1, 0).getDate();
    const today0 = startOfDay(now);
    const track0 = startOfDay(state.trackingSince);
    const rel = relapseDaysSet();
    let clean = 0, run = 0, best = 0, rels = 0;
    for (let d = 1; d <= dim; d++) {
      const ts = new Date(y, m, d).getTime();
      if (ts > today0) break;
      if (ts < track0) continue;
      if (rel.has(dayKey(ts))) { rels++; run = 0; } else { clean++; run++; if (run > best) best = run; }
    }
    return { clean, best, rels };
  }
  function renderMonthCompare(now) {
    const d = new Date(now);
    const cur = monthStats(d.getFullYear(), d.getMonth(), now);
    const pd = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    const prev = monthStats(pd.getFullYear(), pd.getMonth(), now);
    const body = $('mv-body');
    body.innerHTML = '';
    const rows = [
      ['أيام الانضباط', cur.clean, prev.clean, false],
      ['أطول سلسلة', cur.best, prev.best, false],
      ['الانتكاسات', cur.rels, prev.rels, true]
    ];
    let delay = 100;
    for (const [label, cv, pv, invert] of rows) {
      const row = el('div', 'mv-row');
      row.appendChild(el('div', 'mv-label', label));
      const bars = el('div', 'mv-bars');
      const mx = Math.max(cv, pv, 1);
      const b1 = el('div', 'mv-bar cur');
      b1.appendChild(el('span', 'mv-val', String(cv)));
      const b2 = el('div', 'mv-bar prv');
      b2.appendChild(el('span', 'mv-val', String(pv)));
      bars.appendChild(b1); bars.appendChild(b2);
      setTimeout(() => {
        b1.style.width = Math.max(8, cv / mx * 100) + '%';
        b2.style.width = Math.max(8, pv / mx * 100) + '%';
      }, delay);
      delay += 120;
      row.appendChild(bars);
      const diff = cv - pv;
      const good = invert ? diff <= 0 : diff >= 0;
      row.appendChild(el('div', 'mv-delta ' + (diff === 0 ? 'same' : good ? 'up' : 'down'),
        diff === 0 ? 'نفسه' : (diff > 0 ? '▲ ' + diff : '▼ ' + (-diff))));
      body.appendChild(row);
    }
    body.appendChild(el('div', 'hint', 'الشريط المضيء = ' + MONTHS[d.getMonth()] + ' • الباهت = ' + MONTHS[pd.getMonth()]));
  }

  /* ---------- صورة ملخص الشهر (من غير اسم العادة) ---------- */
  function roundRectPath(cx, x, y, w, h, r) {
    cx.beginPath();
    cx.moveTo(x + r, y);
    cx.arcTo(x + w, y, x + w, y + h, r);
    cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r);
    cx.arcTo(x, y, x + w, y, r);
    cx.closePath();
  }
  function shareMonthImage() {
    const now = Date.now();
    const d = new Date(now);
    const y = d.getFullYear(), m = d.getMonth();
    const ms = monthStats(y, m, now);
    const totalDays = Math.max(1, Math.floor((startOfDay(now) - startOfDay(state.trackingSince)) / DAY) + 1);
    const pct = Math.min(100, Math.round(totalCleanDays(now) / totalDays * 100));
    const medals = MEDALS.filter((md) => milestoneReached(md.d, now)).length;
    const acc = state.accent || '#2dd4bf';
    const cv = document.createElement('canvas');
    cv.width = 1080; cv.height = 1350;
    const cx = cv.getContext('2d');
    const draw = () => {
      cx.fillStyle = '#0a0a0e';
      cx.fillRect(0, 0, 1080, 1350);
      const rg = cx.createRadialGradient(540, 300, 40, 540, 300, 700);
      rg.addColorStop(0, acc + '33');
      rg.addColorStop(1, '#0a0a0e00');
      cx.fillStyle = rg;
      cx.fillRect(0, 0, 1080, 1350);
      cx.textAlign = 'center';
      cx.direction = 'rtl';
      cx.fillStyle = '#9a9aac';
      cx.font = '600 52px Cairo, sans-serif';
      cx.fillText('ملخص شهر', 540, 190);
      cx.fillStyle = '#f4f4f8';
      cx.font = '800 100px Cairo, sans-serif';
      cx.fillText(MONTHS[m] + ' ' + y, 540, 315);
      cx.fillStyle = acc;
      cx.font = '800 300px Cairo, sans-serif';
      cx.fillText(String(ms.clean), 540, 650);
      cx.font = '700 56px Cairo, sans-serif';
      cx.fillText('يوم انضباط في الشهر ده', 540, 745);
      const rows = [
        ['أطول سلسلة في الشهر', ms.best + ' يوم'],
        ['نسبة الانضباط الكلية', pct + '٪'],
        ['الأوسمة المكتسبة', String(medals)]
      ];
      let ry = 900;
      for (const [k, v] of rows) {
        cx.fillStyle = '#15151d';
        roundRectPath(cx, 140, ry - 58, 800, 96, 28);
        cx.fill();
        cx.fillStyle = '#9a9aac';
        cx.font = '600 44px Cairo, sans-serif';
        cx.textAlign = 'right';
        cx.fillText(k, 880, ry);
        cx.fillStyle = acc;
        cx.font = '800 48px Cairo, sans-serif';
        cx.textAlign = 'left';
        cx.fillText(v, 200, ry);
        ry += 130;
      }
      cx.textAlign = 'center';
      cx.fillStyle = '#9a9aac';
      cx.font = '600 44px Cairo, sans-serif';
      cx.fillText('كل يوم نضيف بيفرق', 540, 1258);
      cx.fillStyle = '#55556a';
      cx.font = '600 38px Cairo, sans-serif';
      cx.fillText('انتكاسة', 540, 1316);
      const out = cv.toDataURL('image/png');
      if (window.AndroidBridge && AndroidBridge.shareImage) {
        AndroidBridge.shareImage(out.split(',')[1]);
      } else {
        const a = document.createElement('a');
        a.href = out; a.download = 'month-summary.png'; a.click();
      }
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw); else draw();
  }

  const AVATAR_DEFAULT_SRC = 'data:image/png;base64,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';

  /* بطاقة كل الإحصائيات كصورة قابلة للمشاركة (من غير اسم العادة) */
  function fmtDurText(d) { return fmtDurParts(d).map(([n, u]) => n + ' ' + u).join(' و '); }

  function shareStatsImage() {
    const now = Date.now();
    const acc = state.accent || '#2dd4bf';
    const streakD = Math.floor(currentStreak(now) / DAY);
    const longestD = Math.floor(longestStreak(now) / DAY);
    const shortestD = Math.floor(shortestStreak(now) / DAY);
    const relTs = relapseList().map((r) => r.ts);
    const relN = relTs.length;
    const totalD1 = Math.max(1, Math.floor((startOfDay(now) - startOfDay(state.trackingSince)) / DAY) + 1);
    const cleanTotal = totalCleanDays(now);
    const pct = Math.min(100, Math.round(cleanTotal / totalD1 * 100));
    const dcur = new Date(now);
    const mc = monthStats(dcur.getFullYear(), dcur.getMonth(), now);
    const mpd = new Date(dcur.getFullYear(), dcur.getMonth() - 1, 1);
    const mprev = monthStats(mpd.getFullYear(), mpd.getMonth(), now);
    let gap = 0;
    const gpts = [state.trackingSince].concat(relTs);
    for (let i = 0; i < gpts.length - 1; i++) gap = Math.max(gap, gpts[i + 1] - gpts[i]);
    const gapD = Math.floor(gap / DAY);
    const nextMd = MEDALS.find((m) => m.d > streakD);
    const medalsN = MEDALS.filter((md) => milestoneReached(md.d, now)).length;
    const resisted = (state.urges || []).filter((u) => u.resisted !== false).length;
    let recTxt = '—';
    if (relN) {
      const gapsD = [];
      for (let i = 0; i < relN - 1; i++) gapsD.push((relTs[i + 1] - relTs[i]) / DAY);
      if (relN === 1) gapsD.push(currentStreak(now) / DAY);
      recTxt = fmtDurText(Math.round(gapsD.reduce((a, b) => a + b, 0) / gapsD.length));
    }
    const sd = new Date(state.trackingSince);
    const sinceTxt = sd.getDate() + ' ' + MONTHS[sd.getMonth()] + ' ' + sd.getFullYear();
    const xp = xpNow(now);
    const li = levelOf(xp);
    const tiles = [
      ['بقالي كام يوم منضبط من آخر انتكاسة', fmtDurText(streakD), ''],
      ['أطول مدة', fmtDurText(longestD), ''],
      ['أقصر مدة', fmtDurText(shortestD), ''],
      ['انتكست كام مرة', relN + ' ' + unit(relN, 'مرة', 'مرتين', 'مرات', 'مرة'), ''],
      ['نسبة الانضباط من البداية', pct + '٪', ''],
      ['الشهر ده مقابل اللي فات', mc.clean + ' / ' + mprev.clean + ' يوم', ''],
      ['أطول فترة بين انتكاستين', relN ? fmtDurText(gapD) : '—', ''],
      ['باقي على الوسام الجاي', nextMd ? fmtDurText(nextMd.d - streakD) : 'وصلت لآخر وسام', nextMd ? nextMd.name : ''],
      ['قاومت الرغبة كام مرة', resisted + ' ' + unit(resisted, 'مرة', 'مرتين', 'مرات', 'مرة'), ''],
      ['متوسط الرجوع للثبات بعد الانتكاسة', recTxt, ''],
      ['إجمالي أيام الانضباط', fmtDurText(cleanTotal), ''],
      ['الأوسمة المكتسبة', medalsN + ' من ' + MEDALS.length, ''],
      ['تاريخ البدء', sinceTxt, '']
    ];
    const cv = document.createElement('canvas');
    cv.width = 1080; cv.height = 1920;
    const cx = cv.getContext('2d');
    const finish = () => {
      const out = cv.toDataURL('image/png');
      if (window.AndroidBridge && AndroidBridge.shareImage) AndroidBridge.shareImage(out.split(',')[1]);
      else { const a = document.createElement('a'); a.href = out; a.download = 'my-stats.png'; a.click(); }
    };
    const drawAvatar = (img) => {
      // الخلفية + توهج نيون ناعم
      cx.fillStyle = '#0a0a0e';
      cx.fillRect(0, 0, 1080, 1920);
      let rg = cx.createRadialGradient(540, 230, 40, 540, 230, 720);
      rg.addColorStop(0, acc + '30');
      rg.addColorStop(1, '#0a0a0e00');
      cx.fillStyle = rg;
      cx.fillRect(0, 0, 1080, 700);
      rg = cx.createRadialGradient(540, 1750, 60, 540, 1750, 640);
      rg.addColorStop(0, acc + '18');
      rg.addColorStop(1, '#0a0a0e00');
      cx.fillStyle = rg;
      cx.fillRect(0, 1300, 1080, 620);
      // الصورة الشخصية: مربع بحواف دائرية وحلقة نيون متوهجة
      const ax = 540, ay = 225, hs = 112, rr = 58;
      cx.save();
      cx.shadowColor = acc;
      cx.shadowBlur = 46;
      cx.strokeStyle = acc;
      cx.lineWidth = 10;
      roundRectPath(cx, ax - hs - 8, ay - hs - 8, (hs + 8) * 2, (hs + 8) * 2, rr + 8);
      cx.stroke();
      cx.restore();
      cx.save();
      roundRectPath(cx, ax - hs, ay - hs, hs * 2, hs * 2, rr);
      cx.clip();
      const av = state.avatar;
      if (img) {
        const s = Math.max(hs * 2 / img.width, hs * 2 / img.height);
        cx.drawImage(img, ax - img.width * s / 2, ay - img.height * s / 2, img.width * s, img.height * s);
      } else {
        const col = (av && av.col) || acc;
        cx.fillStyle = col + '33';
        cx.fillRect(ax - hs, ay - hs, hs * 2, hs * 2);
        cx.fillStyle = col;
        cx.font = '800 110px Cairo, sans-serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText((state.profileName || 'ب').trim().charAt(0), ax, ay + 8);
        cx.textBaseline = 'alphabetic';
      }
      cx.restore();
      cx.textAlign = 'center';
      cx.direction = 'rtl';
      cx.fillStyle = '#f4f4f8';
      cx.font = '800 66px Cairo, sans-serif';
      cx.fillText(state.profileName || 'بطل التعافي', 540, 415);
      cx.fillStyle = acc;
      cx.font = '700 42px Cairo, sans-serif';
      cx.fillText(LEVELS[li][1] + ' • ' + xp + ' نقطة', 540, 478);
      cx.fillStyle = '#9a9aac';
      cx.font = '600 38px Cairo, sans-serif';
      cx.fillText('بيتخلص من: ' + state.habit.name, 540, 536);
      // شبكة الإحصائيات
      const tw = 460, th = 140, gx = 40, gy = 24, x0 = 70, y0 = 592;
      tiles.forEach((t, i) => {
        const colI = i % 2, rowI = Math.floor(i / 2);
        const tx = x0 + colI * (tw + gx), ty = y0 + rowI * (th + gy);
        cx.fillStyle = '#15151d';
        roundRectPath(cx, tx, ty, tw, th, 26);
        cx.fill();
        cx.strokeStyle = '#ffffff14';
        cx.lineWidth = 2;
        cx.stroke();
        cx.fillStyle = '#9a9aac';
        cx.font = '600 33px Cairo, sans-serif';
        cx.fillText(t[0], tx + tw / 2, ty + 46);
        cx.fillStyle = acc;
        cx.font = '800 50px Cairo, sans-serif';
        cx.fillText(t[1], tx + tw / 2, ty + (t[2] ? 92 : 100));
        if (t[2]) {
          cx.fillStyle = '#c9c9d8';
          cx.font = '700 32px Cairo, sans-serif';
          cx.fillText(t[2], tx + tw / 2, ty + 128);
        }
      });
      const endY = y0 + Math.ceil(tiles.length / 2) * (th + gy) + 26;
      cx.fillStyle = '#9a9aac';
      cx.font = '600 42px Cairo, sans-serif';
      cx.fillText('كل يوم نضيف بيفرق', 540, endY + 52);
      cx.fillStyle = '#55556a';
      cx.font = '600 36px Cairo, sans-serif';
      cx.fillText('انتكاسة', 540, endY + 104);
      finish();
    };
    const go = () => {
      const av = state.avatar;
      let src = null;
      if (av && av.type === 'photo' && av.data) src = av.data;
      else if (!av) src = AVATAR_DEFAULT_SRC;
      if (src) {
        const img = new Image();
        img.onload = () => drawAvatar(img);
        img.onerror = () => drawAvatar(null);
        img.src = src;
      } else drawAvatar(null);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
  }

  /* التقرير الأسبوعي: الأسبوع ده قد اللي فات */
  let reportTab = 'w';
  function renderReport() {
    const now = Date.now();
    $('report-title').textContent = reportTab === 'w' ? '📈 التقرير الأسبوعي' : '📈 التقرير الشهري';
    if (reportTab === 'w') {
      const today0 = startOfDay(now);
      const thisSat = today0 - ((new Date(today0).getDay() + 1) % 7) * DAY;
      renderWeeklyReport(now, thisSat, today0);
    } else renderMonthlyReport(now);
    const dots = $('report-dots');
    dots.innerHTML = '';
    [['w', 'أسبوعي'], ['m', 'شهري']].forEach(([t, n]) => {
      const b = el('button', t === reportTab ? 'active' : '');
      b.title = n;
      b.onclick = () => switchReport(t, t === 'm' ? 'l' : 'r');
      dots.appendChild(b);
    });
  }
  function switchReport(t, dir) {
    if (t === reportTab) return;
    const c = $('report-card');
    const outCls = dir === 'r' ? 'cslide-out-r' : 'cslide-out-l';
    c.classList.remove('cslide-in-r', 'cslide-in-l', 'cslide-out-r', 'cslide-out-l');
    c.classList.add(outCls);
    setTimeout(() => {
      reportTab = t;
      renderReport();
      c.classList.remove(outCls);
      c.classList.add(dir === 'r' ? 'cslide-in-r' : 'cslide-in-l');
    }, 180);
  }
  function stepReport(step) { switchReport(reportTab === 'w' ? 'm' : 'w', step > 0 ? 'l' : 'r'); }

  /* التقرير الشهري: الشهر ده قد اللي فات، نفس ستايل الأسبوعي */
  function renderMonthlyReport(now) {
    const d = new Date(now);
    const cur = monthStats(d.getFullYear(), d.getMonth(), now);
    const pd = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    const prev = monthStats(pd.getFullYear(), pd.getMonth(), now);
    const elapsed = d.getDate();
    const trk0 = startOfDay(state.trackingSince);
    let prevSame = 0;
    for (let i = 1; i <= elapsed; i++) {
      const ts = new Date(pd.getFullYear(), pd.getMonth(), i).getTime();
      if (ts < trk0) continue;
      if (isCleanDay(ts, now)) prevSame++;
    }
    const wb = $('weekly-body');
    wb.innerHTML = '';
    const wrap = el('div', 'weekly-compare');
    const dimCur = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const dimPrev = new Date(pd.getFullYear(), pd.getMonth() + 1, 0).getDate();
    const mk = (label, val, max, delay) => {
      const box = el('div', 'wk-col');
      const bw = el('div', 'wk-bar-wrap');
      const b = el('div', 'wk-bar');
      b.style.height = '4%';
      setTimeout(() => { b.style.height = Math.max(4, val / max * 100) + '%'; }, delay);
      bw.appendChild(b);
      box.appendChild(bw);
      const num = el('div', 'wk-num', '0');
      box.appendChild(num);
      countUp(num, val);
      box.appendChild(el('div', 'wk-label', label));
      return box;
    };
    wrap.appendChild(mk(MONTHS[d.getMonth()], cur.clean, dimCur, 200));
    wrap.appendChild(mk(MONTHS[pd.getMonth()], prev.clean, dimPrev, 350));
    wb.appendChild(wrap);
    let verdict, cls;
    if (cur.clean > prevSame) { verdict = 'أحسن من نفس الفترة الشهر اللي فات 📈 كمل كده!'; cls = 'good'; }
    else if (cur.clean < prevSame) { verdict = 'أقل من نفس الفترة الشهر اللي فات — ركّز الأيام الجاية 💪'; cls = 'bad'; }
    else { verdict = 'نفس مستوى الشهر اللي فات — ثبات برضه قوة'; cls = 'same'; }
    wb.appendChild(el('div', 'wk-verdict ' + cls, verdict));
    const relLine = cur.rels + prev.rels > 0
      ? `الانتكاسات: ${cur.rels} الشهر ده مقابل ${prev.rels} اللي فات`
      : 'مفيش انتكاسات في الشهرين دول 🎉';
    wb.appendChild(el('div', 'wk-rel', relLine));
  }

  function renderWeeklyReport(now, thisSat, today0) {
    let thisW = 0, lastW = 0, lastWSame = 0, thisRel = 0, lastRel = 0;
    const elapsed = Math.min(7, Math.floor((today0 - thisSat) / DAY) + 1);
    for (let d = 0; d < 7; d++) {
      const ts = thisSat + d * DAY;
      if (ts <= today0 && isCleanDay(ts, now)) thisW++;
      const lts = ts - 7 * DAY;
      if (isCleanDay(lts, now)) lastW++;
      if (d < elapsed && isCleanDay(lts, now)) lastWSame++;
    }
    for (const r of state.relapses) {
      if (r.ts >= thisSat) thisRel++;
      else if (r.ts >= thisSat - 7 * DAY) lastRel++;
    }
    const wb = $('weekly-body');
    wb.innerHTML = '';
    const wrap = el('div', 'weekly-compare');
    const mk = (label, val, delay) => {
      const box = el('div', 'wk-col');
      const bw = el('div', 'wk-bar-wrap');
      const b = el('div', 'wk-bar');
      b.style.height = '4%';
      setTimeout(() => { b.style.height = Math.max(4, val / 7 * 100) + '%'; }, delay);
      bw.appendChild(b);
      box.appendChild(bw);
      const num = el('div', 'wk-num', '0');
      box.appendChild(num);
      countUp(num, val);
      box.appendChild(el('div', 'wk-label', label));
      return box;
    };
    wrap.appendChild(mk('الأسبوع ده', thisW, 200));
    wrap.appendChild(mk('اللي فات', lastW, 350));
    wb.appendChild(wrap);
    let verdict, cls;
    if (thisW > lastWSame) { verdict = 'أحسن من نفس الفترة الأسبوع اللي فات 📈 كمل كده!'; cls = 'good'; }
    else if (thisW < lastWSame) { verdict = 'أقل من نفس الفترة الأسبوع اللي فات — ركّز الأيام الجاية 💪'; cls = 'bad'; }
    else { verdict = 'نفس مستوى الأسبوع اللي فات — ثبات برضه قوة'; cls = 'same'; }
    wb.appendChild(el('div', 'wk-verdict ' + cls, verdict));
    const relLine = thisRel + lastRel > 0
      ? `الانتكاسات: ${thisRel} الأسبوع ده مقابل ${lastRel} اللي فات`
      : 'مفيش انتكاسات في الأسبوعين دول 🎉';
    wb.appendChild(el('div', 'wk-rel', relLine));
  }

  /* الأيام الصعبة */
  function renderHardDays(now) {
    const hb = $('harddays-body');
    hb.innerHTML = '';
    const hd = (state.hardDays || []).slice().sort((a, b) => b.ts - a.ts);
    if (!hd.length) {
      hb.innerHTML = '<div class="empty">مفيش أيام صعبة مسجلة — ولو عدّى بيك يوم تقيل، سجّله من الرئيسية 💙</div>';
      return;
    }
    const monthAgo = now - 30 * DAY;
    const recent = hd.filter((h) => h.ts >= monthAgo).length;
    const row = el('div', 'stat-row');
    const mk = (n, l) => {
      const ms = el('div', 'mini-stat');
      const num = el('div', 'mini-num', '0');
      ms.appendChild(num);
      countUp(num, n);
      ms.appendChild(el('div', 'mini-label', l));
      return ms;
    };
    row.appendChild(mk(hd.length, 'يوم صعب إجمالي'));
    row.appendChild(mk(recent, 'آخر ٣٠ يوم'));
    hb.appendChild(row);
    hb.appendChild(el('div', 'hint', 'اليوم الصعب بيتسجل من غير ما يأثر على سلسلتك — تسجيله بيساعدك تفهم نفسك.'));
  }

  /* نسبة الانضباط + متوسط السلسلة */
  function renderDiscipline(now) {
    const totalDays = Math.max(1, Math.floor((startOfDay(now) - startOfDay(state.trackingSince)) / DAY) + 1);
    const clean = totalCleanDays(now);
    const pct = Math.min(100, Math.round(clean / totalDays * 100));
    const C = 2 * Math.PI * 52;
    const donut = $('disc-donut-arc');
    donut.style.strokeDasharray = C;
    donut.style.strokeDashoffset = C;
    setTimeout(() => { donut.style.strokeDashoffset = C * (1 - pct / 100); }, 150);
    countUp($('disc-pct'), pct, '%');
  }

  /* ---------- rewards / badges (neon medals) ---------- */
  const ICONS = {
    flame: (c) => `<path d="M40 68 C22 60 19 42 30 29 C34 23 36 17 36 10 C46 18 45 28 49 33 C53 27 53 20 51 13 C63 24 65 45 55 57 C51 63 46 66 40 68 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    shield: (c) => `<path d="M40 7 L63 16 V38 C63 55 52 67 40 73 C28 67 17 55 17 38 V16 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><path d="M30 39 L37 47 L52 30" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    bolt: (c) => `<path d="M45 6 L21 44 H38 L35 74 L59 33 H43 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    dumbbell: (c) => `<g stroke="${c}" stroke-width="5" stroke-linecap="round"><path d="M16 30 V50"/><path d="M27 23 V57"/><path d="M53 23 V57"/><path d="M64 30 V50"/><path d="M27 40 H53"/></g>`,
    mountain: (c) => `<path d="M8 64 L27 24 L39 45 L49 31 L72 64 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><circle cx="58" cy="18" r="6" fill="none" stroke="${c}" stroke-width="3.5"/>`,
    anchor: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"><circle cx="40" cy="16" r="7"/><path d="M40 23 V66"/><path d="M27 33 H53"/><path d="M17 50 C21 62 30 69 40 69 C50 69 59 62 63 50"/></g>`,
    clock: (c) => `<circle cx="40" cy="42" r="26" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4"/><path d="M40 28 V42 L51 48" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
    target: (c) => `<g fill="none" stroke="${c}" stroke-width="4"><circle cx="40" cy="40" r="26"/><circle cx="40" cy="40" r="16"/><circle cx="40" cy="40" r="6" fill="${c}" stroke="none"/></g>`,
    sun: (c) => `<circle cx="40" cy="40" r="14" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4"/><g stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M40 10 V19 M40 61 V70 M10 40 H19 M61 40 H70 M19 19 L25 25 M55 55 L61 61 M19 61 L25 55 M55 25 L61 19"/></g>`,
    rocket: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M40 6 C52 16 56 30 54 44 L46 50 H34 L26 44 C24 30 28 16 40 6 Z" fill="${c}" fill-opacity=".13"/><circle cx="40" cy="29" r="5"/><path d="M28 44 L19 56 L31 52"/><path d="M52 44 L61 56 L49 52"/><path d="M36 52 L40 63 L44 52"/></g>`,
    wings: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M8 52 C20 46 28 34 31 17 C39 29 39 44 33 57"/><path d="M72 52 C60 46 52 34 49 17 C41 29 41 44 47 57"/></g>`,
    star: (c) => `<path d="M40 8 L49 30 L72 31 L54 46 L61 69 L40 56 L19 69 L26 46 L8 31 L31 30 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    medal: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"><path d="M31 5 L37 26 M49 5 L43 26 M31 5 H49"/><circle cx="40" cy="49" r="21" fill="${c}" fill-opacity=".13"/><path d="M40 39 L43 46 L50 46 L44.5 51 L46.5 58 L40 54 L33.5 58 L35.5 51 L30 46 L37 46 Z" fill="${c}" stroke="none"/></g>`,
    crown: (c) => `<path d="M13 58 L9 23 L27 39 L40 15 L53 39 L71 23 L67 58 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><path d="M13 66 H67" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`,
    moon: (c) => `<path d="M52 9 A27 27 0 1 0 52 71 A22 22 0 1 1 52 9 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,
    diamond: (c) => `<g fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"><path d="M40 7 L66 30 L40 73 L14 30 Z" fill="${c}" fill-opacity=".13"/><path d="M14 30 H66 M40 7 L29 30 L40 73 M40 7 L51 30 L40 73" stroke-width="2.5"/></g>`,
    legend: (c) => `<path d="M16 64 L12 32 L28 46 L40 27 L52 46 L68 32 L64 64 Z" fill="${c}" fill-opacity=".13" stroke="${c}" stroke-width="4" stroke-linejoin="round"/><path d="M40 4 L43 12 L51 12 L45 17 L47 25 L40 20 L33 25 L35 17 L29 12 L37 12 Z" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`
  };

  function badgeSVG(md, earned) {
    const col = medalColor(md, earned);
    const ms = state.medalStyle || 'neon';
    const glow = !earned || ms === 'minimal' ? '' : ms === 'gold'
      ? `filter="drop-shadow(0 0 5px #f5c542cc) drop-shadow(0 0 18px #f59e0b55)"`
      : `filter="drop-shadow(0 0 5px ${md.col}cc) drop-shadow(0 0 16px ${md.col}55)"`;
    return `<svg viewBox="0 0 80 80" class="badge-svg"><g ${glow}>${ICONS[md.icon](col)}</g></svg>`;
  }

  function medalColor(md, earned) {
    if (!earned) return '#3f3f52';
    const ms = state.medalStyle || 'neon';
    if (ms === 'gold') return '#f5c542';
    if (ms === 'minimal') return '#d8d8e6';
    return md.col;
  }

  /* ---------- share achievement image ---------- */
  function shareMedal(md, at) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1080;
    const cx = cv.getContext('2d');
    const draw = (img) => {
      cx.fillStyle = '#0a0a0e';
      cx.fillRect(0, 0, 1080, 1080);
      const rg = cx.createRadialGradient(540, 420, 40, 540, 420, 560);
      const col = medalColor(md, true);
      rg.addColorStop(0, col + '44');
      rg.addColorStop(1, '#0a0a0e00');
      cx.fillStyle = rg;
      cx.fillRect(0, 0, 1080, 1080);
      if (img) cx.drawImage(img, 300, 110, 480, 480);
      cx.textAlign = 'center';
      cx.direction = 'rtl';
      cx.fillStyle = '#f4f4f8';
      cx.font = '800 92px Cairo, sans-serif';
      cx.fillText(md.name, 540, 690);
      cx.fillStyle = '#9a9aac';
      cx.font = '600 44px Cairo, sans-serif';
      cx.fillText(md.desc, 540, 762);
      cx.fillStyle = col;
      cx.font = '800 64px Cairo, sans-serif';
      cx.fillText(md.d + ' ' + U.day(md.d) + ' من الانضباط', 540, 856);
      const d = new Date(at);
      cx.fillStyle = '#9a9aac';
      cx.font = '600 40px Cairo, sans-serif';
      cx.fillText('اتحقق يوم ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(), 540, 922);
      cx.fillStyle = '#55556a';
      cx.font = '600 38px Cairo, sans-serif';
      cx.fillText(state.stealth ? 'ملاحظات' : 'انتكاسة', 540, 1006);
      const out = cv.toDataURL('image/png');
      if (window.AndroidBridge && AndroidBridge.shareImage) {
        AndroidBridge.shareImage(out.split(',')[1]);
      } else {
        const a = document.createElement('a');
        a.href = out; a.download = 'medal.png'; a.click();
      }
    };
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${ICONS[md.icon](medalColor(md, true))}</svg>`;
    const img = new Image();
    img.onload = () => { if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => draw(img)); else draw(img); };
    img.onerror = () => draw(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }

  /* ---------- achievements (medals) ---------- */
  function renderAch() {
    const now = Date.now();
    const grid = $('hex-done');
    grid.innerHTML = '';
    let delay = 0;
    if (state.challenge && state.challenge.done) {
      const item = el('div', 'hex-item');
      const wrap = el('div', 'badge-wrap earned chal-gold');
      wrap.innerHTML = '<div class="chal-gold-cup">🏆</div>';
      item.appendChild(wrap);
      item.appendChild(el('div', 'hex-name', 'وسام التحدي الذهبي'));
      const d = new Date(state.challenge.done);
      item.appendChild(el('div', 'hex-date', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()));
      grid.appendChild(item);
    }
    for (const md of MEDALS) {
      const at = milestoneReached(md.d, now);
      const isE = !!at;
      const item = el('div', 'hex-item');
      const wrap = el('div', 'badge-wrap' + (isE ? ' earned' : ' locked'));
      wrap.style.animationDelay = (delay += 45) + 'ms';
      wrap.innerHTML = badgeSVG(md, isE);
      item.appendChild(wrap);
      item.appendChild(el('div', 'medal-name', md.name));
      item.appendChild(el('div', 'hex-name', md.d + ' ' + U.day(md.d)));
      item.appendChild(el('div', 'medal-desc', md.desc));
      if (isE) {
        const d = new Date(at);
        item.appendChild(el('div', 'hex-date', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()));
        const sh = el('button', 'share-medal', '📤 شارك');
        sh.onclick = () => shareMedal(md, at);
        item.appendChild(sh);
      } else {
        item.appendChild(el('div', 'hex-date', '🔒'));
      }
      grid.appendChild(item);
    }

    const daysF = currentStreak(now) / DAY;
    const nextMd = MEDALS.find((m) => m.d > daysF);
    const box = $('ach-next');
    box.innerHTML = '';
    if (!nextMd) {
      box.innerHTML = '<div class="next-card"><div class="next-title">وصلت لآخر وسام 🤯 إنت أسطورة</div></div>';
      return;
    }
    let prev = 0;
    for (const m of MILESTONES) { if (m <= daysF) prev = m; else break; }
    const frac = Math.max(0, Math.min(1, (daysF - prev) / (nextMd.d - prev)));
    const card = el('div', 'next-card');
    const rem = Math.max(1, Math.ceil(nextMd.d - daysF));
    card.appendChild(el('div', 'next-title', `${nextMd.name} — فاضل ${rem} ${U.day(rem)}`));
    const pw = el('div', 'progress-wrap');
    const pr = el('div', 'progress');
    pr.style.width = (frac * 100).toFixed(1) + '%';
    pw.appendChild(pr);
    card.appendChild(pw);
    card.appendChild(el('div', 'next-sub', nextMd.desc + ' • قطعت ' + Math.floor(frac * 100) + '٪ من الطريق'));
    box.appendChild(card);
  }

  /* ---------- tree ---------- */
  const TREE_STAGES = [
    [0, 'بذرة 🌰'], [1, 'برعم 🌱'], [3, 'شتلة 🌿'], [7, 'شجيرة صغيرة'],
    [14, 'شجرة صغيرة'], [30, 'شجرة كبيرة'], [60, 'شجرة قوية'], [100, 'شجرة مزهرة 🌸'], [365, 'شجرة ذهبية ✨']
  ];
  function treeStage(days) {
    let s = 0;
    for (let i = 0; i < TREE_STAGES.length; i++) if (days >= TREE_STAGES[i][0]) s = i;
    return s;
  }
  function seededRand(seed) { let x = seed; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }

  function treeSVG(days) {
    const st = treeStage(days);
    const rnd = seededRand(42 + st);
    const trunkH = 40 + st * 26;
    const trunkW = 6 + st * 2.2;
    const topY = 300 - trunkH;
    const leafN = st === 0 ? 0 : Math.min(46, 4 + st * 6 + Math.floor(days / 10));
    const R = 18 + st * 9;
    const golden = st >= 8;
    const leafCols = golden ? ['#fbbf24', '#f59e0b', '#fde68a'] : ['#4ade80', '#22c55e', '#86efac', '#16a34a'];
    let s = `<svg viewBox="0 0 300 340" class="tree-svg">`;
    s += `<ellipse cx="150" cy="312" rx="86" ry="16" style="fill:var(--track)"/>`;
    if (st === 0) {
      s += `<ellipse cx="150" cy="300" rx="14" ry="10" fill="#a16207"/><circle cx="150" cy="296" r="3" fill="#d4a24a"/>`;
    } else {
      // trunk
      s += `<path d="M150 306 C ${146 - st} ${260 - st * 4}, ${154 + st} ${230 - st * 6}, 150 ${topY}" stroke="#8b5e34" stroke-width="${trunkW}" fill="none" stroke-linecap="round"/>`;
      // branches
      if (st >= 2) {
        s += `<path d="M150 ${topY + trunkH * 0.45} Q ${118 - st * 2} ${topY + 26} ${104 - st * 3} ${topY + 6}" stroke="#8b5e34" stroke-width="${Math.max(3, trunkW - 3)}" fill="none" stroke-linecap="round"/>`;
        s += `<path d="M150 ${topY + trunkH * 0.4} Q ${182 + st * 2} ${topY + 24} ${196 + st * 3} ${topY + 2}" stroke="#8b5e34" stroke-width="${Math.max(3, trunkW - 3)}" fill="none" stroke-linecap="round"/>`;
      }
      // leaves
      for (let i = 0; i < leafN; i++) {
        const a = rnd() * Math.PI * 2;
        const rr = Math.sqrt(rnd()) * R;
        const lx = 150 + Math.cos(a) * rr * 1.35;
        const ly = topY - 6 + Math.sin(a) * rr * 0.8;
        const lr = 7 + rnd() * (5 + st);
        const col = leafCols[Math.floor(rnd() * leafCols.length)];
        s += `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${lr.toFixed(1)}" fill="${col}" opacity=".92"/>`;
      }
      // flowers
      if (st >= 7) {
        for (let i = 0; i < 7; i++) {
          const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * R;
          s += `<circle cx="${(150 + Math.cos(a) * rr * 1.3).toFixed(1)}" cy="${(topY - 6 + Math.sin(a) * rr * 0.8).toFixed(1)}" r="4" fill="#f9a8d4"/>`;
        }
      }
    }
    s += `</svg>`;
    return s;
  }

  function renderTree() {
    const now = Date.now();
    const days = Math.floor(currentStreak(now) / DAY);
    const st = treeStage(days);
    $('tree-stage').innerHTML = `<b>${TREE_STAGES[st][1]}</b> — ${days} ${U.day(days)}`;
    $('tree-wrap').innerHTML = treeSVG(days);
    const nextSt = st + 1;
    if (nextSt < TREE_STAGES.length) {
      const need = TREE_STAGES[nextSt][0];
      const prevNeed = TREE_STAGES[st][0];
      $('tree-progress').style.width = Math.min(100, (days - prevNeed) / (need - prevNeed) * 100).toFixed(1) + '%';
      const rem = need - days;
      $('tree-next').textContent = `فاضل ${rem} ${U.day(rem)} على: ${TREE_STAGES[nextSt][1]}`;
    } else {
      $('tree-progress').style.width = '100%';
      $('tree-next').textContent = 'شجرتك وصلت لأعلى مرحلة ✨';
    }
  }

  /* ---------- profile ---------- */

  function avatarHTML(size) {
    const av = state.avatar;
    if (av && av.type === 'photo' && av.data) return `<img class="avatar-img" style="width:${size}px;height:${size}px" src="${av.data}">`;
    if (!av) return `<img class="avatar-img" style="width:${size}px;height:${size}px" src="img/avatar-default.png">`;
    const icon = (av && av.icon) || '💪';
    const col = (av && av.col) || '#2dd4bf';
    return `<div class="avatar-preset" style="width:${size}px;height:${size}px;background:${col}22;border-color:${col};font-size:${size * 0.45}px">${icon}</div>`;
  }

  function avatarMedalsHTML() {
    const now = Date.now();
    const earned = MEDALS.filter((md) => milestoneReached(md.d, now));
    if (!earned.length) return '';
    return '<div class="avatar-medals">' + earned.slice(-2).map((md) => '<span class="avatar-medal" title="' + esc(md.name) + '">' + badgeSVG(md, true) + '</span>').join('') + '</div>';
  }

  function renderProfile() {
    const now = Date.now();
    $('avatar-wrap').innerHTML = avatarHTML(104) + avatarMedalsHTML();
    $('profile-name').textContent = state.profileName || 'بطل التعافي';
    $('profile-sub').textContent = 'بيتخلص من: ' + state.habit.name;
    // XP + level
    const xp = xpNow(now);
    const li = levelOf(xp);
    $('level-name').textContent = LEVELS[li][1];
    $('level-xp').textContent = xp + ' نقطة';
    const lp = $('level-progress');
    if (li + 1 < LEVELS.length) {
      const lo = LEVELS[li][0], hi = LEVELS[li + 1][0];
      lp.style.width = '0%';
      setTimeout(() => { lp.style.width = ((xp - lo) / (hi - lo) * 100).toFixed(1) + '%'; }, 150);
      $('level-next').textContent = 'باقي ' + (hi - xp) + ' نقطة على مستوى ' + LEVELS[li + 1][1];
    } else {
      lp.style.width = '100%';
      $('level-next').textContent = 'وصلت لأعلى مستوى 👑';
    }
    renderJourney(now);
    const streakD = Math.floor(currentStreak(now) / DAY);
    $('pf-streak').textContent = streakD;
    $('pf-shortest').textContent = Math.floor(shortestStreak(now) / DAY);
    $('pf-total').textContent = totalCleanDays(now);
    $('pf-relapses').textContent = state.relapses.length;
    const earned = MEDALS.filter((md) => milestoneReached(md.d, now));
    $('pf-rewards').textContent = earned.length;
    /* وصل لآخر وسام (وسام الأسطورة - ١٠٠٠ يوم) → صورة البوديوم تحت الصورة الشخصية */
    $('legend-banner').classList.toggle('hidden', !milestoneReached(MEDALS[MEDALS.length - 1].d, now));
    const ng = $('pf-next');
    const nextMd = MEDALS.find((m) => m.d > streakD);
    ng.innerHTML = '';
    if (!nextMd) {
      ng.innerHTML = '<div class="next-title">وصلت لآخر وسام 🤯 إنت أسطورة</div>';
    } else {
      const rem = nextMd.d - streakD;
      ng.appendChild(el('div', 'next-title', '🎯 هدفك الجاي: ' + nextMd.name));
      const pw = el('div', 'progress-wrap');
      const pr = el('div', 'progress');
      pr.style.width = Math.min(100, streakD / nextMd.d * 100).toFixed(1) + '%';
      pw.appendChild(pr);
      ng.appendChild(pw);
      ng.appendChild(el('div', 'next-sub', `باقي ${rem} ${U.day(rem)} على ${nextMd.name}`));
    }
    /* ميم الأوسمة في حسابي: عنده أوسمة → الشخصية بتشاور عليها، لسه مفيش → الصورة التانية */
    const hasAnyMedal = earned.length > 0 || !!(state.challenge && state.challenge.done) || (state.pwCount || 0) > 0;
    $('pf-meme-pointer').classList.toggle('hidden', !hasAnyMedal);
    $('pf-meme-empty').classList.toggle('hidden', hasAnyMedal);
    const g = $('profile-rewards');
    g.innerHTML = '';
    if (!earned.length && !(state.pwCount > 0)) g.innerHTML = '<div class="empty">لسه مفيش أوسمة — أول واحد بعد ٣ أيام بس 💪</div>';
    if ((state.pwCount || 0) > 0) {
      const item = el('div', 'reward-item');
      item.innerHTML = '<div class="perfect-mini-wrap"><span class="perfect-mini-emoji">🌟</span><img class="perfect-sticker-mini" src="img/perfect-sticker.png" onerror="this.style.display=\'none\'"></div>';
      item.appendChild(el('div', 'hex-name', 'ملصق الأسبوع المثالي'));
      item.appendChild(el('div', 'hex-date', state.pwCount + (state.pwCount === 1 ? ' مرة' : ' مرات')));
      g.appendChild(item);
    }
    earned.forEach((md) => {
      const item = el('div', 'reward-item');
      item.innerHTML = badgeSVG(md, true);
      const at = milestoneReached(md.d, now);
      const d = new Date(at);
      item.appendChild(el('div', 'hex-name', md.name));
      item.appendChild(el('div', 'hex-date', d.getDate() + '/' + (d.getMonth() + 1)));
      g.appendChild(item);
    });
  }

  /* خط الرحلة: من أول يوم للنهاردة، بالانتكاسات والأوسمة */
  function renderJourney(now) {
    const t0 = state.trackingSince, t1 = now;
    const X = (ts) => 308 - Math.max(0, Math.min(1, (ts - t0) / Math.max(1, t1 - t0))) * 296;
    let s = `<svg viewBox="0 0 320 74" class="journey-svg">`;
    s += `<line x1="12" y1="30" x2="308" y2="30" stroke="#3a3a4a" stroke-width="3" stroke-linecap="round"/>`;
    for (const md of MEDALS) {
      const at = milestoneReached(md.d, now);
      if (at) s += `<circle cx="${X(at)}" cy="30" r="5" fill="#f5c542" stroke="#0a0a0e" stroke-width="1.5"/>`;
    }
    for (const r of relapseList()) {
      const x = X(r.ts);
      s += `<path d="M${x - 4} 26 L${x + 4} 34 M${x + 4} 26 L${x - 4} 34" stroke="#f87171" stroke-width="3" stroke-linecap="round"/>`;
    }
    for (const h of (state.hardDays || [])) {
      s += `<circle cx="${X(h.ts)}" cy="42" r="3" fill="#60a5fa"/>`;
    }
    s += `<circle cx="308" cy="30" r="6" fill="var(--acc)"/>`;
    s += `<circle cx="12" cy="30" r="6" fill="var(--acc)"><animate attributeName="r" values="5;7;5" dur="1.6s" repeatCount="indefinite"/></circle>`;
    const d0 = new Date(t0);
    s += `<text x="308" y="58" text-anchor="end" font-size="11" fill="#8a8a9c">البداية ${d0.getDate()}/${d0.getMonth() + 1}</text>`;
    s += `<text x="12" y="58" text-anchor="start" font-size="11" fill="#8a8a9c">النهاردة</text>`;
    s += '</svg>';
    s += '<div class="legend" style="margin-top:2px"><span><i class="dot" style="background:#f5c542"></i> وسام</span><span><i class="dot rel"></i> انتكاسة</span><span><i class="dot" style="background:#60a5fa"></i> يوم صعب</span></div>';
    $('journey').innerHTML = s;
  }

  function bindAvatar() {
    $('avatar-edit').onclick = () => {
      const p = $('avatar-presets');
      p.innerHTML = '';
      (window.SKETCH_AVATARS || []).forEach((src) => {
        const b = el('button', 'avatar-preset-btn img');
        const im = document.createElement('img');
        im.className = 'avatar-preset-img';
        im.src = src;
        im.alt = '';
        b.appendChild(im);
        b.onclick = () => openCrop(src);
        p.appendChild(b);
      });
      $('avatar-modal').classList.remove('hidden');
    };
    $('set-avatar').onclick = () => $('avatar-edit').click();
    $('avatar-cancel').onclick = () => $('avatar-modal').classList.add('hidden');
    $('avatar-default').onclick = () => {
      state.avatar = null;
      save(); $('avatar-modal').classList.add('hidden'); renderProfile(); toast('رجعنا للصورة الافتراضية ✓');
    };
    $('avatar-photo').onclick = () => $('avatar-file').click();
    $('avatar-file').onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => openCrop(rd.result);
      rd.readAsDataURL(f);
      e.target.value = '';
    };
    bindCrop();
  }

  /* قص الصورة: سحب + زووم قبل الحفظ */
  let cropSt = null;
  function drawCrop() {
    if (!cropSt) return;
    const cv = $('crop-canvas');
    const cx = cv.getContext('2d');
    const { img, scale, ox, oy } = cropSt;
    cx.fillStyle = '#000';
    cx.fillRect(0, 0, 560, 560);
    const w = img.width * scale, h = img.height * scale;
    cx.drawImage(img, 280 - w / 2 + ox, 280 - h / 2 + oy, w, h);
  }
  function clampCrop() {
    const { img, scale } = cropSt;
    const w = img.width * scale, h = img.height * scale;
    cropSt.ox = Math.max(Math.min(cropSt.ox, Math.max(0, (w - 560) / 2)), -Math.max(0, (w - 560) / 2));
    cropSt.oy = Math.max(Math.min(cropSt.oy, Math.max(0, (h - 560) / 2)), -Math.max(0, (h - 560) / 2));
  }
  function openCrop(src) {
    const img = new Image();
    img.onload = () => {
      /* البداية بالصورة كاملة ظاهرة (fit)، والزووم يكبّر لو عايز يقص */
      const base = 560 / Math.max(img.width, img.height);
      cropSt = { img, base, scale: base, ox: 0, oy: 0 };
      $('crop-zoom').value = 100;
      drawCrop();
      $('avatar-modal').classList.add('hidden');
      $('crop-modal').classList.remove('hidden');
    };
    img.src = src;
  }
  function bindCrop() {
    const cv = $('crop-canvas');
    let drag = null;
    cv.addEventListener('pointerdown', (e) => {
      if (!cropSt) return;
      drag = { x: e.clientX, y: e.clientY, ox: cropSt.ox, oy: cropSt.oy };
      cv.setPointerCapture(e.pointerId);
      cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', (e) => {
      if (!drag || !cropSt) return;
      const r = cv.getBoundingClientRect();
      const k = 560 / r.width;
      cropSt.ox = drag.ox + (e.clientX - drag.x) * k;
      cropSt.oy = drag.oy + (e.clientY - drag.y) * k;
      clampCrop();
      drawCrop();
    });
    const end = () => { drag = null; cv.style.cursor = 'grab'; };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    $('crop-zoom').oninput = (e) => {
      if (!cropSt) return;
      cropSt.scale = cropSt.base * (e.target.value / 100);
      clampCrop();
      drawCrop();
    };
    $('crop-cancel').onclick = () => {
      cropSt = null;
      $('crop-modal').classList.add('hidden');
      $('avatar-modal').classList.remove('hidden');
    };
    $('crop-ok').onclick = () => {
      if (!cropSt) return;
      const out = document.createElement('canvas');
      out.width = out.height = 512;
      const cx = out.getContext('2d');
      const { img, scale, ox, oy } = cropSt;
      const k = 512 / 560;
      const w = img.width * scale * k, h = img.height * scale * k;
      cx.drawImage(img, 256 - w / 2 + ox * k, 256 - h / 2 + oy * k, w, h);
      state.avatar = { type: 'photo', data: out.toDataURL('image/jpeg', 0.88) };
      save();
      cropSt = null;
      $('crop-modal').classList.add('hidden');
      renderProfile();
      toast('اتغيرت الصورة ✓');
    };
  }

  /* ---------- settings ---------- */
  function renderSettings() {
    $('set-habit').value = state.habit.name;
    $('set-name').value = state.profileName || '';
    $('set-title').value = state.title || '';
    const d = new Date(state.startTs);
    $('set-start').value = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + 'T' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    renderStylePicker();
    renderSwatches();
    renderCounterSwatches();
    renderThemePicker();
    renderPinArea();
    renderPhrases();
    renderMedalStylePicker();
    renderEventSettings();
    renderIconPicker();
    renderBioArea();
    renderHabitPick();
  }

  function renderHabitPick() {
    const hp = $('habit-pick');
    if (!hp) return;
    hp.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('on', b.dataset.habit === (state.habit.type || 'custom'));
      b.onclick = () => {
        const t = b.dataset.habit;
        if (t === 'custom') {
          state.habit.type = 'custom';
          save(); renderHabitPick();
          $('set-habit').focus();
          toast('اكتب اسم عادتك تحت ودوس حفظ ✍️');
          return;
        }
        state.habit = { type: t, name: HABIT_LABELS[t] };
        $('set-habit').value = state.habit.name;
        save(); renderHero(); renderHabitPick();
        toast('العادة اتغيرت ✓');
      };
    });
  }

  function renderMedalStylePicker() {
    const mp = $('medalstyle-picker');
    if (!mp) return;
    mp.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('on', b.dataset.ms === (state.medalStyle || 'neon'));
      b.onclick = () => {
        state.medalStyle = b.dataset.ms;
        save(); renderMedalStylePicker();
        toast('اتغير ستايل الأوسمة ✓');
      };
    });
  }

  function renderEventSettings() {
    $('event-name').value = state.event ? state.event.name : '';
    if (state.event) {
      const d = new Date(state.event.ts);
      $('event-date').value = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    } else {
      $('event-date').value = '';
    }
  }

  const ICON_OPTS = [
    { id: 'main', img: 'img/icon-main.png', label: 'الأساسية' },
    { id: 'cap', img: 'img/icon-cap.png', label: 'الشخصية' },
    { id: 'stick', img: 'img/icon-stick.png', label: 'الميم' },
  ];
  function renderIconPicker() {
    const ip = $('icon-pick');
    if (!ip) return;
    ip.innerHTML = '';
    ICON_OPTS.forEach((o) => {
      const b = el('button', 'icon-opt' + (state.icon === o.id ? ' on' : ''));
      const im = document.createElement('img');
      im.src = o.img; im.alt = o.label;
      b.appendChild(im);
      b.appendChild(el('span', '', o.label));
      b.onclick = () => pickIcon(o.id);
      ip.appendChild(b);
    });
  }
  function pickIcon(id) {
    if (state.icon === id) return;
    state.icon = id;
    state.stealth = false;
    save();
    if (window.AndroidBridge && AndroidBridge.setIcon) AndroidBridge.setIcon(id);
    applyStealth();
    renderIconPicker();
    toast('الأيقونة اتغيرت ✓ هتظهر خلال لحظات');
  }

  function renderBioArea() {
    const ba = $('bio-area');
    ba.innerHTML = '';
    const has = window.AndroidBridge && AndroidBridge.hasBiometric && AndroidBridge.hasBiometric();
    if (!state.pin) return;
    if (!has) {
      ba.appendChild(el('div', 'hint', 'البصمة مش متاحة على الجهاز ده.'));
      return;
    }
    const b = el('button', 'btn ghost', state.bio ? 'تعطيل الدخول بالبصمة' : 'تفعيل الدخول بالبصمة 👆');
    b.style.marginTop = '10px';
    b.onclick = () => {
      state.bio = !state.bio;
      save(); renderBioArea();
      toast(state.bio ? 'البصمة اتفعلت 👆' : 'البصمة اتعطلت');
    };
    ba.appendChild(b);
  }

  /* وضع التخفي: تغيير الاسم الظاهر جوه التطبيق كمان */
  function applyStealth() {
    const nm = state.stealth ? 'ملاحظات' : 'انتكاسة';
    document.title = nm;
    const an = document.querySelector('.app-name');
    if (an) an.textContent = nm;
    const lt = document.querySelector('.lock-title');
    if (lt) lt.textContent = nm;
    const sn = document.querySelector('.splash-name');
    if (sn) sn.textContent = nm;
  }

  /* عدّاد المناسبة على الرئيسية */
  function renderEventCard() {
    const card = $('event-card');
    if (!state.event || !state.event.ts) { card.classList.add('hidden'); return; }
    const left = Math.ceil((state.event.ts - Date.now()) / DAY);
    if (left < 0) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    const d = new Date(state.event.ts);
    $('event-body').innerHTML = '';
    const big = el('div', 'event-big');
    big.textContent = left === 0 ? 'النهاردة! 🎉' : 'باقي ' + left + ' ' + U.day(left);
    $('event-body').appendChild(big);
    $('event-body').appendChild(el('div', 'event-sub', 'على ' + esc(state.event.name) + ' — ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear()));
  }

  function renderStylePicker() {
    const opts = [['pills', '📋', 'الحبوب'], ['ring', '⭕', 'الحلقة'], ['rings5', '🎯', 'حلقات متعددة'], ['digits', '🔢', 'الأرقام'], ['sentence', '💬', 'الجملة'], ['bars', '📶', 'الأشرطة'], ['minis', '⭕', 'حلقات صغيرة']];
    const sp = $('style-picker');
    if (!sp) return;
    if (!state.styles || !state.styles.length) state.styles = STYLES.slice();
    sp.innerHTML = '';
    opts.forEach(([k, icon, name]) => {
      const b = el('button', 'style-opt' + ((state.styles || STYLES).includes(k) ? ' on' : ''));
      b.innerHTML = `<div class="si">${icon}</div><div class="sn">${name}</div>`;
      b.onclick = () => {
        if (state.styles.includes(k)) {
          if (state.styles.length === 1) { toast('لازم يفضل شكل واحد على الأقل 😅'); return; }
          state.styles = state.styles.filter((s2) => s2 !== k);
          if (state.style === k) { state.style = state.styles[0]; buildCounter(); tickCounter(true); }
        } else {
          state.styles.push(k);
          if (!state.style) state.style = k;
        }
        save();
        renderStylePicker();
        buildCounter();
        tickCounter(true);
      };
      sp.appendChild(b);
    });
  }

  function renderSwatches() {
    const sw = $('swatches');
    sw.innerHTML = '';
    ACCENTS.forEach((col) => {
      const b = el('button', 'sw' + (state.accent === col ? ' on' : ''));
      b.style.background = col;
      b.onclick = () => { state.accent = col; save(); applyAccent(); renderSwatches(); };
      sw.appendChild(b);
    });
    const custom = $('accent-custom');
    if (custom) {
      custom.value = state.accent;
      custom.oninput = () => { state.accent = custom.value; save(); applyAccent(); };
      custom.onchange = () => renderSwatches();
    }
  }

  function renderCounterSwatches() {
    const sw = $('counter-swatches');
    if (!sw) return;
    sw.innerHTML = '';
    /* اختيار تلقائي = يتبع لون التطبيق */
    const auto = el('button', 'sw sw-auto' + (!state.counterAccent ? ' on' : ''), 'A');
    auto.title = 'نفس لون التطبيق';
    auto.onclick = () => { state.counterAccent = ''; save(); applyAccent(); buildCounter(); tickCounter(true); renderCounterSwatches(); };
    sw.appendChild(auto);
    ACCENTS.forEach((col) => {
      const b = el('button', 'sw' + (state.counterAccent === col ? ' on' : ''));
      b.style.background = col;
      b.onclick = () => { state.counterAccent = col; save(); applyAccent(); buildCounter(); tickCounter(true); renderCounterSwatches(); };
      sw.appendChild(b);
    });
    const custom = $('counter-accent-custom');
    if (custom) {
      custom.value = counterAccent();
      custom.oninput = () => { state.counterAccent = custom.value; save(); applyAccent(); };
      custom.onchange = () => { buildCounter(); tickCounter(true); renderCounterSwatches(); };
    }
  }

  function renderThemePicker() {
    const tp = $('theme-picker');
    if (!tp) return;
    tp.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('on', b.dataset.theme === state.theme);
      b.onclick = () => {
        state.theme = b.dataset.theme;
        save(); applyTheme(); renderThemePicker();
        toast(state.theme === 'light' ? 'المظهر الفاتح اتفعل ☀️' : 'المظهر الداكن اتفعل 🌙');
      };
    });
  }

  function renderPinArea() {
    const pa = $('pin-area');
    pa.innerHTML = '';
    if (state.pin) {
      pa.appendChild(el('div', 'hint', 'القفل شغال. هيتطلب كل ما تفتح التطبيق.'));
      const b = el('button', 'btn danger', 'شيل القفل');
      b.onclick = () => { state.pin = null; state.bio = false; save(); renderPinArea(); renderBioArea(); toast('اتشال القفل'); };
      pa.appendChild(b);
    } else {
      pa.appendChild(el('div', 'hint', 'قفل بـ ٤ أرقام يحمي خصوصيتك لو حد فتح التطبيق.'));
      const b = el('button', 'btn ghost', 'فعّل القفل 🔐');
      b.onclick = () => startPinSetup();
      pa.appendChild(b);
    }
  }

  function renderPhrases() {
    const pl = $('phrase-list');
    pl.innerHTML = '';
    state.phrases.forEach((p, i) => {
      const item = el('div', 'phrase-item');
      item.appendChild(el('span', null, esc(p)));
      const del = el('button', 'phrase-del', '🗑');
      del.onclick = () => {
        if (state.phrases.length <= 1) { toast('لازم يفضل على الأقل عبارة واحدة'); return; }
        state.phrases.splice(i, 1); save(); renderPhrases();
      };
      item.appendChild(del);
      pl.appendChild(item);
    });
  }

  /* ---------- PIN ---------- */
  let lockBuf = '', lockMode = 'unlock', lockFirst = '';
  function openLock(mode) {
    lockMode = mode; lockBuf = ''; lockFirst = '';
    $('lock-msg').textContent = mode === 'setup' ? 'اختار ٤ أرقام' : '';
    $('lock').classList.remove('hidden');
    drawLock();
    const bioOk = mode === 'unlock' && state.bio && window.AndroidBridge && AndroidBridge.hasBiometric && AndroidBridge.hasBiometric();
    $('lock-bio').classList.toggle('hidden', !bioOk);
    if (bioOk) setTimeout(() => AndroidBridge.promptBiometric(), 500);
  }
  function drawLock() {
    const dots = $('lock-dots').children;
    for (let i = 0; i < 4; i++) dots[i].classList.toggle('f', i < lockBuf.length);
    const pad = $('lock-pad');
    if (!pad.children.length) {
      ['1','2','3','4','5','6','7','8','9','','0','⌫'].forEach((k) => {
        const b = el('button', null, k);
        if (k === '') b.style.visibility = 'hidden';
        b.onclick = () => pinKey(k);
        pad.appendChild(b);
      });
    }
  }
  function pinKey(k) {
    if (k === '⌫') { lockBuf = lockBuf.slice(0, -1); drawLock(); return; }
    if (!k || lockBuf.length >= 4) return;
    lockBuf += k;
    drawLock();
    if (lockBuf.length < 4) return;
    if (lockMode === 'unlock') {
      if (lockBuf === state.pin) { $('lock').classList.add('hidden'); }
      else {
        $('lock-msg').textContent = 'رقم غلط، حاول تاني';
        $('lock-dots').classList.add('shake');
        setTimeout(() => $('lock-dots').classList.remove('shake'), 450);
        lockBuf = ''; drawLock();
      }
    } else if (lockMode === 'setup') {
      lockFirst = lockBuf; lockBuf = ''; lockMode = 'setup2';
      $('lock-msg').textContent = 'اكتبهم تاني للتأكيد';
      $('lock-msg').style.color = 'var(--dim)';
      drawLock();
    } else {
      if (lockBuf === lockFirst) {
        state.pin = lockBuf; save();
        $('lock').classList.add('hidden');
        $('lock-msg').style.color = '';
        renderPinArea();
        toast('القفل اتفعّل 🔐');
      } else {
        $('lock-msg').style.color = '';
        $('lock-msg').textContent = 'مش متطابقين، نبدأ من الأول';
        lockMode = 'setup'; lockBuf = ''; lockFirst = '';
        drawLock();
      }
    }
  }

  /* ---------- relapse ---------- */
  let pickedReason = '';
  function openRelapse() {
    pickedReason = '';
    $('relapse-note').value = '';
    const rc = $('reason-chips');
    rc.innerHTML = '';
    REASONS.forEach((r) => {
      const c = el('button', 'chip', esc(r));
      c.onclick = () => {
        pickedReason = pickedReason === r ? '' : r;
        rc.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x.textContent === pickedReason));
      };
      rc.appendChild(c);
    });
    $('relapse-modal').classList.remove('hidden');
  }
  /* ميمز تأكيد الانتكاسة: عشوائي من غير ما نفس الصورة تيجي مرتين ورا بعض */
  const RELAPSE_MEMES = [
    { src: 'img/dog-relapse.jpg', title: 'انا كلب و انتكست' },
    { src: 'img/relapse-meme2.jpg', title: 'يا واد يا خلبوص 🤭😉' },
    { src: 'img/relapse-m1.jpg', title: '' },
    { src: 'img/relapse-m2.jpg', title: '' },
    { src: 'img/relapse-m3.jpg', title: '' },
    { src: 'img/relapse-m4.jpg', title: '' },
    { src: 'img/relapse-m5.jpg', title: '' },
    { src: 'img/relapse-m6.jpg', title: '' },
  ];
  let lastMeme = -1;
  function confirmRelapse() {
    let i;
    do { i = Math.floor(Math.random() * RELAPSE_MEMES.length); } while (RELAPSE_MEMES.length > 1 && i === lastMeme);
    lastMeme = i;
    const m = RELAPSE_MEMES[i];
    $('relapse-meme').src = m.src;
    const t = $('relapse-meme-title');
    t.textContent = m.title;
    t.classList.toggle('hidden', !m.title);
    $('relapse-confirm-modal').classList.remove('hidden');
  }
  function doRelapse() {
    const note = $('relapse-note').value.trim();
    const ts = Date.now();
    state.relapses.push({ ts, reason: pickedReason, note });
    state.startTs = ts;
    state.abajouraUntil = ts + 3 * 60e3; // صورة الاباجورة ٣ دقايق مكان العداد
    save();
    $('relapse-modal').classList.add('hidden');
    $('relapse-confirm-modal').classList.add('hidden');
    tickCounter(true);
    renderHeatmap();
    if (page === 'calendar') renderCalendar();
    if (page === 'stats') renderStats();
    /* تذكير "تذكر لماذا بدأت" مرة واحدة في الشهر، مع أول انتكاسة فيه */
    const md = new Date(ts);
    const monthKey = md.getFullYear() + '-' + (md.getMonth() + 1);
    if (state.lastReminderMonth !== monthKey) {
      state.lastReminderMonth = monthKey;
      save();
      $('reminder-modal').classList.remove('hidden');
      $('reminder-ok').onclick = () => {
        $('reminder-modal').classList.add('hidden');
        openAfterRelapse();
      };
    } else {
      openAfterRelapse();
    }
  }
  function openAfterRelapse() {
    const now = Date.now();
    countUp($('ar-count'), state.relapses.length);
    countUp($('ar-longest'), Math.floor(longestStreak(now) / DAY));
    countUp($('ar-shortest'), Math.floor(shortestStreak(now) / DAY));
    countUp($('ar-clean'), totalCleanDays(now));
    const mo = new Date(now).getMonth(), yr = new Date(now).getFullYear();
    const inMonth = relapseList().filter((r) => { const d = new Date(r.ts); return d.getMonth() === mo && d.getFullYear() === yr; });
    const md = $('ar-month-days');
    md.innerHTML = '';
    if (!inMonth.length) md.innerHTML = '<div class="empty">دي أول انتكاسة في الشهر ده</div>';
    inMonth.forEach((r) => {
      const d = new Date(r.ts);
      md.appendChild(el('span', 'chip on', 'يوم ' + d.getDate() + ' (' + WDAYS[(d.getDay() + 1) % 7] + ')'));
    });
    const counts = {};
    for (const r of state.relapses) if (r.reason) counts[r.reason] = (counts[r.reason] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const ins = $('ar-insight');
    ins.innerHTML = '';
    if (top) ins.appendChild(el('div', 'insight-line', 'أكتر سبب مكرر: <b>' + esc(top[0]) + '</b> (' + top[1] + ' ' + U.rel(top[1]) + ')'));
    const totalDays = Math.max(1, Math.floor((startOfDay(now) - startOfDay(state.trackingSince)) / DAY) + 1);
    const pct = Math.round(totalCleanDays(now) / totalDays * 100);
    ins.appendChild(el('div', 'insight-line', 'نسبة انضباطك الكلية: <b>' + pct + '٪</b> — الرقم ده الحقيقة، مش يوم واحد'));
    ins.appendChild(el('div', 'insight-line', 'كل سلسلة بتتعلم فيها حاجة جديدة عن نفسك. السلسلة الجديدة بدأت دلوقتي.'));
    $('after-relapse').classList.remove('hidden');
  }

  /* ---------- urge ---------- */
  function openUrge() {
    $('urge').classList.remove('hidden');
    urgeOpenTs = Date.now();
    $('urge-strength').classList.add('hidden');
    $('urge-actions').classList.remove('hidden');
    urgeSecs = 600;
    tickUrge();
    clearInterval(urgeTimer);
    urgeTimer = setInterval(() => {
      urgeSecs--;
      tickUrge();
      if (urgeSecs <= 0) showUrgeStrength();
    }, 1000);
    // breathing cycle: in 4s, hold 4s, out 6s
    const circle = $('breath-circle'), txt = $('breath-text');
    const phases = [['in', 'شهيق', 4000], ['hold', 'احبس', 4000], ['out', 'زفير', 6000]];
    let pi = 0;
    const runPhase = () => {
      const [cls, label, dur] = phases[pi];
      circle.className = 'breath-circle ' + cls;
      txt.textContent = label;
      pi = (pi + 1) % phases.length;
      breathTimer = setTimeout(runPhase, dur);
    };
    runPhase();
    // phrase rotation
    let phi = 0;
    const showPhrase = () => { $('urge-phrase').textContent = state.phrases[phi % state.phrases.length]; phi++; };
    showPhrase();
    phraseTimer = setInterval(showPhrase, 8000);
  }
  function tickUrge() { $('urge-timer').textContent = pad2(Math.floor(urgeSecs / 60)) + ':' + pad2(urgeSecs % 60); }
  function closeUrge(passed) {
    clearInterval(urgeTimer); clearTimeout(breathTimer); clearInterval(phraseTimer);
    $('urge').classList.add('hidden');
    $('urge-strength').classList.add('hidden');
    $('urge-actions').classList.remove('hidden');
    if (passed) toast('عدّت العشر دقايق وإنت صامد ✊');
  }
  function showUrgeStrength() {
    clearInterval(urgeTimer); clearTimeout(breathTimer); clearInterval(phraseTimer);
    $('urge-actions').classList.add('hidden');
    $('urge-strength').classList.remove('hidden');
  }
  function logUrge(s, resisted) {
    state.urges.push({ ts: urgeOpenTs || Date.now(), s: s, resisted: resisted !== false });
    save();
  }

  /* ---------- onboarding ---------- */
  function startOnboarding() {
    let habitType = '';
    $('onboard').classList.remove('hidden');
    document.querySelectorAll('.habit-card').forEach((c) => {
      c.onclick = () => {
        document.querySelectorAll('.habit-card').forEach((x) => x.classList.remove('on'));
        c.classList.add('on');
        habitType = c.dataset.habit;
        $('ob-custom-name').classList.toggle('hidden', habitType !== 'custom');
        if (habitType === 'custom') $('ob-custom-name').focus();
        setTimeout(() => {
          if (habitType !== 'custom' || $('ob-custom-name').value.trim()) obStep2(habitType);
        }, habitType === 'custom' ? 0 : 350);
      };
    });
    $('ob-custom-name').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && $('ob-custom-name').value.trim()) obStep2('custom');
    });
    const now = new Date();
    $('ob-start').value = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate()) + 'T' + pad2(now.getHours()) + ':' + pad2(now.getMinutes());
    $('ob-go').onclick = () => {
      const name = habitType === 'custom' ? $('ob-custom-name').value.trim() : HABIT_LABELS[habitType];
      const tsv = new Date($('ob-start').value).getTime();
      const ts = isNaN(tsv) ? Date.now() : Math.min(tsv, Date.now());
      state = {
        v: 1,
        habit: { type: habitType, name: name || 'عادتي' },
        title: '',
        trackingSince: ts,
        startTs: ts,
        relapses: [],
        dayNotes: {},
        avatar: null,
        profileName: '',
        pin: null,
        style: 'pills',
        accent: '#2dd4bf',
        theme: 'dark',
        phrases: DEFAULT_PHRASES.slice(),
        hardDays: [],
        medalStyle: 'neon',
        seenMedals: 0, batman3: false, challenge: null, devThanks: false, lastReminderMonth: '',
        counterAccent: '', abajouraUntil: 0, topPhotoIdx: 0, wchallenge: null, wchWins: 0,
        pwCount: 0, pwRunStart: 0, pwRunAwards: -1,
        event: null,
        stealth: false, icon: 'main',
        bio: false, urges: [], styles: STYLES.slice()
      };
      save();
      applyAccent();
      applyTheme();
      $('onboard').classList.add('hidden');
      boot();
      toast('يلا بينا! أول يوم بدأ 💪', 3000);
    };
  }
  function obStep2(habitType) {
    if (habitType === 'custom' && !$('ob-custom-name').value.trim()) { toast('اكتب اسم العادة الأول'); return; }
    $('ob-1').classList.add('hidden');
    $('ob-2').classList.remove('hidden');
  }

  /* ---------- daily phrase ---------- */
  function renderDaily() {
    const doy = Math.floor(startOfDay(Date.now()) / DAY);
    const streakD = Math.floor(currentStreak(Date.now()) / DAY);
    let bank = PHRASE_STAGES[0][1];
    for (const [min, arr] of PHRASE_STAGES) if (streakD >= min) bank = arr;
    const pool = state.phrases.concat(bank);
    $('daily-text').textContent = pool[doy % pool.length];
  }

  /* ---------- hero ---------- */
  function renderHero() {
    const t = (state.title || 'متخلّص من {العادة} منذ').replace('{العادة}', state.habit.name);
    $('hero-title').textContent = t;
    $('top-habit').textContent = state.habit.name;
  }

  /* ---------- backup (تشفير اختياري بكلمة سر) ---------- */
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  async function encryptState(json, pw) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
      await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']),
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(json));
    return JSON.stringify({ enc: 1, salt: b64(salt), iv: b64(iv), data: b64(data) });
  }

  async function decryptState(payload, pw) {
    const obj = JSON.parse(payload);
    if (!obj.enc) return payload;
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: unb64(obj.salt), iterations: 150000, hash: 'SHA-256' },
      await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']),
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(obj.iv) }, key, unb64(obj.data));
    return new TextDecoder().decode(plain);
  }

  async function backup() {
    const pw = ($('backup-pw').value || '').trim();
    const json = JSON.stringify(state, null, 2);
    let out = json, fname = 'intikasa-backup.json';
    if (pw) {
      if (!crypto.subtle) { toast('التشفير مش متاح على الجهاز ده'); return; }
      try {
        out = await encryptState(json, pw);
        fname = 'intikasa-backup.enc';
      } catch (e) { toast('حصلت مشكلة في التشفير'); return; }
    }
    if (window.AndroidBridge && AndroidBridge.saveBackup) {
      AndroidBridge.saveBackup(out, fname);
    } else {
      try {
        const blob = new Blob([out], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fname;
        a.click();
      } catch (e) { toast('مش قادر أحفظ هنا'); }
    }
    $('backup-pw').value = '';
  }

  function restoreBackup(file) {
    const rd = new FileReader();
    rd.onload = async () => {
      try {
        let text = rd.result;
        if (file.name.endsWith('.enc') || text.trim().startsWith('{"enc"')) {
          const pw = prompt('النسخة دي مشفرة. اكتب كلمة السر:');
          if (!pw) return;
          try {
            text = await decryptState(text, pw);
          } catch (e) { toast('كلمة السر غلط أو النسخة بايظة'); return; }
        }
        const st = JSON.parse(text);
        if (!st || st.v !== 1 || !st.habit || typeof st.startTs !== 'number') { toast('الملف ده مش نسخة انتكاسة'); return; }
        if (!confirm('هيتم استبدال بياناتك الحالية بالنسخة دي. متأكد؟')) return;
        state = st;
        save();
        location.reload();
      } catch (e) { toast('مش قادر أقرا الملف'); }
    };
    rd.readAsText(file);
  }

  /* ---------- boot ---------- */
  /* الصور اللي فوق العداد: بتتبدل بالترتيب مع كل فتحة للتطبيق — ضيف صور جديدة للقايمة هنا */
  const TOP_PHOTOS = ['img/meme-top.jpg', 'img/top-1.jpg', 'img/top-2.jpg', 'img/top-3.jpg'];
  function boot() {
    $('app').classList.remove('hidden');
    applyStealth();
    const ti = (state.topPhotoIdx || 0) % TOP_PHOTOS.length;
    $('home-meme').src = TOP_PHOTOS[ti];
    state.topPhotoIdx = (ti + 1) % TOP_PHOTOS.length;
    save();
    renderHero();
    renderDaily();
    renderEventCard();
    renderChallenge();
    renderWChallenge();
    buildCounter();
    tickCounter(true);
    renderHeatmap();
    showPage('home');
    checkMedals(true);
    checkChallenge();
    checkWChallenge();
    checkPerfect();
    checkDevThanks();
    if (state.pin) openLock('unlock');
    setTimeout(goStudyShow, GO_STUDY_DELAY);
  }

  /* ---------- GO STUDY: تذكيرة لو التطبيق فضل مفتوح ٥ دقايق ---------- */
  // بتظهر مرة واحدة في كل جلسة (كل فتحة للتطبيق)
  const GO_STUDY_DELAY = 5 * 60 * 1000;
  let goStudyShownSession = false;
  function goStudyShow() {
    if (goStudyShownSession) return;
    goStudyShownSession = true;
    $('go-study').classList.remove('hidden');
  }

  /* وسام جديد: اهتزازة تشجيعية + تهنئة */
  function checkMedals(silent) {
    const now = Date.now();
    const earned = MEDALS.filter((m) => milestoneReached(m.d, now));
    if (earned.length >= 3 && !state.batman3) {
      state.batman3 = true;
      save();
      setTimeout(() => $('medal3-modal').classList.remove('hidden'), silent ? 400 : 1400);
    }
    if (state.seenMedals == null) { state.seenMedals = earned.length; save(); return; }
    if (earned.length > state.seenMedals) {
      const fresh = earned[earned.length - 1];
      state.seenMedals = earned.length;
      save();
      if (!silent) {
        if (navigator.vibrate) { navigator.vibrate([120, 80, 240]); }
        toast('🎖️ وسام جديد: ' + fresh.name + '! ' + fresh.desc, 5000);
      }
    }
  }

  function bind() {
    document.querySelectorAll('.nav-btn').forEach((b) => { b.onclick = () => showPage(b.dataset.page); });
    $('btn-relapse').onclick = openRelapse;
    $('btn-hardday').onclick = () => {
      const today = dayKey(Date.now());
      if ((state.hardDays || []).some((h) => dayKey(h.ts) === today)) { toast('اليوم ده متسجل قبل كده 💙'); return; }
      state.hardDays.push({ ts: Date.now() });
      save();
      if (navigator.vibrate) navigator.vibrate(50);
      toast('سجلناها 💙 الأيام الصعبة بتعدي، وسلسلتك مكملة');
    };
    $('event-save').onclick = () => {
      const nm = $('event-name').value.trim();
      const dv = new Date($('event-date').value + 'T00:00:00').getTime();
      if (!nm || isNaN(dv)) { toast('اكتب اسم المناسبة وتاريخها'); return; }
      state.event = { name: nm, ts: dv };
      save(); renderEventCard();
      toast('العداد التنازلي اتفعل ⏳');
    };
    $('event-clear').onclick = () => {
      state.event = null;
      save(); renderEventSettings(); renderEventCard();
      toast('اتمسحت المناسبة');
    };
    $('go-study-close').onclick = () => $('go-study').classList.add('hidden');
    $('dm-close').onclick = () => $('day-modal').classList.add('hidden');
    $('dc-prev').onclick = () => { const d = new Date(dcCursor); dcCursor = new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime(); renderDiscCalendar(); };
    $('dc-next').onclick = () => { const d = new Date(dcCursor); dcCursor = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(); renderDiscCalendar(); };
    $('month-share').onclick = shareMonthImage;
    $('stats-share').onclick = shareStatsImage;
    // سحب يمين/شمال على العداد للتنقل بين الشكال المختارة
    let repTouchX = null;
    const repc = $('report-card');
    repc.addEventListener('touchstart', (e) => { repTouchX = e.touches[0].clientX; }, { passive: true });
    repc.addEventListener('touchend', (e) => {
      if (repTouchX == null) return;
      const dx = e.changedTouches[0].clientX - repTouchX;
      repTouchX = null;
      if (Math.abs(dx) < 60) return;
      stepReport(dx < 0 ? 1 : -1);
    }, { passive: true });
    let cntTouchX = null;
    const cnt = $('counter');
    cnt.addEventListener('touchstart', (e) => { cntTouchX = e.touches[0].clientX; }, { passive: true });
    cnt.addEventListener('touchend', (e) => {
      if (cntTouchX == null) return;
      const dx = e.changedTouches[0].clientX - cntTouchX;
      cntTouchX = null;
      if (Math.abs(dx) < 60) return;
      stepStyle(dx < 0 ? 1 : -1);
    }, { passive: true });
    $('btn-restore').onclick = () => $('restore-file').click();
    $('restore-file').onchange = (e) => {
      const f = e.target.files[0];
      if (f) restoreBackup(f);
      e.target.value = '';
    };
    $('lock-bio').onclick = () => { if (window.AndroidBridge && AndroidBridge.promptBiometric) AndroidBridge.promptBiometric(); };
    $('relapse-cancel').onclick = () => $('relapse-modal').classList.add('hidden');
    $('relapse-confirm').onclick = confirmRelapse;
    $('medal3-close').onclick = () => $('medal3-modal').classList.add('hidden');
    $('chalwin-close').onclick = () => { $('challenge-win').classList.add('hidden'); checkDevThanks(); };
    $('perfect-close').onclick = () => { $('perfect-win').classList.add('hidden'); checkDevThanks(); };
    const pimg = $('perfect-sticker-img');
    pimg.onload = () => { pimg.classList.remove('hidden'); $('perfect-sticker-emoji').classList.add('hidden'); };
    pimg.onerror = () => { pimg.classList.add('hidden'); $('perfect-sticker-emoji').classList.remove('hidden'); };
    if (pimg.complete) { if (pimg.naturalWidth > 0) pimg.onload(); else pimg.onerror(); }
    $('dev-thanks-close').onclick = () => $('dev-thanks').classList.add('hidden');
    $('dev-link-btn').onclick = () => {
      if (window.AndroidBridge && AndroidBridge.openUrl) AndroidBridge.openUrl(DEV_LINK);
      else window.open(DEV_LINK, '_blank');
    };
    $('rc-back').onclick = () => $('relapse-confirm-modal').classList.add('hidden');
    $('rc-yes').onclick = doRelapse;
    $('ar-close').onclick = () => {
      $('after-relapse').classList.add('hidden');
      toast('متزعلش. السلسلة الجديدة بدأت من دلوقتي 💪', 3500);
    };
    $('btn-urge').onclick = openUrge;
    $('urge-done').onclick = showUrgeStrength;
    $('urge-relapse').onclick = () => { logUrge(3, false); closeUrge(false); openRelapse(); };
    document.querySelectorAll('#urge-strength .chip').forEach((c) => {
      c.onclick = () => { logUrge(+c.dataset.s, true); closeUrge(false); toast('برافو عليك! الرغبة عدّت وإنت اللي كسبت 🏆'); };
    });
    $('cal-prev').onclick = () => { calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() - 1, 1); renderCalendar(); };
    $('cal-next').onclick = () => { calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + 1, 1); renderCalendar(); };
    $('set-save').onclick = () => {
      const nm = $('set-habit').value.trim();
      if (nm) state.habit.name = nm;
      state.profileName = $('set-name').value.trim();
      state.title = $('set-title').value.trim();
      const tsv = new Date($('set-start').value).getTime();
      if (!isNaN(tsv) && tsv <= Date.now()) state.startTs = tsv;
      save();
      renderHero();
      tickCounter(true);
      toast('اتحفظ ✓');
    };
    $('phrase-add-btn').onclick = () => {
      const v = $('phrase-input').value.trim();
      if (!v) return;
      state.phrases.push(v);
      $('phrase-input').value = '';
      save(); renderPhrases(); renderDaily();
      toast('اتضافت العبارة ✓');
    };
    $('gear').onclick = () => showPage('settings');
    $('btn-backup').onclick = backup;
    $('btn-wipe').onclick = () => {
      if (!confirm('متأكد إنك عايز تمسح كل حاجة؟ مفيش رجعة.')) return;
      if (!confirm('تأكيد أخير: كل السلاسل والانتكاسات والإعدادات هتتمسح.')) return;
      localStorage.removeItem(KEY);
      location.reload();
    };
    setInterval(() => { if (page === 'home') tickCounter(false); }, 250);
    setInterval(() => { if (!state) return; checkMedals(false); checkChallenge(); checkWChallenge(); checkPerfect(); checkDevThanks(); }, 30000);
  }

  /* نتيجة البصمة من النظام */
  window.__bioResult = (ok) => {
    if (ok) { $('lock').classList.add('hidden'); }
    else { $('lock-msg').textContent = 'البصمة مااشتغلتش — استخدم الأرقام'; }
  };
  window.__bioCancel = () => {};

  /* ---------- رسالة شكر للمطور عند 60 يوم (مرة واحدة) ---------- */
  const DEV_LINK = 'https://instagram.com/ahmed_roza_';
  function checkDevThanks() {
    if (!state || state.devThanks) return;
    if (!$('challenge-win').classList.contains('hidden')) return; // بعد ما يقفل التحدي
    if (!$('perfect-win').classList.contains('hidden')) return; // وبعد ما يقفل ملصق الأسبوع المثالي
    if (currentStreak(Date.now()) < 60 * DAY) return;
    state.devThanks = true;
    save();
    $('dev-thanks').classList.remove('hidden');
  }

  /* ---------- تحدي الـ 30 يوم (اقتراح 7) ---------- */
  function challengeState(now) {
    const ch = state.challenge;
    if (!ch) return { mode: 'idle' };
    if (ch.done) return { mode: 'done', at: ch.done };
    if (state.startTs > ch.start) {
      // حصلت انتكاسة بعد بداية التحدي
      const rel = relapseList().filter((r) => r.ts > ch.start)[0];
      const daysAt = rel ? Math.max(1, Math.floor((rel.ts - ch.start) / DAY) + 1) : 1;
      return { mode: 'failed', daysAt };
    }
    const d = Math.floor((now - ch.start) / DAY) + 1;
    return { mode: 'active', day: Math.min(30, d), frac: Math.min(1, (now - ch.start) / (30 * DAY)) };
  }

  function renderChallenge() {
    const box = $('challenge-body');
    if (!box) return;
    const now = Date.now();
    const cs = challengeState(now);
    box.innerHTML = '';
    if (cs.mode === 'idle') {
      box.appendChild(el('div', 'sub', '30 يوم متواصلين من غير ولا انتكاسة.. وفي الآخر <b>مكافأة خاصة</b>: وسام التحدي الذهبي 🏆'));
      const b = el('button', 'btn primary', 'ابدأ التحدي 🔥');
      b.style.marginTop = '10px';
      b.onclick = () => {
        state.challenge = { start: Date.now(), done: 0 };
        save(); renderChallenge();
        toast('التحدي بدأ! 30 يوم عدّاد شغال 🔥');
      };
      box.appendChild(b);
      return;
    }
    if (cs.mode === 'active') {
      const row = el('div', 'chal-row');
      const R = 26, C = 2 * Math.PI * R;
      row.innerHTML =
        '<svg class="chal-ring" viewBox="0 0 64 64">' +
        '<circle cx="32" cy="32" r="' + R + '" fill="none" stroke="var(--track)" stroke-width="7"/>' +
        '<circle cx="32" cy="32" r="' + R + '" fill="none" stroke="var(--acc)" stroke-width="7" stroke-linecap="round"' +
        ' stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - cs.frac)) + '" transform="rotate(-90 32 32)" class="chal-arc"/></svg>' +
        '<div class="chal-txt"><b>اليوم ' + cs.day + ' من 30</b><span>' + (30 - cs.day > 0 ? 'فاضل ' + (30 - cs.day) + ' ' + U.day(30 - cs.day) + ' على المكافأة' : 'آخر يووووم!') + '</span></div>';
      box.appendChild(row);
      box.appendChild(el('div', 'hint', 'لو حصلت انتكاسة التحدي بيقف وبتبدأ من الأول. إنت قدّها 💪'));
      return;
    }
    if (cs.mode === 'failed') {
      box.appendChild(el('div', 'sub', 'التحدي وقف عند <b>اليوم ' + cs.daysAt + '</b> 😔 بس كل الأبطال بينزلوا ويقوموا أقوى.'));
      const b = el('button', 'btn primary', 'تحدي جديد من الأول 🔥');
      b.style.marginTop = '10px';
      b.onclick = () => {
        state.challenge = { start: Date.now(), done: 0 };
        save(); renderChallenge();
        toast('تحدي جديد بدأ! المرة دي للآخر 🔥');
      };
      box.appendChild(b);
      return;
    }
    // done
    const d = new Date(cs.at);
    box.appendChild(el('div', 'sub', '🏆 <b>كسبت التحدي</b> يوم ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '! وسام التحدي الذهبي في صفحة الأوسمة.'));
    const b = el('button', 'btn ghost', 'تحدي جديد 🔥');
    b.style.marginTop = '10px';
    b.onclick = () => {
      state.challenge = { start: Date.now(), done: 0 };
      save(); renderChallenge();
      toast('تحدي جديد بدأ! 🔥');
    };
    box.appendChild(b);
  }

  /* ⚡ تحدي الأسبوع: ٧ أيام من غير ولا انتكاسة = +100 نقطة، وبيترينج تلقائي */
  function wchallengeState(now) {
    const w = state.wchallenge;
    if (!w) return { mode: 'idle' };
    if (state.startTs > w.start) {
      const rel = relapseList().filter((r) => r.ts > w.start)[0];
      const daysAt = rel ? Math.max(1, Math.floor((rel.ts - w.start) / DAY) + 1) : 1;
      return { mode: 'failed', daysAt };
    }
    const d = Math.floor((now - w.start) / DAY) + 1;
    return { mode: 'active', day: Math.min(7, d), frac: Math.min(1, (now - w.start) / (7 * DAY)) };
  }

  function renderWChallenge() {
    const box = $('wchallenge-body');
    if (!box) return;
    const now = Date.now();
    const cs = wchallengeState(now);
    box.innerHTML = '';
    if (cs.mode === 'idle') {
      box.appendChild(el('div', 'sub', '٧ أيام متواصلين من غير ولا انتكاسة = <b>+100 نقطة</b> 🎁 والتحدي بيكمّل لوحده أسبوع جديد.'));
      const b = el('button', 'btn primary', 'ابدأ تحدي الأسبوع ⚡');
      b.style.marginTop = '10px';
      b.onclick = () => {
        state.wchallenge = { start: Date.now() };
        save(); renderWChallenge();
        toast('تحدي الأسبوع بدأ! ⚡');
      };
      box.appendChild(b);
    } else if (cs.mode === 'active') {
      const row = el('div', 'chal-row');
      const R = 26, C = 2 * Math.PI * R;
      row.innerHTML =
        '<svg class="chal-ring" viewBox="0 0 64 64">' +
        '<circle cx="32" cy="32" r="' + R + '" fill="none" stroke="var(--track)" stroke-width="7"/>' +
        '<circle cx="32" cy="32" r="' + R + '" fill="none" stroke="var(--acc)" stroke-width="7" stroke-linecap="round"' +
        ' stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - cs.frac)) + '" transform="rotate(-90 32 32)" class="chal-arc"/></svg>' +
        '<div class="chal-txt"><b>اليوم ' + cs.day + ' من 7</b><span>' + (7 - cs.day > 0 ? 'فاضل ' + (7 - cs.day) + ' ' + U.day(7 - cs.day) + ' على الـ +100 نقطة' : 'آخر يووووم!') + '</span></div>';
      box.appendChild(row);
      box.appendChild(el('div', 'hint', 'لو حصلت انتكاسة التحدي بيقف وبتبدأ من الأول.'));
    } else {
      box.appendChild(el('div', 'sub', 'التحدي وقف عند <b>اليوم ' + cs.daysAt + '</b> 😔 يلا من الأول، إنت قدّها 💪'));
      const b = el('button', 'btn primary', 'تحدي جديد من الأول ⚡');
      b.style.marginTop = '10px';
      b.onclick = () => {
        state.wchallenge = { start: Date.now() };
        save(); renderWChallenge();
        toast('تحدي أسبوع جديد بدأ! ⚡');
      };
      box.appendChild(b);
    }
    if ((state.wchWins || 0) > 0) {
      const wins = el('div', 'hint', '🏅 كسبت تحدي الأسبوع ' + state.wchWins + ' ' + (state.wchWins === 1 ? 'مرة' : 'مرات') + ' (+' + state.wchWins * 100 + ' نقطة)');
      wins.style.marginTop = '8px';
      box.appendChild(wins);
    }
  }

  /* ---------- ملصق الأسبوع المثالي: ٧ أيام نضاف ورا بعض من غير ولا يوم صعب ---------- */
  function perfectRunStart(now) {
    let s = state.trackingSince || now;
    for (const r of state.relapses) if (r.ts > s) s = r.ts;
    for (const h of (state.hardDays || [])) if (h.ts > s) s = h.ts;
    return s;
  }
  function checkPerfect() {
    if (!state) return;
    const now = Date.now();
    const rs = perfectRunStart(now);
    if (state.pwRunStart !== rs) { state.pwRunStart = rs; if (state.pwRunAwards >= 0) state.pwRunAwards = 0; }
    const blocks = Math.floor((now - rs) / (7 * DAY));
    if (state.pwRunAwards < 0) { // أول تشغيل بعد التحديث: احسب الموجود بهدوء
      state.pwRunAwards = blocks;
      state.pwCount = (state.pwCount || 0) + blocks;
      save();
      return;
    }
    if (blocks > state.pwRunAwards) {
      state.pwCount = (state.pwCount || 0) + (blocks - state.pwRunAwards);
      state.pwRunAwards = blocks;
      save();
      if (navigator.vibrate) navigator.vibrate([120, 60, 120, 60, 300]);
      $('perfect-win').classList.remove('hidden');
      if (page === 'profile') renderProfile();
    }
  }

  function checkWChallenge() {
    if (!state) return;
    const w = state.wchallenge;
    if (!w || state.startTs > w.start) return;
    if (Date.now() - w.start >= 7 * DAY) {
      state.wchWins = (state.wchWins || 0) + 1;
      state.wchallenge = { start: Date.now() };
      save();
      if (navigator.vibrate) navigator.vibrate([120, 60, 120, 60, 300]);
      toast('⚡ كسبت تحدي الأسبوع! +100 نقطة 🎁');
      if (page === 'home') renderWChallenge();
      if (page === 'profile') renderProfile();
    }
  }

  function checkChallenge() {
    if (!state) return;
    const ch = state.challenge;
    if (!ch || ch.done || state.startTs > ch.start) return;
    if (Date.now() - ch.start >= 30 * DAY) {
      ch.done = Date.now();
      save();
      if (navigator.vibrate) navigator.vibrate([150, 80, 150, 80, 400]);
      $('challenge-win').classList.remove('hidden');
      if (page === 'home') renderChallenge();
      if (page === 'ach') renderAch();
    }
  }

  /* ---------- مهام: فان التقويم ---------- */
  // كل عمود = أسبوع (الاتنين تحت .. الحد فوق)، الأعمدة مفرودة كفان من محور فوق الشاشة
  const FAN_ASTEP = 3.4;      // درجة لكل أسبوع
  const FAN_RMON = 780;       // نصف قطر صف الاتنين من المحور
  const FAN_DS = 40;          // المسافة بين الأيام على العمود
  const FAN_COLW = 38;
  const MON_EPOCH = new Date(2024, 0, 1).getTime(); // يوم اتنين
  const fanMHue = (m) => Math.round((200 + m * 137.5) % 360); // لون مميز لكل شهر (زاوية ذهبية)
  const WDAYS_MON = ['اتنين', 'تلت', 'أربع', 'خميس', 'جمعة', 'سبت', 'حد'];
  let fanPan = 0;             // بالأسابيع
  let fanBuiltYear = 0;
  let fanCols = [];
  let fanPills = [];
  let fanColH = 0;
  let zoomRef = null;

  const wkIdx = (ts) => Math.round((ts - MON_EPOCH) / 6048e5);
  const dayStart = (ts) => { const d = new Date(ts); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };

  function taskList(ts) { return state.tasks[dayKey(ts)] || []; }

  function renderTasksFan() {
    const y = new Date().getFullYear();
    if (fanBuiltYear !== y) buildFan(y);
    layoutFan(false);
  }

  function buildFan(y) {
    const world = $('fan-world');
    world.innerHTML = '';
    fanCols = []; fanPills = [];
    world.appendChild(el('div', 'fan-year', String(y)));
    const today = dayStart(Date.now());
    const w0 = wkIdx(new Date(y, 0, 1).getTime()) - 1;
    const w1 = wkIdx(new Date(y, 11, 31).getTime()) + 1;
    for (let w = w0; w <= w1; w++) {
      const col = el('div', 'fan-col');
      for (let i = 0; i <= 6; i++) { // الاتنين تحت .. الحد فوق
        const ts = MON_EPOCH + (w * 7 + i) * 864e5;
        const dt = new Date(ts);
        const b = el('button', 'fan-day');
        b.dataset.ts = ts;
        const mh = fanMHue(dt.getMonth());
        b.style.setProperty('--mtint', 'hsla(' + mh + ',85%,70%,.22)');
        b.innerHTML = '<span>' + dt.getDate() + '</span>';
        if (dt.getDate() === 1) {
          b.classList.add('first');
          b.style.color = 'hsl(' + mh + ',90%,78%)';
          if (i > 0) b.classList.add('mnew'); else col.classList.add('mstart'); // خط فاصل بين الشهور
        }
        if (ts === today) b.classList.add('today');
        const tl = taskList(ts);
        if (tl.length) {
          b.classList.add('has');
          const undone = tl.some((t) => !t.done);
          b.appendChild(el('i', 'mk ' + (undone ? 'mk-heart' : 'mk-check'), undone ? '\u2764' : '\u2713'));
        }
        b.onclick = () => { if (!fanDragged) openDayZoom(ts); };
        col.appendChild(b);
      }
      world.appendChild(col);
      fanCols.push({ el: col, w });
    }
    for (let m = 0; m < 12; m++) {
      const pill = el('div', 'fan-pill', MONTHS[m]);
      const h = fanMHue(m);
      pill.style.background = 'hsl(' + h + ',85%,64%)';
      pill.style.color = '#0a0a12';
      pill.style.boxShadow = '0 0 14px hsla(' + h + ',85%,64%,.5)';
      world.appendChild(pill);
      fanPills.push({ el: pill, w: wkIdx(new Date(y, m, 1).getTime()) });
    }
    fanBuiltYear = y;
    fanColH = fanCols.length ? fanCols[0].el.offsetHeight : 7 * FAN_DS + 16;
    fanPan = wkIdx(today);
  }

  function layoutFan(animate) {
    const world = $('fan-world');
    world.classList.toggle('anim', !!animate);
    fanCols.forEach(({ el: col, w }) => {
      const a = (w - fanPan) * FAN_ASTEP;
      const rad = a * Math.PI / 180;
      const mx = FAN_RMON * Math.sin(rad);
      const my = FAN_RMON * Math.cos(rad);
      col.style.transformOrigin = '50% ' + (fanColH - FAN_DS / 2) + 'px';
      col.style.transform = 'translate(' + (mx - FAN_COLW / 2) + 'px,' + (my - (fanColH - FAN_DS / 2)) + 'px) rotate(' + (-a) + 'deg)';
      const c = Math.abs(a);
      col.style.opacity = c > 27 ? 0 : c > 18 ? 0.25 : 1;
      col.style.pointerEvents = c > 27 ? 'none' : 'auto';
    });
    fanPills.forEach(({ el: pill, w }) => {
      const a = (w - fanPan) * FAN_ASTEP;
      const rad = a * Math.PI / 180;
      const r = FAN_RMON + 92;
      const px = r * Math.sin(rad), py = r * Math.cos(rad);
      pill.style.transform = 'translate(' + px + 'px,' + py + 'px) translate(-50%,-50%) rotate(' + (-a) + 'deg)';
      const c = Math.abs(a);
      pill.style.opacity = c > 27 ? 0 : c > 18 ? 0.25 : 1;
    });
  }

  let fanDragged = false;
  function bindFan() {
    const wrap = $('fan-wrap');
    let sx = 0, pan0 = 0, dragging = false;
    wrap.addEventListener('pointerdown', (e) => {
      if (zoomRef) return;
      dragging = true; fanDragged = false;
      sx = e.clientX; pan0 = fanPan;
      wrap.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 7) fanDragged = true;
      const w0 = wkIdx(new Date(new Date().getFullYear(), 0, 1).getTime()) - 2;
      const w1 = wkIdx(new Date(new Date().getFullYear(), 11, 31).getTime()) + 2;
      fanPan = Math.max(w0, Math.min(w1, pan0 - dx * 0.02));
      layoutFan(false);
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      fanPan = Math.round(fanPan);
      layoutFan(true);
      setTimeout(() => { fanDragged = false; }, 60);
    };
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    $('dz-close').onclick = closeDayZoom;
    $('dz-add').onclick = addZoomTask;
    $('dz-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') addZoomTask(); });
    // سحب رأسي في عرض اليوم للتنقل بين الأيام
    const dz = $('day-zoom');
    let sy = 0, sdy = 0, swiping = false;
    dz.addEventListener('pointerdown', (e) => {
      if (e.target.closest('input,button')) return;
      swiping = true; sy = e.clientY; sdy = 0;
    });
    dz.addEventListener('pointermove', (e) => { if (swiping) sdy = e.clientY - sy; });
    dz.addEventListener('pointerup', () => {
      if (!swiping) return;
      swiping = false;
      if (Math.abs(sdy) > 60) stepDay(sdy < 0 ? 1 : -1);
    });
  }

  function stepDay(dir) {
    if (!zoomRef) return;
    openDayZoom(zoomRef.ts + dir * 864e5, true);
  }

  function openDayZoom(ts, swap) {
    ts = dayStart(ts);
    zoomRef = { ts };
    const wrap = $('fan-wrap');
    const world = $('fan-world');
    world.style.transition = 'none';
    world.style.transform = '';
    void world.offsetWidth;
    const wr = wrap.getBoundingClientRect();
    const b = world.querySelector('.fan-day[data-ts="' + ts + '"]');
    if (!b) return;
    const br = b.getBoundingClientRect();
    const wor = world.getBoundingClientRect();
    const wsl = wor.left - wr.left, wst = wor.top - wr.top;
    const px = br.left + br.width / 2 - wor.left, py = br.top + br.height / 2 - wor.top;
    const S = 3.2;
    const tx = wr.width / 2 - wsl - px * S, ty = wr.height * 0.40 - wst - py * S;
    world.style.transition = '';
    world.style.transformOrigin = '0 0';
    world.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + S + ')';
    wrap.classList.add('zoomed');
    const dt = new Date(ts);
    const num = $('dz-num');
    num.textContent = dt.getDate();
    num.classList.remove('dz-swap');
    void num.offsetWidth;
    num.classList.add('dz-swap');
    $('dz-month').textContent = WDAYS_MON[(dt.getDay() + 6) % 7] + '، ' + MONTHS[dt.getMonth()] + ' ' + dt.getFullYear();
    const circle = $('dz-circle');
    const tl = taskList(ts);
    circle.classList.toggle('has-undone', tl.some((t) => !t.done));
    circle.classList.toggle('is-first', dt.getDate() === 1);
    circle.classList.toggle('is-today', ts === dayStart(Date.now()));
    renderZoomChips();
    $('dz-input').value = '';
    $('day-zoom').classList.remove('hidden');
  }

  function closeDayZoom() {
    zoomRef = null;
    $('day-zoom').classList.add('hidden');
    const world = $('fan-world');
    world.style.transform = '';
    $('fan-wrap').classList.remove('zoomed');
  }

  const DZ_SLOTS = [
    { dx: -112, dy: -88 }, { dx: 112, dy: -82 }, { dx: 138, dy: 2 },
    { dx: -138, dy: 8 }, { dx: -84, dy: 92 }, { dx: 84, dy: 96 }
  ];

  function renderZoomChips() {
    const box = $('dz-chips');
    box.innerHTML = '';
    const { ts } = zoomRef;
    const tl = taskList(ts);
    if (!tl.length) {
      box.innerHTML = '<div class="empty" style="position:absolute;left:50%;top:56%;transform:translateX(-50%);width:max-content">مفيش مهام لليوم ده — ضيف أول واحدة تحت 👇</div>';
      return;
    }
    tl.forEach((t, i) => {
      const slot = DZ_SLOTS[i % DZ_SLOTS.length];
      const chip = el('button', 'dz-chip' + (t.done ? ' done' : ''));
      chip.style.left = 'calc(50% + ' + slot.dx + 'px)';
      chip.style.top = 'calc(40% + ' + slot.dy + 'px)';
      chip.innerHTML = '<i>' + (t.done ? '✓' : '❤') + '</i><span>' + esc(t.t) + '</span>';
      let lp = null, lpFired = false;
      chip.addEventListener('pointerdown', () => {
        lpFired = false;
        lp = setTimeout(() => {
          lpFired = true;
          tl.splice(i, 1);
          if (!tl.length) delete state.tasks[dayKey(ts)];
          save(); renderZoomChips(); refreshFanDay(ts);
          if (zoomRef) openDayZoom(ts);
          toast('اتمسحت 🗑️');
        }, 600);
      });
      chip.addEventListener('pointerup', () => {
        clearTimeout(lp);
        if (lpFired) return;
        t.done = !t.done;
        save(); renderZoomChips(); refreshFanDay(ts);
        $('dz-circle').classList.toggle('has-undone', tl.some((x) => !x.done));
        if (t.done && navigator.vibrate) navigator.vibrate(40);
      });
      chip.addEventListener('pointerleave', () => clearTimeout(lp));
      chip.addEventListener('pointercancel', () => clearTimeout(lp));
      box.appendChild(chip);
    });
  }

  function addZoomTask() {
    const v = $('dz-input').value.trim();
    if (!v || !zoomRef) return;
    const { ts } = zoomRef;
    state.tasks[dayKey(ts)] = state.tasks[dayKey(ts)] || [];
    state.tasks[dayKey(ts)].push({ t: v, done: false });
    save();
    $('dz-input').value = '';
    renderZoomChips();
    refreshFanDay(ts);
    $('dz-circle').classList.add('has-undone');
    toast('اتضافت ✅');
  }

  function refreshFanDay(ts) {
    const b = $('fan-world').querySelector('.fan-day[data-ts="' + ts + '"]');
    if (!b) return;
    b.querySelector('.mk')?.remove();
    const tl = taskList(ts);
    b.classList.toggle('has', tl.length > 0);
    if (tl.length) {
      const undone = tl.some((t) => !t.done);
      b.appendChild(el('i', 'mk ' + (undone ? 'mk-heart' : 'mk-check'), undone ? '❤' : '✓'));
    }
  }

  /* ---------- splash ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const sp = $('splash');
      sp.classList.add('out');
      setTimeout(() => sp.remove(), 600);
    }, 900);
  });

  /* ---------- start ---------- */
  bind();
  bindNotes();
  bindAvatar();
  bindFan();
  if (load()) {
    applyAccent();
    applyTheme();
    boot();
  } else {
    startOnboarding();
  }
})();
