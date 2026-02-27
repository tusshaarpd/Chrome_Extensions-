# PM API Inspector — Chrome Extension

A simplified API traffic monitor for Product Managers. Inspect live network requests directly from a browser popup — no DevTools needed.

---

## What It Does

- Captures all `fetch` and XHR network calls on any tab
- Shows HTTP method, endpoint path, status code, and duration
- Highlights failed requests (4xx / 5xx) in red
- Exports captured calls to a JSON file
- Works entirely inside a lightweight Chrome popup

---

## Project Structure

```
PM_API_Inspector/
├── manifest.json       # Chrome Extension manifest (MV3)
├── service_worker.js   # Background worker: attaches debugger, captures network events
├── popup.html          # Popup UI layout
├── popup.js            # Popup logic: render table, handle buttons
├── styles.css          # Styling for the popup
└── README.md
```

---

## How to Install (Load Unpacked)

> No Chrome Web Store install required. Load it directly from your local files.

### Step 1 — Download the Extension Files

Clone or download this repository:

```bash
git clone https://github.com/tusshaarpd/Chrome_Extensions-.git
```

Or click **Code → Download ZIP** on the GitHub page and extract it.

### Step 2 — Open Chrome Extensions Page

Open a new Chrome tab and navigate to:

```
chrome://extensions
```

### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle **Developer mode** ON.

![Developer Mode toggle](https://developer.chrome.com/static/docs/extensions/get-started/tutorial/hello-world/image/extensions-page-e0d64d89a6acf.png)

### Step 4 — Load the Extension

1. Click **Load unpacked**
2. Navigate to the folder where you cloned/extracted the repo
3. Select the `PM_API_Inspector` folder (the one containing `manifest.json`)
4. Click **Select Folder**

The extension icon will appear in your Chrome toolbar.

---

## How to Use

### 1. Pin the Extension (Optional)

Click the puzzle icon (🧩) in the Chrome toolbar → click the **pin** icon next to **PM API Inspector** to keep it visible.

### 2. Navigate to Any Website

Go to the website whose API calls you want to inspect (e.g. `https://app.example.com`).

### 3. Open the Popup

Click the **PM API Inspector** icon in the toolbar.

### 4. Start Capture

Click **Start Capture**. This attaches the Chrome debugger to the active tab and begins listening for network requests.

> A yellow banner may appear at the top of the browser saying "Chrome DevTools has started debugging this browser". This is normal — it means the debugger is active.

### 5. Trigger Activity on the Page

Interact with the page — log in, click buttons, load data — anything that makes the app fire API calls.

### 6. Refresh the Table

Click **Refresh** in the popup. The table will fill with all captured requests:

| Column | Description |
|---|---|
| **Method** | HTTP verb — GET, POST, PUT, DELETE, etc. |
| **Endpoint** | URL path (hover to see full URL) |
| **Status** | HTTP response code — 200, 404, 500, etc. |
| **Duration ms** | Time from request sent to response received |

Failed requests (status 400+) are highlighted in **red**.

### 7. Export to JSON (Optional)

Click **Export JSON** to download all captured requests as `api-calls.json`. Useful for sharing with engineers or filing bug reports.

### 8. Clear the List

Click **Clear** to reset the captured request list and start fresh.

---

## Permissions Explained

| Permission | Why It's Needed |
|---|---|
| `debugger` | Attach Chrome DevTools Protocol to capture network traffic |
| `tabs` | Query the currently active tab to attach the debugger |
| `activeTab` | Access the focused tab when the popup is opened |
| `storage` | (Reserved for future session persistence) |

---

## Limitations

- Capture starts when you click **Start Capture** — requests made before that are not recorded
- The debugger detaches if you close the tab or navigate away; click **Start Capture** again on the new page
- Only works on regular `http`/`https` pages — not on `chrome://` or `file://` pages
- The Chrome DevTools banner ("Chrome is being debugged") will appear while capturing — this is expected behaviour

---

## Troubleshooting

**No requests showing up after Refresh**
- Make sure you clicked **Start Capture** before interacting with the page
- Check that the extension has permission for that site (some intranets block extensions)

**"Debugger attach error" in the console**
- The debugger may already be attached from a previous session. Try closing and reopening the popup, or reloading the extension from `chrome://extensions`

**The popup is blank**
- Open `chrome://extensions`, find PM API Inspector, and click the **Errors** button to see any reported issues

---

## Tech Stack

- **Manifest V3** Chrome Extension
- **Chrome Debugger API** (`chrome.debugger`) via Chrome DevTools Protocol
- **Vanilla JS** — no frameworks or build tools required

---

## Contributing

Pull requests welcome. To add a feature:

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT
