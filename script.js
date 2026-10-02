// این فایل نیازی به ویرایش ندارد؛ متن‌ها در config.js هستند.
(function () {
  var C = window.INVITATION || {};
  var $ = function (id) { return document.getElementById(id); };
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // خواندن نام مهمان از لینک، مثلاً: ?name=محمد-احمدی
  function getName() {
    var name = new URLSearchParams(location.search).get("name") || "";
    try { name = decodeURIComponent(name); } catch (e) {}  // اگر لینک دوبار کد شده باشد
    return name
      .replace(/[-_]/g, " ")                      // خط تیره = فاصله
      .replace(/ي/g, "ی").replace(/ك/g, "ک")      // ی و ک عربی ← فارسی
      .replace(/[<>%�]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
  }

  // پر کردن متن‌ها از config.js (بخش‌های خالی پنهان می‌شوند)
  document.querySelectorAll("[data-text]").forEach(function (el) {
    var value = C[el.getAttribute("data-text")];
    if (value) el.textContent = value; else el.hidden = true;
  });
  document.querySelectorAll("[data-row]").forEach(function (el) {
    if (!C[el.getAttribute("data-row")]) el.hidden = true;
  });

  // نام مهمان: هر کلمه جدا انیمیت می‌شود (حروف فارسی از هم جدا نمی‌شوند)
  var name = getName();
  var nameEl = $("name");
  (name || C.genericName || "").split(" ").forEach(function (word, i) {
    var span = document.createElement("span");
    span.className = "word";
    span.style.setProperty("--i", i);
    span.textContent = word;
    nameEl.appendChild(span);
    nameEl.appendChild(document.createTextNode(" "));
  });
  $("greeting").textContent = name ? C.greeting : "";
  $("greeting").hidden = !name;
  $("introTo").textContent = name ? "برای " + name : "";
  if (name) document.title = C.title + " | " + name;

  if (C.mapLink) { $("map").href = C.mapLink; $("map").hidden = false; }

  // ترتیب ظاهر شدن بخش‌های کارت
  document.querySelectorAll(".card .a:not([hidden])").forEach(function (el, i) {
    el.style.setProperty("--d", (0.15 + i * 0.12) + "s");
  });

  // ذرات درخشان پس‌زمینه
  var particles = $("particles");
  for (var i = 0; i < 26; i++) {
    var p = document.createElement("span");
    p.className = i % 3 ? "dot" : "star";
    p.style.left = Math.random() * 100 + "%";
    p.style.setProperty("--s", (4 + Math.random() * 8).toFixed(1) + "px");
    p.style.animationDuration = (12 + Math.random() * 14).toFixed(1) + "s";
    p.style.animationDelay = (-Math.random() * 26).toFixed(1) + "s";
    particles.appendChild(p);
  }

  // کاغذ رنگی
  function confetti() {
    var box = $("confetti");
    var colors = ["#e8c27a", "#f6e3b4", "#7fc8b4", "#f2a7a0", "#ffffff"];
    for (var i = 0; i < 80; i++) {
      var c = document.createElement("i");
      var angle = Math.random() * Math.PI * 2;
      var dist = 120 + Math.random() * 260;
      c.style.setProperty("--x", Math.cos(angle) * dist + "px");
      c.style.setProperty("--y", Math.sin(angle) * dist - 120 + "px");
      c.style.setProperty("--r", Math.random() * 720 - 360 + "deg");
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = Math.random() * 0.15 + "s";
      if (i % 4 === 0) c.style.borderRadius = "50%";
      box.appendChild(c);
    }
    setTimeout(function () { box.textContent = ""; }, 3500);
  }

  // باز شدن پاکت ← نمایش کارت
  var opened = false;
  function open() {
    if (opened) return;
    opened = true;
    document.body.classList.add("opening");
    setTimeout(function () {
      document.body.classList.add("open");
      if (!calm) confetti();
    }, calm ? 0 : 1300);
  }
  $("envelope").addEventListener("click", open);
  $("openBtn").addEventListener("click", open);

  // حرکت سه‌بعدی ملایم کارت با موس (فقط کامپیوتر)
  if (!calm && matchMedia("(pointer: fine)").matches) {
    var tilt = $("tilt");
    window.addEventListener("pointermove", function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      tilt.style.setProperty("--ry", (x * 6).toFixed(2) + "deg");
      tilt.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
    });
  }

  document.body.classList.add("ready");
})();
