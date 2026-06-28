# Fortune SMP

The official website for Fortune SMP, a cracked Minecraft survival server
supporting Java + Bedrock crossplay.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

This outputs a static site to the `dist/` folder.

## Deploy for free (Vercel)

1. Push this folder to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. Click **Add New → Project**, select this repo.
4. Vercel auto-detects Vite — leave the defaults and click **Deploy**.
5. You'll get a live URL in about a minute. Add a custom domain anytime
   under Project Settings → Domains.

## Deploy for free (Netlify, alternative)

1. Run `npm run build` locally.
2. Go to [netlify.com](https://netlify.com) → **Add new site → Deploy manually**.
3. Drag the `dist/` folder into the upload box.

## Project structure

```
fortune-smp/
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ src/
   ├─ main.jsx        # React entry point
   ├─ index.css       # Tailwind imports
   └─ FortuneSMP.jsx  # The whole site (nav + all pages)
```
