/* =====================================================================
   Invitation logic — you normally do NOT need to edit this file.
   All texts live in config.js.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.INVITATION || {};

  /* ---------- Helpers ---------- */

  // Convert English digits to Persian digits: "19" → "۱۹"
  function toFaDigits(value) {
    return String(value).replace(/\d/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; });
  }

  // Safely decode a string that may still contain %XX sequences
  // (e.g. links that were encoded twice by a messenger app).
  function safeDecode(str) {
    for (var i = 0; i < 2 && /%[0-9a-f]{2}/i.test(str); i++) {
      try { str = decodeURIComponent(str); } catch (e) { break; }
    }
    return str;
  }

  /**
   * Read the guest name from the URL (?name=...) and clean it up.
   * Handles: percent-encoding, "+" as space, "-"/"_" as space,
   * Arabic ي/ك → Persian ی/ک, invisible/bidi control characters,
   * extra spaces and overly long values. Returns "" if there's no name.
   */
  function getGuestName(search) {
    var raw;
    try {
      raw = new URLSearchParams(search).get("name");   // decodes %XX and "+"
    } catch (e) {
      raw = null;
    }
    if (!raw) return "";

    var name = safeDecode(raw);
    if (C.dashAsSpace !== false) name = name.replace(/[-_]+/g, " ");

    name = name
      .replace(/ي/g, "ی").replace(/ك/g, "ک")                     // Arabic → Persian letters
      .replace(/[\u0000-\u001F\u007F\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "") // control/bidi chars (ZWNJ kept)
      .replace(/[<>%\uFFFD]/g, "")                               // HTML brackets & broken-encoding leftovers
      .replace(/\s+/g, " ")
      .trim();

    if (!/[A-Za-z\u0600-\u06FF]/.test(name)) return "";            // nothing readable → generic invitation

    var max = C.maxNameLength || 60;
    if (name.length > max) name = name.slice(0, max).trim() + "…";
    return name;
  }

  function fill(text, name) {
    return String(text || "").replace(/\{name\}/g, name);
  }

  /* ---------- Render text from config ---------- */

  function render() {
    // Simple text fields: <el data-field="key"> ← C[key]. Empty → hidden.
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var val = C[el.getAttribute("data-field")];
      if (val) el.textContent = val; else el.hidden = true;
    });
    // Hide detail rows whose value is empty.
    document.querySelectorAll("[data-row]").forEach(function (row) {
      if (!C[row.getAttribute("data-row")]) row.hidden = true;
    });

    // Greeting + guest name
    var name = getGuestName(window.location.search);
    var label = document.getElementById("greetingLabel");
    var nameEl = document.getElementById("guestName");
    if (name) {
      label.textContent = C.greetingLabel || "";
      label.hidden = !C.greetingLabel;
      nameEl.textContent = fill(C.greetingWithName || "{name}", name);   // textContent = safe from HTML injection
      document.title = (C.pageTitle || "دعوت‌نامه") + " | " + name;
      document.body.classList.add("has-name");
    } else {
      label.hidden = true;
      nameEl.textContent = C.greetingGeneric || "مهمان گرامی";
      nameEl.classList.add("greeting__name--generic");
      document.title = C.pageTitle || "دعوت‌نامه";
    }

    // Buttons
    var mapBtn = document.getElementById("mapBtn");
    if (C.mapUrl) { mapBtn.href = C.mapUrl; mapBtn.hidden = false; }

    var callBtn = document.getElementById("callBtn");
    if (C.contactPhone) {
      callBtn.href = "tel:" + String(C.contactPhone).replace(/[^\d+]/g, "");
      callBtn.textContent = (C.contactLabel ? C.contactLabel + ": " : "") + toFaDigits(C.contactPhone);
      callBtn.hidden = false;
    }

    var start = C.eventStart ? new Date(C.eventStart) : null;
    if (start && isNaN(start)) start = null;

    if (start && C.showCalendarButton !== false) {
      var calBtn = document.getElementById("calBtn");
      calBtn.hidden = false;
      calBtn.addEventListener("click", function () { downloadIcs(start); });
    }
    if (start && C.showCountdown !== false) startCountdown(start);

    // Start the entrance animation
    requestAnimationFrame(function () { document.body.classList.add("is-ready"); });
  }

  /* ---------- Countdown ---------- */

  function startCountdown(target) {
    var box = document.getElementById("countdown");
    var units = {};
    box.querySelectorAll("[data-unit]").forEach(function (el) { units[el.getAttribute("data-unit")] = el; });

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) { box.hidden = true; clearInterval(timer); return; }
      var s = Math.floor(diff / 1000);
      units.days.textContent    = toFaDigits(Math.floor(s / 86400));
      units.hours.textContent   = toFaDigits(Math.floor(s % 86400 / 3600));
      units.minutes.textContent = toFaDigits(Math.floor(s % 3600 / 60));
      units.seconds.textContent = toFaDigits(s % 60);
      box.hidden = false;
    }
    var timer = setInterval(tick, 1000);
    tick();
  }

  /* ---------- Add to calendar (.ics file, generated in the browser) ---------- */

  function icsDate(d) {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }
  function icsText(s) {
    return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
  }

  function downloadIcs(start) {
    var end = C.eventEnd ? new Date(C.eventEnd) : null;
    if (!end || isNaN(end)) end = new Date(start.getTime() + 3 * 3600 * 1000);
    var summary = [C.title, C.hosts].filter(Boolean).join(" - ");
    var location = [C.venueName, C.venueAddress].filter(Boolean).join("، ");

    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitation//FA", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + icsDate(start) + "-invitation@github.io",
      "DTSTAMP:" + icsDate(new Date()),
      "DTSTART:" + icsDate(start),
      "DTEND:" + icsDate(end),
      "SUMMARY:" + icsText(summary),
      "LOCATION:" + icsText(location),
      "DESCRIPTION:" + icsText(C.message),
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");

    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "invitation.ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // Expose the name parser so it can be tested from the console.
  window.getGuestName = getGuestName;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
