# andromeda
Chrome extension that renders LaTeX in Substack articles.
Fork of [rish-16/andromeda](https://github.com/rish-16/andromeda), patched for MV3.

For those of you that are here from my Substack:

## How to install

Chrome no longer allows installing this kind of extension from the Chrome Web Store directly, so you'll need to load it manually. It takes about 2 minutes and only needs to be done once.

1. **Download this repo.** Click the green **Code** button above → **Download ZIP**. Unzip it somewhere you'll remember (like Downloads) — don't delete this folder after installing, Chrome keeps reading from it.

2. **Open Chrome's extensions page.** Type `chrome://extensions` into your address bar and hit enter.

3. **Turn on Developer mode.** There's a toggle in the top-right corner of that page — switch it on.

4. **Click "Load unpacked."** A file picker will open — select the unzipped `andromeda` folder (the one containing `manifest.json`).

5. **Done!** The extension is now installed. Open any Substack post with LaTeX and it should render automatically.

## Notes

- This only affects **your own browser** — it doesn't change how the post looks for other readers unless they also install it.
- If a post's math looks broken or doesn't render, try refreshing the page.
- If Chrome shows an error while loading, make sure Developer mode is on and that you selected the correct folder (the one with `manifest.json` inside it, not a folder containing that folder).
