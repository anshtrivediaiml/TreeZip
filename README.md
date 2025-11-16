# ASCII Tree to File Structure Generator

Convert ASCII tree diagrams into downloadable ZIP file structures with exact naming conventions preserved.

## Features

- 📁 Convert ASCII tree structures to real file/folder hierarchies
- 📦 Download as ZIP file
- 🎯 Preserves exact naming conventions (CamelCase, kebab-case, etc.)
- 🚀 One-click solution - no manual file creation needed
- 🌐 Pure HTML/JS - No build process required!

## Local Development

Simply open `index.html` in your browser. That's it!

No npm, no build process, no dependencies to install. Just double-click and run.

## Deployment

### Option 1: Netlify (Recommended - Drag & Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop your project folder
3. Your site is live instantly!
4. Free custom domain included

### Option 2: GitHub Pages
1. Create a new GitHub repository
2. Upload `index.html` and `app.js`
3. Go to Settings > Pages
4. Select branch and folder
5. Your site will be live at `username.github.io/repo-name`

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project folder
3. Follow the prompts
4. Done!

### Option 4: Surge.sh
1. Install Surge: `npm install -g surge`
2. Run `surge` in your project folder
3. Choose a domain name
4. Your site is live!

### Option 5: Cloudflare Pages
1. Push to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Connect your repository
4. Deploy!

## Usage

1. Paste your ASCII tree structure (folders end with /)
2. Click "Generate Structure"
3. Click "Download ZIP File"
4. Extract and use!

## Example Input

```
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── App.tsx
```

## License

MIT

## Tech Stack

- Pure HTML/CSS/JavaScript
- React via CDN
- Tailwind CSS via CDN
- JSZip for ZIP generation
- No build process required!