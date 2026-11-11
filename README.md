# Life HQ Daily Reality Check (widget feed)

This small project publishes Life HQ's Daily Reality Check to a public web address every day, so an Android widget can show it.

* Same 72 messages and the same daily rule as the Life HQ dashboard.
* The date is taken in **Perth time**, so the message changes at Perth midnight.
* Nothing here connects to Life HQ, Claude, Notion or any of your data. These files contain only the messages.

## What's in this folder

| File | What it is |
|---|---|
| `messages.json` | The 72 messages, copied exactly from Life HQ. Edit this file to add, remove or reword messages. |
| `build.mjs` | Picks today's message using the Perth date. |
| `.github/workflows/daily-reality-check.yml` | Tells GitHub to run `build.mjs` just after Perth midnight each day and publish the result. |
| `docs/today.json` | Today's message for widget apps, e.g. `{"date":"2026-11-11","message":"…"}`. |
| `docs/today.txt` | Today's message as plain text. |
| `docs/days.json` | Messages for the next ~400 days (a backup source, see "Advanced" below). |
| `docs/index.html` | A simple page showing today's message, in case you open the address in a browser. |

## Part 1: Publish it on GitHub (about 10 minutes, free)

1. **Create a free GitHub account** at github.com if you don't have one.
2. **Create a new repository.** Click **+** (top right) → **New repository**.
   * Name: `lifehq-reality`
   * Visibility: **Public** (free GitHub Pages needs a public repository; the messages aren't personal).
   * Don't tick "Add a README".
   * Click **Create repository**.
3. **Upload the files.** On the new repository page, click **uploading an existing file**. Drag in **everything inside this folder**, including the hidden `.github` folder and `docs/.nojekyll`.
   * If your computer hides the `.github` folder, turn on "show hidden files" (Mac Finder: press Cmd + Shift + .). Or use the zip you were given, unzip it, and drag the contents.
   * Click **Commit changes**.
4. **Turn on GitHub Pages.** Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. **Allow the daily job to save files.** Go to **Settings → Actions → General → Workflow permissions**, choose **Read and write permissions**, then click **Save**.
6. **Run it once by hand.** Go to the **Actions** tab, click **Daily Reality Check** → **Run workflow** → **Run workflow**. Wait for the green tick (about 1 minute).
7. **Check the address.** Open this in your browser, replacing `YOUR-USERNAME` with your GitHub username:
   * `https://YOUR-USERNAME.github.io/lifehq-reality/` shows today's message as a page.
   * `https://YOUR-USERNAME.github.io/lifehq-reality/today.json` is what the widget reads.

From now on it updates itself every day.

## Part 2: Make the widget with KWGT (on your Android phone)

**KWGT Kustom Widget Maker** (free on Google Play) can read a web address, style text freely and open a link when tapped. You build your own design for free. The paid "KWGT Pro" key is mainly for importing ready-made designs, which you don't need here.

1. Install **KWGT Kustom Widget Maker** from Google Play.
2. **Add an empty widget.** Long-press your home screen → **Widgets** → **KWGT** → drag the **4×2** size onto the screen. Tap it to open the editor, then tap **Create** (or start from an empty preset).
3. **Background.** In the **Items** tab, tap **+** → **Shape**.
   * Shape: Rectangle. Width and height: fill the widget (KWGT's "fit to parent" options, or about 360 × 170).
   * Corners: about 28.
   * Paint → Colour: `#FBF6F1` (cream).
   * Optional border: in FX, add a thin stroke in `#EBDDD5`.
4. **Small heading.** Tap **+** → **Text**.
   * Text: `TODAY'S REALITY CHECK`
   * Size about 10, colour `#9C5640` (terracotta), bold.
5. **The message.** Tap **+** → **Text**. Tap the text field, choose the formula editor, and paste in this (with your username):

   ```
   $wg("https://YOUR-USERNAME.github.io/lifehq-reality/today.json?h=" + df(yyyyMMddHH), json, ".message")$
   ```

   * Size about 16 to 18, colour `#3B2C2B` (deep cocoa, easy to read on cream).
   * Font: a serif in italics. KWGT can also use a font file: download **Fraunces** (the Life HQ heading font) free from fonts.google.com and choose it in the font picker.
   * Set **Max lines** to 4 and turn on **Fit text** or auto-size if offered, so long messages shrink instead of being cut off.
6. **Blush accent (optional).** Add a **Shape** behind the message: a rounded rectangle in `#F3D9D8` (blush) with corners about 18 and a little padding. Or add a thin 3-wide vertical bar in `#F3D9D8` to the left of the message.
7. **Date line (optional).** Tap **+** → **Text** with formula `$df("EEE d MMM")$`, size 11, colour `#7A6662`.
8. **Tap to open Life HQ.** Select the background shape (or the whole widget group) → **Touch** tab → **+** → **Action: Open Link** → paste your private Life HQ link (the claude.ai artifact address you use now). Tapping opens Life HQ in the Claude app or your browser. You'll need to be signed in to Claude, as usual.
9. Tap the **save** icon (top right), go back to the home screen and resize the widget to 4×2 if needed.

### Your palette

| Use | Colour |
|---|---|
| Background (cream) | `#FBF6F1` |
| Panel / accent (blush) | `#F3D9D8` |
| Heading (terracotta) | `#9C5640` |
| Message text (deep cocoa) | `#3B2C2B` |
| Small text (warm grey) | `#7A6662` |
| Border | `#EBDDD5` |

These are Life HQ's own colours, plus a terracotta that's dark enough to read clearly on cream. For a softer, dusty-rose heading like Life HQ's, use `#A65E69` instead.

## How it refreshes

1. **GitHub** runs the daily job at about 00:02 Perth time, with backup runs at about 00:30, 02:15 and 05:40 in case GitHub starts it late. Each run publishes the message for the current Perth date. If the message is already up to date, nothing changes.
2. **GitHub Pages** serves the new file within a few minutes. Its servers can keep an older copy for up to about 10 minutes.
3. **KWGT** downloads the file when the address in the formula changes. The `?h=` + `df(yyyyMMddHH)` part changes every hour, so the widget fetches a fresh copy at least once an hour. In practice, the new message should appear between about 12:15 and 1:15 am Perth time.

## Limitations

* **Not instant at midnight.** Expect the switch within about an hour of Perth midnight, not on the dot.
* **GitHub's timing isn't guaranteed.** Scheduled runs can start late, especially just after the hour, which is why there are backup runs. On a rare bad night, the widget could show yesterday's message until the 5:40 am run.
* **Phone battery savers can delay updates.** If the widget seems stale, open **Settings → Apps → KWGT → Battery** on your phone and choose **Unrestricted**.
* **Your Life HQ refresh button doesn't affect the widget.** The widget always shows the day's standard message.
* **Life HQ follows your device's clock; the widget follows Perth.** They match while your devices are set to Perth time. If you travel, they may differ around midnight.
* **Keeping messages in step.** If you change the messages in Life HQ, update `messages.json` here too (or ask Claude to). Otherwise the widget and dashboard will show different messages.
* **GitHub may pause inactive schedules.** In public repositories, GitHub can switch off scheduled jobs after 60 days with no activity, and sends an email first. The daily job saves a file each day, which should count as activity. If it ever stops, open **Actions** and click **Enable workflow**.
* **Public address.** Anyone with the address can read the messages. They contain nothing personal, and your Life HQ link stays only inside the widget on your phone.

## Advanced: keep working even if a daily run fails

`docs/days.json` holds the message for every day of the next ~400 days, and each daily run extends it. A widget can pick today's entry using the phone's own date, so it doesn't depend on that day's GitHub run:

```
$wg("https://YOUR-USERNAME.github.io/lifehq-reality/days.json?d=" + df(yyyyMMdd), json, ".days.d" + df(yyyyMMdd))$
```

This uses the phone's date, so it matches Perth while your phone is set to Perth time. Try it if the main formula ever shows a stale message.

## Changing the messages later

Edit `messages.json` on GitHub (open the file → pencil icon → **Commit changes**). The next daily run uses the new list, or run it by hand from the **Actions** tab. Keep the same list in Life HQ so both show the same message each day.
