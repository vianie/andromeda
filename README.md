# andromeda
Chrome extension that renders LaTeX in Substack articles.
Fork of [rish-16/andromeda](https://github.com/rish-16/andromeda) with my personal updates detailed below. 

## For those of you that are here from my Substack:

### How to install

Chrome no longer allows installing this kind of extension from the Chrome Web Store directly, so you'll need to load it manually. It takes about 2 minutes and only needs to be done once.

1. **Download this repo.** Click the green **Code** button above → **Download ZIP**. Unzip it somewhere you'll remember (like Downloads) — don't delete this folder after installing, Chrome keeps reading from it.

2. **Open Chrome's extensions page.** Type `chrome://extensions` into your address bar and hit enter.

3. **Turn on Developer mode.** There's a toggle in the top-right corner of that page — switch it on.

4. **Click "Load unpacked."** A file picker will open — select the unzipped `andromeda` folder (the one containing `manifest.json`).

5. **Done!** The extension is now installed. Open any Substack post with LaTeX and it should render automatically.

### Notes

- This only affects **your own browser** — it doesn't change how the post looks for other readers unless they also install it.
- If a post's math looks broken or doesn't render, try refreshing the page.
- If Chrome shows an error while loading, make sure Developer mode is on and that you selected the correct folder (the one with `manifest.json` inside it, not a folder containing that folder).

### What's different from the original

- **Manifest V3.** The original used Manifest V2, which Chrome has since discontinued and will no longer install, even as an unpacked/developer-mode extension. `manifest_version` was bumped to `3` and `browser_action` was renamed to `action` (the MV3 equivalent). No other permissions or behavior changed here.

- **Single-`$` delimiters instead of `$$`.** The original only rendered LaTeX wrapped in double dollar signs (`$$...$$`). This fork switches to single dollar signs (`$...$`), matching how most people are used to writing inline math. Note this does mean literal dollar amounts in your text (like "$5 and $10") can occasionally get misread as a math delimiter pair.

- **Renders in more places.** The original only scanned `<p>` (paragraph) elements. This fork also scans headings, list items, blockquotes, and image captions, so math works anywhere in a post, not just body paragraphs.

- **No more stray whitespace.** The original's text-splitting logic inserted an extra space at every rendered equation, which could subtly break sentence spacing. This fork surgically replaces just the matched `$...$` text, leaving everything around it untouched.

- **Math can now span across formatting tags.** If Substack's editor inserts a tag (e.g. italics, bold, a link) in the middle of your equation — which can happen automatically, for instance if the editor mistakes a lone underscore in your LaTeX for markdown italics — the original extension couldn't see across that boundary and would fail to render half the equation. This fork scans the full text of each element (headings, paragraphs, etc.) across any tags in between, so equations render correctly even when Substack has split them across multiple HTML nodes.

- **No more double-rendering bugs.** The original operated by rewriting an element's entire `innerHTML`, which could cause the same text to be processed twice if it was nested inside another matching element (e.g. a paragraph inside a blockquote), corrupting the render. This fork tracks already-rendered KaTeX output and skips it on subsequent passes, so nested elements no longer conflict.
