# AI Handoff: Portfolio Website

This document serves as a status and architectural summary for the Next.js portfolio website of **Dr. Rahul Parajuli**.

---

## 🚀 Current Progress
- **Framework & Logic**: Next.js (v16.2.9) with React (v19.2.4) using TypeScript.
- **Styling**: Tailwind CSS (v4) with modern UI layout, fluid animations (framer-motion), and custom icons (lucide-react).
- **Core Pages**:
  - **Home** ([page.tsx](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/app/page.tsx)): Executive overview, filterable professional timeline, clinical toolkit matrix, and humanitarian footprints.
  - **Research** ([page.tsx](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/app/research/page.tsx)): Publication list parsed from structured data.
  - **Blog** ([page.tsx](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/app/blog/page.tsx)): Dynamic clinical/research blog posts with expandable components.
  - **Media** ([page.tsx](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/app/media/page.tsx)): Image gallery.
- **Key Components**:
  - **AI Assistant** ([AIAssistant.tsx](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/components/AIAssistant.tsx)): Floating widget handling keyword intents (CV request, research, contact) and routing users.
  - **CV Request Modal** ([CVRequestModal.tsx](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/components/CVRequestModal.tsx)): Secure popup requesting details to send a CV.
  - **API Routing** ([route.ts](file:///e:/Antigravity%20Projects/Portfolio%20Website/src/app/api/request-cv/route.ts)): Securely accepts CV requests and routes emails via SMTP (nodemailer).
- **Hosting & Scripts**:
  - **Custom Runner** ([server.js](file:///e:/Antigravity%20Projects/Portfolio%20Website/server.js)): Handles production Next.js request handling inside the hosting provider environment.
  - **SSH/SFTP Client** ([ssh-test.js](file:///e:/Antigravity%20Projects/Portfolio%20Website/ssh-test.js)): Script to connect to cPanel host, upload server runner, and run npm installs.

---

## 🏗️ Project Architecture
```
Portfolio Website/
├── .env.local             # Host SMTP credentials
├── package.json           # Next.js 16, React 19, Tailwind v4, ssh2, nodemailer
├── server.js              # Custom HTTP server runner (Next.js request handler)
├── ssh-test.js            # Node.js ssh2 script to deploy and test cPanel Node app
├── src/
│   ├── app/               # Next.js App Router (pages/layout/API routes)
│   │   ├── api/
│   │   │   └── request-cv/route.ts # Nodemailer SMTP email sender
│   │   ├── blog/
│   │   ├── media/
│   │   └── research/
│   ├── components/        # AIAssistant, CVRequestModal, Navbar, Footer
│   └── data/
│       └── portfolioData.ts  # Centralized portfolio data store (JSON schema)
```

---

## 📌 Exact Next Steps
1. [x] **Local Build Check**: Run `npm run build` to verify there are no TypeScript or Next.js build issues under React 19.
2. [x] **Production Build Compression**: Zip only required files (excluding `node_modules` and `.git` etc.) into `deploy_clean.zip` to upload.
3. [x] **cPanel Deployment**: Upload `deploy_clean.zip` via cPanel File Manager, extract, set up Node.js app environment version 20, and run `npm install`.
4. [x] **SMTP Verification**: The email account `portfolio@rahulparajuli.com.np` was missing in cPanel and has been created. The SMTP server configuration and authentication have been successfully tested and verified.
5. [x] **Form Submission Testing**: The CV Request form was failing due to missing `dotenv` module during custom `server.js` startup. The deploy script now correctly runs `npm install dotenv` on the server, ensuring `.env.local` is parsed. Tested directly on the live site (`https://rahulparajuli.com.np`) and it is now sending emails successfully.

---

> [!IMPORTANT]
> **Instructions for the Incoming AI Assistant**:
> - Whenever the user says "**REMEMBER**" onwards, please append the new updates/context directly into this file.
> - Ensure all rules in [AGENTS.md](file:///e:/Antigravity%20Projects/Portfolio%20Website/AGENTS.md) are followed, as this project uses Next.js with React 19 which contains strict deprecations.
>
> [!WARNING]
> **CRITICAL DEPLOYMENT BUG WARNING (DO NOT USE ZIP OR PHP EXTRACT)**:
> If the user complains that "updates are not showing on the live site after deployment", it is because Next.js aggressively caches static files in the `.next` directory. Previously, deployments failed because Windows Powershell's `Compress-Archive` created zip structures that PHP `ZipArchive` failed to securely overwrite on the cPanel server, completely breaking the site by silently omitting the `.next` folder.
> **THE FIX**: ALWAYS build deployments natively as a `.tar.gz` (e.g. `tar -czf deploy_clean.tar.gz .next public package.json server.js .env.local package-lock.json`). In the SSH deploy script (`deploy.js`), you MUST run `mv .next .next_trash || true` on the remote server BEFORE running `tar -xzf deploy_clean.tar.gz`. The `mv` command is strictly required because the active Passenger Next.js instance holds strict file locks on the `.next` directory that causes `rm -rf` to throw a "Permission denied" error. By renaming the directory, you bypass the lock entirely. NEVER revert to zip or php extraction.
> - **Recent Changes**: 
>   - **Visuals**: A clean, modern interactive grid background was established as the permanent hero section background (the Da Vinci image was permanently removed per user preference). A new interactive 3D parallax wiggle effect was added to the main headshot profile photo using Framer Motion (`useMotionValue`, `useTransform`, `preserve-3d`), making the card dynamically tilt and elevate towards the cursor on hover. 
>   - **Media Gallery Fix**: The Media page was refactored to use native Next.js `<Image>` components instead of standard `<img>` tags, fixing broken image loading behavior and ensuring optimal asset delivery.
>   - **Deployment Pipeline (REVISED to tar.gz)**: The Node script `deploy.js` securely connects to the cPanel hosting via SSH (`ssh2`), uploads a native `deploy_clean.tar.gz` archive, dynamically renames the existing remote `.next` cache directory (`mv .next .next_timestamp`), natively extracts the tarball using Unix `tar -xzf`, installs dependencies, and triggers the Passenger Node app restart. This completely bypasses previous catastrophic extraction bugs caused by PHP `ZipArchive`, Powershell, and Passenger file locks.
>   - **Telehealth Portal**: Added a new Next.js route `/talk` which acts as a patient-doctor chat interface powered by Gemini Pro (`@google/genai`). An API route `/api/chat` simulates the doctor's persona using `portfolioData.ts`. A second API route `/api/chat/summary` generates a clinical summary and emails it via nodemailer. The site favicon was also replaced with a stethoscope SVG.
>   - **Subdomain Routing & Env Config**: The `GEMINI_API_KEY` was successfully configured remotely via automated SSH scripting. The `talk.rahulparajuli.com.np` subdomain was fully configured. To bypass persistent cPanel browser caching of `cgi-sys` paths, `server.js` was modified to directly intercept requests for the `talk` subdomain via the `Host` header and issue a 301 redirect to `/talk`. Node.js was cleanly restarted via `pkill` to ensure the new routing took effect immediately.
>   - **SEO/Thumbnail Update**: `layout.tsx` was updated with `metadataBase` and Open Graph/Twitter image properties linking to `profile.jpg` for correct social preview thumbnails.
>   - **Higgsfield MCP Server Integration**: Successfully configured and verified remote Higgsfield MCP server connection (`https://mcp.higgsfield.ai/mcp`) via `mcp-remote` CLI. Completed browser-based OAuth authentication, caching credentials locally.
>   - **Interactive Background Scroll Responsiveness**: Selected Option C (Combined 3D Parallax and Fluid Push) to update the canvas-based neural-network background to react to both mouse movement and scrolling.
>   - **UI & Performance Overhaul**: Fixed React hydration mismatches caused by browser extensions. Configured Tailwind v4 `@custom-variant dark` to correctly support manual light/dark mode toggling. Refactored `InteractiveBackground.tsx` using `framer-motion` to bypass React state re-renders and achieve buttery smooth 60fps 3D parallax physics. Replaced background with a native generated high-res 8K tall vertical 3D render of Da Vinci's Vitruvian Man. Stripped opaque backgrounds from page sections to allow the background to shine through. Added an animated, dismissable Dark Mode recommendation banner and fixed Footer dark mode support.
>   - **Contact Form & Navigation**: Added an interactive expand/collapse toggle to the Footer's "Leave a Message" contact card to minimize footprint. Conditionally hid the redundant "Request CV" button from the Navbar when on the Home page.
>   - **Interactive Fluid Hologram Background**: Extensively re-engineered `InteractiveBackground.tsx`. Built a velocity-driven WebGL-style fluid ripple using SVG filters (`<feTurbulence>` and `<feDisplacementMap>`) that physically warps the Da Vinci background based on cursor speed. Added a dynamic RGB Split (Cyan/Red) glitch effect using `mix-blend-screen` and CSS hue rotations that triggers upon rapid mouse movement. Overlaid CRT scanlines for a complete sci-fi medical hologram aesthetic. Resolved a hot-reload React Rules of Hooks violation by properly hoisting Framer Motion hooks above JSX early returns.
>   - **Global Dark Mode & Typography Check**: Permanently locked the site into Dark Mode, removing the toggle buttons and warning banner to preserve the clinical, sci-fi aesthetic. Shifted the Professional Trajectory timeline anchor completely to the left, allowing experience cards to stretch the full width of the screen. Added `drop-shadow-lg` and solid backdrop contrasts to section headers and filter buttons to ensure perfect text legibility against complex backgrounds.
>   - **Sub-page Background & Interactivity**: Restricted the heavy 3D Da Vinci render exclusively to the Home (`/`) page. On sub-pages, the background falls back to a clean, matching solid slate color while *retaining* the global interactive materials. Specifically, drastically amplified the movement scale of the futuristic tracking grid to physically react to the cursor, and updated the trailing dual-spotlight to use `mix-blend-screen` for bright, dynamic visibility across all solid dark pages. Successfully compiled, packaged, and deployed all these updates to the production cPanel server via `deploy.js`.
