/* =====================================================================
   Guest link generator (used by links.html).
   Turns a list of Persian names into personal invitation links.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.INVITATION || {};
  var $ = function (id) { return document.getElementById(id); };
  var results = [];

  // Default site address: config.siteUrl, or the folder this page is in.
  function defaultBase() {
    if (C.siteUrl) return C.siteUrl;
    if (location.protocol === "file:") return "https://username.github.io/invitation/";
    return new URL("./", location.href).href;
  }

  // Clean a name the same way the invitation page does.
  function cleanName(name) {
    return name
      .replace(/ي/g, "ی").replace(/ك/g, "ک")
      .replace(/[‎‏‪-‮⁦-⁩﻿]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // "محمد احمدی" → "https://.../?name=%D9%85...-%D8%A7..."
  function makeLink(base, name, readable) {
    var slug = C.dashAsSpace === false ? name : name.replace(/ /g, "-");
    var url = new URL(base, location.href);
    url.search = "";
    url.hash = "";
    var value = encodeURIComponent(slug);
    if (readable) value = slug.replace(/[%&#?+=\s]/g, encodeURIComponent);  // keep Persian letters visible
    return url.href + "?name=" + value;
  }

  function makeMessage(name, link) {
    return String(C.shareMessage || "{link}").replace(/\{name\}/g, name).replace(/\{link\}/g, link);
  }

  function toast(text) {
    var t = $("toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.classList.remove("show"); }, 1600);
  }

  function copy(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
      toast("کپی شد ✓");
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast("کپی شد ✓"); }, fallback);
    } else {
      fallback();
    }
  }

  function button(label, cls, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function generate() {
    var base = $("base").value.trim() || defaultBase();
    var readable = $("readable").checked;
    var seen = {};
    results = [];

    $("names").value.split(/\r?\n/).forEach(function (line) {
      var name = cleanName(line);
      if (!name || seen[name]) return;
      seen[name] = true;
      var link = makeLink(base, name, readable);
      results.push({ name: name, link: link, message: makeMessage(name, link) });
    });

    var list = $("list");
    list.textContent = "";
    results.forEach(function (r) {
      var li = document.createElement("li");
      li.className = "item";

      var n = document.createElement("div");
      n.className = "item__name";
      n.textContent = r.name;

      var l = document.createElement("div");
      l.className = "item__link";
      l.textContent = r.link;

      var row = document.createElement("div");
      row.className = "row";
      row.appendChild(button("کپی لینک", "small", function () { copy(r.link); }));
      row.appendChild(button("کپی پیام دعوت", "small ghost", function () { copy(r.message); }));
      var open = document.createElement("a");
      open.className = "btn small ghost";
      open.href = r.link;
      open.target = "_blank";
      open.rel = "noopener";
      open.textContent = "پیش‌نمایش";
      row.appendChild(open);

      li.append(n, l, row);
      list.appendChild(li);
    });

    var has = results.length > 0;
    $("resultPanel").hidden = !has;
    $("copyAll").hidden = !has;
    $("csv").hidden = !has;
    $("count").textContent = has ? results.length.toLocaleString("fa-IR") + " لینک ساخته شد." : "";
    if (!has) toast("ابتدا نام مهمانان را وارد کنید");
  }

  function downloadCsv() {
    var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    var rows = [["نام", "لینک", "پیام"]].concat(results.map(function (r) { return [r.name, r.link, r.message]; }));
    var csv = "﻿" + rows.map(function (r) { return r.map(q).join(","); }).join("\r\n"); // BOM → Excel shows Persian correctly
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "guest-links.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  $("base").value = defaultBase();
  $("generate").addEventListener("click", generate);
  $("copyAll").addEventListener("click", function () {
    copy(results.map(function (r) { return r.name + "\n" + r.link; }).join("\n\n"));
  });
  $("csv").addEventListener("click", downloadCsv);

  window.makeGuestLink = makeLink; // handy for testing in the console
})();
