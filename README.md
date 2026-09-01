# ToolBox

ToolBox is a static, client-side-only website acting as a hub for small, single-purpose utility tools. It is designed to run 100% in the browser with **no backend, no database, no user accounts, and no server logic**.

Once deployed, the site requires zero human intervention to keep running.

## Features

12 fully offline, client-side tools:
- **QR Code Generator**
- **Password Generator**
- **Unit Converter**
- **Currency Converter** (Rates fetched daily via GitHub Actions)
- **JSON Formatter & Validator**
- **Markdown to HTML Converter**
- **Word & Character Counter**
- **Color Picker & Palette Generator**
- **Base64 Encoder/Decoder**
- **Image Compressor & Resizer**
- **Lorem Ipsum Generator**
- **Timestamp & Date Converter**

Additional Features:
- Fully Responsive Mobile-First Design
- Dark Mode (saved in localStorage)
- Automatically generated `sitemap.xml` on build
- SEO optimized

## Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)
- Pure Client-Side JavaScript for logic

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Build for Production

To build the static assets (this will automatically generate the `sitemap.xml`):
```bash
npm run build
```

## Deployment

Because ToolBox is purely static, you can deploy the `dist` folder to any static hosting provider for free.

### Deploying to Vercel or Netlify

1. Connect your GitHub repository to Vercel or Netlify.
2. Set the **Build Command** to: `npm run build`
3. Set the **Output Directory** to: `dist`
4. Deploy!

## Automated Currency Rates

The Currency Converter uses a static JSON file (`public/currency-rates.json`). This file is updated automatically every day at midnight (UTC) using a GitHub Action located in `.github/workflows/update-rates.yml`.

No runtime API keys or server calls are needed by the client.
