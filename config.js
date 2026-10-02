/* =====================================================================
   ✏️  تنظیمات دعوت‌نامه — INVITATION SETTINGS
   =====================================================================
   This is the ONLY file you need to edit to change the invitation.
   تمام متن‌ها و اطلاعات مراسم فقط از همین فایل تغییر می‌کنند.

   Rules:
   • Keep the quotes "..." around every text value.
   • If you don't need a field, set it to "" (empty) — it will be hidden.
   • You can type numbers in Persian (۱۲۳) or English (123) digits.
   • The text {name} is replaced with the guest's name from the link.
   ===================================================================== */

window.INVITATION = {

  /* ---------------------------------------------------------------
     1) Top of the card
     --------------------------------------------------------------- */
  // Small line at the very top (e.g. "به نام خدا"). "" to hide.
  topLine: "به نام خداوند مهر و عشق",

  // Main title of the event.
  title: "جشن عروسی",

  // Names of the hosts / couple / person being celebrated.
  hosts: "سارا و علی",


  /* ---------------------------------------------------------------
     2) Greeting — the guest's name
     ---------------------------------------------------------------
     Used when the link contains a name, e.g. ?name=محمد-احمدی
     {name} is replaced with the guest's name (shown large and bold). */
  greetingWithName: "{name}",
  // Small line shown just above the guest's name.
  greetingLabel: "مهمان عزیز و گرامی",

  // Used when the link has NO name (generic invitation).
  greetingGeneric: "مهمان گرامی",


  /* ---------------------------------------------------------------
     3) Invitation message (main paragraph)
     --------------------------------------------------------------- */
  message:
    "با کمال مسرت و افتخار، از شما دعوت می‌کنیم تا در شب آغاز زندگی مشترکمان " +
    "قدم بر چشم ما بگذارید و با حضور گرمتان، شادی این جشن را دوچندان کنید.",


  /* ---------------------------------------------------------------
     4) Date, time and venue  (text exactly as shown to guests)
     --------------------------------------------------------------- */
  dateText:  "جمعه، ۲۰ آذر ۱۴۰۵",
  timeText:  "ساعت ۱۹:۰۰ الی ۲۳:۰۰",
  venueName: "باغ تالار گلستان",
  venueAddress: "تهران، بزرگراه چمران، خیابان گلستان، پلاک ۱۲",

  // Map link for the "مسیریابی" (directions) button. "" to hide the button.
  // Tip: open the place in Google Maps / Neshan / Balad → Share → copy link.
  mapUrl: "https://www.google.com/maps/search/?api=1&query=35.7219,51.3347",


  /* ---------------------------------------------------------------
     5) Exact event time  (used for the countdown + "add to calendar")
     ---------------------------------------------------------------
     Format: YYYY-MM-DDTHH:MM:SS+03:30   (Gregorian date, Iran time zone)
     Example: 20 Azar 1405 at 19:00 Tehran time → "2026-12-11T19:00:00+03:30"
     Set eventStart to "" to hide both the countdown and calendar button. */
  eventStart: "2026-12-11T19:00:00+03:30",
  eventEnd:   "2026-12-11T23:00:00+03:30",

  showCountdown: true,        // true = show countdown, false = hide it
  showCalendarButton: true,   // true = show "افزودن به تقویم" button


  /* ---------------------------------------------------------------
     6) Closing line, contact & signature
     --------------------------------------------------------------- */
  closing: "حضور سبزتان، زینت‌بخش جشن ماست.",

  // Optional RSVP / contact. Leave phone "" to hide.
  contactLabel: "هماهنگی و تأیید حضور",
  contactPhone: "",            // e.g. "09121234567"

  // Signature at the bottom (e.g. family names). "" to hide.
  signature: "خانواده‌های محمدی و رضایی",


  /* ---------------------------------------------------------------
     7) Browser tab title
     --------------------------------------------------------------- */
  pageTitle: "دعوت‌نامه",     // with a name it becomes: "دعوت‌نامه | محمد احمدی"


  /* ---------------------------------------------------------------
     8) Guest-link generator settings  (used by links.html)
     ---------------------------------------------------------------
     siteUrl: the public address of your invitation. Leave "" to detect it
     automatically (works once the site is on GitHub Pages).
     Example: "https://username.github.io/invitation/"                */
  siteUrl: "",

  // Ready-to-send message for each guest (WhatsApp / Telegram / SMS).
  // {name} = guest name, {link} = personal link.
  shareMessage:
    "{name} عزیز، سلام 🌸\n" +
    "با کمال میل شما را به جشن عروسی سارا و علی دعوت می‌کنیم.\n" +
    "دعوت‌نامه‌ی شما:\n{link}",


  /* ---------------------------------------------------------------
     9) Advanced (normally no need to change)
     --------------------------------------------------------------- */
  // Treat "-" and "_" in the link name as spaces (محمد-احمدی → محمد احمدی).
  dashAsSpace: true,
  // Longest name (in characters) that will be displayed.
  maxNameLength: 60
};
