# DropIt - Personal Knowledge Workspace

DropIt is an offline-first Chrome Extension designed to capture notes, research, and fleeting ideas quickly right where you work, without interrupting the natural flow of browsing.

## Features

- **Quick Capture**: Instantly capture selected text, annotations, and quick notes directly from your browser.
- **Bilingual Support**: Fully localized in English (LTR) and Persian/Farsi (RTL).
- **Theme Modes**: Supports both Light and Dark theme modes.
- **Offline-First & Private**: All data is stored locally in Chrome Storage (`chrome.storage`). No remote servers, ensuring 100% privacy.
- **Dashboard Workspace**: Organize, review, search, and manage your saved notes in a central dashboard.

## Installation (Developer Mode)

To run this extension locally in your browser:

1. **Clone or Download** this repository to your machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select the root folder of this repository (containing `manifest.json`).
6. The DropIt extension icon should now appear in your browser's extension list!

## Landing Page & Deployment

The landing page of the project is located in the `/landing` directory. 

### Deploying to GitHub Pages

This project is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically publish the landing page to GitHub Pages whenever changes are pushed to the `main` branch.

To enable this:
1. Go to your repository settings on GitHub: **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions** (instead of *Deploy from a branch*).
3. The next time you push to the `main` branch, the landing page will automatically deploy to `https://<username>.github.io/DropIt/`.
