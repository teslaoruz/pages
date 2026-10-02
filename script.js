// این فایل نیازی به ویرایش ندارد؛ متن‌ها در config.js هستند.
(function () {
  var C = window.INVITATION || {};

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

  // نمایش نام مهمان یا متن عمومی
  var name = getName();
  document.getElementById("name").textContent = name || C.genericName;
  document.getElementById("greeting").textContent = name ? C.greeting : "";
  if (name) document.title = C.title + " | " + name;

  if (C.mapLink) {
    var map = document.getElementById("map");
    map.href = C.mapLink;
    map.hidden = false;
  }

  document.body.classList.add("ready");  // شروع انیمیشن
})();
