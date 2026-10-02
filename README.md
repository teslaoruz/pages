# دعوت‌نامه‌ی آنلاین — Persian Invitation Website

A simple, elegant, mobile-friendly Persian (RTL) invitation page that shows each guest's name from the link.
Pure HTML + CSS + vanilla JavaScript. No backend, no database, no paid services — hosted free on GitHub Pages.

```
https://USERNAME.github.io/REPO/?name=محمد-احمدی     →  shows «محمد احمدی»
https://USERNAME.github.io/REPO/                     →  shows the generic «مهمان گرامی»
```

---

## Files

| File | What it is | Edit it? |
|------|-----------|----------|
| `config.js` | **All invitation text**: title, hosts, message, date, time, venue, map link, countdown, signature, share message | ✅ **Yes — this is the only file you normally edit** |
| `index.html` | The invitation page | Only the link-preview `<meta>` lines at the top (optional) |
| `style.css` | Design. Colors are at the top (`:root`) | Optional |
| `script.js` | Reads the name from the URL, fills the page, countdown, calendar file | No |
| `links.html` + `links.js` | **Guest link generator** — paste names, get personal links | No |
| `fonts/` | Self-hosted Persian font *Vazirmatn* (free, OFL license) | No |
| `.nojekyll` | Tells GitHub Pages to serve files as-is | No |

---

## 1. Change the invitation text

Open **`config.js`** and edit the values between quotes. Every field has a comment explaining it:

| Field | Example |
|-------|---------|
| `topLine` | `"به نام خدا"` |
| `title` | `"جشن عروسی"` / `"جشن تولد"` / `"مراسم فارغ‌التحصیلی"` |
| `hosts` | `"سارا و علی"` |
| `greetingLabel` | small line above the guest's name |
| `greetingGeneric` | shown when the link has no name |
| `message` | the main invitation paragraph |
| `dateText`, `timeText` | exactly as guests should read them, e.g. `"جمعه، ۲۰ آذر ۱۴۰۵"` |
| `venueName`, `venueAddress` | place name and address |
| `mapUrl` | Google Maps / Neshan / Balad share link (for the «مسیریابی» button) |
| `eventStart`, `eventEnd` | exact time for the countdown and «افزودن به تقویم», format `2026-12-11T19:00:00+03:30` (Gregorian date + Iran time zone) |
| `showCountdown`, `showCalendarButton` | `true` / `false` |
| `closing`, `signature` | closing sentence and family names |
| `contactLabel`, `contactPhone` | optional RSVP phone button |
| `shareMessage` | message text used by the link generator (`{name}` and `{link}` are replaced) |

**Tip:** set any text field to `""` and that part disappears from the page.

> Converting a Persian date to the Gregorian date for `eventStart`: use any online «تبدیل تاریخ» tool
> (e.g. time.ir). Example: ۲۰ آذر ۱۴۰۵ = 2026‑12‑11.

**Colors:** change the variables at the top of `style.css` (`--gold`, `--bg`, `--paper`, `--ink`…).

**Link preview** (what WhatsApp/Telegram show under a shared link): messengers do not run JavaScript, so edit the
`og:title` / `og:description` lines at the top of `index.html` by hand.

---

## 2. Upload to GitHub and enable GitHub Pages

### Option A — in the browser (no software needed)

1. Create a free account at <https://github.com> and sign in.
2. Click **+** (top‑right) → **New repository**.
   - **Repository name:** e.g. `invitation` (this becomes part of the address).
   - Choose **Public** (GitHub Pages is free for public repositories).
   - Click **Create repository**.
3. On the new repository page click **uploading an existing file**
   (or **Add file → Upload files**).
4. Drag **all the files and the `fonts` folder** from this project into the page.
   Make sure `index.html` is at the top level, not inside another folder.
   > `.nojekyll` is a hidden file and may not be dragged on some systems — that's OK, the site works without it.
5. Click **Commit changes**.
6. Go to **Settings → Pages** (left menu).
7. Under **Build and deployment → Source** choose **Deploy from a branch**.
   Branch: **main**, folder: **/ (root)** → **Save**.
8. Wait 1–2 minutes and refresh. The address appears at the top of the Pages screen:
   `https://USERNAME.github.io/invitation/`

### Option B — with git (command line)

```bash
cd path/to/this/project
git init
git add .
git commit -m "Invitation website"
git branch -M main
git remote add origin https://github.com/USERNAME/invitation.git
git push -u origin main
```

Then do steps 6–8 above.

### Updating later

Edit `config.js` on GitHub (open the file → ✏️ pencil icon → **Commit changes**) or push again.
The site updates in about a minute. Guests' existing links keep working.

> If the page shows the old text, refresh with **Ctrl+F5** (or open in a private tab) — browsers cache files briefly.

---

## 3. Create personal links for guests

### Easy way: the built-in generator

1. Open `https://USERNAME.github.io/invitation/links.html`
2. Paste your guest names, **one per line**:
   ```
   محمد احمدی
   سرکار خانم زهرا کریمی
   خانواده‌ی رضایی
   ```
3. Click **ساخت لینک‌ها**. For each guest you get:
   - **کپی لینک** — copy the personal link
   - **کپی پیام دعوت** — copy a ready message (from `shareMessage` in `config.js`) to paste into WhatsApp/Telegram/SMS
   - **پیش‌نمایش** — open the invitation as that guest sees it
4. **دانلود فایل اکسل (CSV)** saves all names + links as a spreadsheet that opens correctly (with Persian) in Excel.

The generator runs entirely in your browser — names are not sent or saved anywhere.
It is not linked from the invitation, and is marked `noindex` so search engines skip it.

By default links are *percent‑encoded* (`?name=%D9%85%D8%AD...`). They look long but work in every app
(some messengers cut links at the first Persian letter). The checkbox «لینک‌ها با حروف فارسی خوانا باشند»
produces readable links like `?name=محمد-احمدی` instead.

### Manual way

Add `?name=` and the name to your site address, using `-` instead of spaces:

```
https://USERNAME.github.io/invitation/?name=محمد-احمدی
```

### How names in links are handled

- Persian, encoded (`%D9%85...`), double‑encoded, `+` and `-`/`_` as spaces all work.
- Arabic «ي» / «ك» are shown as Persian «ی» / «ک»; the half‑space (نیم‌فاصله) is preserved.
- The name is inserted as plain text (no HTML), so a link can't inject code into the page.
- An empty, missing or unreadable name shows the generic invitation.
- To keep real hyphens in names, set `dashAsSpace: false` in `config.js`.

---

## 4. Test locally (optional)

Double‑click `index.html` to open it, then add `?name=...` to the address bar.
Or run a tiny local server:

```bash
python3 -m http.server 8000
# open http://localhost:8000/?name=محمد-احمدی
```

---

Font: [Vazirmatn](https://github.com/rastikerdar/vazirmatn) by Saber Rastikerdar — SIL Open Font License (`fonts/OFL.txt`).
