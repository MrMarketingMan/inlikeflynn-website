🛠️ In Like Flynn LLC — Website

A fast, modern business website for In Like Flynn LLC, a handyman and construction service based in Gettysburg, Pennsylvania.
Built with Vite, vanilla HTML/CSS/JS, and optimized for local SEO, performance, and maintainability.
This project is currently in the final optimization and polish phase before public launch.

🌟 Project Overview

In Like Flynn LLC is a premium handyman and construction service serving South-Central Pennsylvania, including Gettysburg, Hanover, Littlestown, Fairfield, and surrounding areas.
The website highlights core services — drywall, painting, siding repair, power washing, small plumbing, demolition, and deck/dock builds — and is designed to convert local visitors through clear calls to action, responsive design, and fast load times.

This repo represents the clean, modular, and SEO-ready codebase for the company’s main website.

🚀 Features & Functionality

Responsive Design: Fully optimized for mobile, tablet, and desktop

Hero CTA Section: Click-to-call buttons and seasonal banner (e.g., gutter cleaning promo)

Service Gallery: Auto-indexed image folders using Vite glob imports

Animations: Smooth scroll-reveal and subtle falling-leaves animation

Accessibility: Semantic HTML, ARIA labels, keyboard support

SEO-Ready: Meta tags, Open Graph, sitemap.xml, robots.txt, and canonical URLs

Optimized Build: Lightweight static site ready for Netlify deployment

🧰 Tech Stack

Framework: Vite (bundler + dev server)

Languages: Vanilla HTML, CSS, and JavaScript (ES Modules)

Hosting: Netlify

Version Control: Git + GitHub

Dev Environment: VS Code + Ubuntu (WSL2)

⚙️ Installation & Development

Clone and run locally with:

# 1) Clone repository
git clone https://github.com/<your-username>/inlikeflynn-website.git
cd inlikeflynn-website

# 2) Install dependencies
npm install

# 3) Start development server
npm run dev

# 4) Build for production (outputs to dist/)
npm run build

# 5) Preview the production build locally
npm run preview

🌐 Deployment (Netlify)

Connect this repository to Netlify.

Build settings:

Build command: npm run build

Publish directory: dist

Environment: Node 18+ recommended.

Optional: Create a netlify.toml to handle caching or redirects.

Confirm the following post-deploy:

Canonical domain is correct in index.html

robots.txt and sitemap.xml reference the correct domain

All tel: links work correctly on mobile devices

🧠 Optimization & SEO Notes

Includes meta description, keywords, and Open Graph tags in index.html

Ensure sitemap and robots.txt reference the correct final domain

Use compressed WebP/AVIF images and loading="lazy" for performance

Implement @media (prefers-reduced-motion: reduce) for accessibility

Add LocalBusiness JSON-LD schema for improved Google local search ranking

Test performance with Lighthouse and Vite build analyzer

🧱 Folder Structure
inlikeflynn-website/
├─ index.html
├─ package.json
├─ vite.config.js
├─ public/
│  ├─ favicon.ico
│  ├─ logo.png
│  ├─ robots.txt
│  └─ sitemap.xml
├─ docs/
│  └─ project-guidelines.md
├─ src/
│  ├─ assets/
│  │  └─ img/
│  │     ├─ header-logo.png
│  │     ├─ logo.png
│  │     ├─ ryan-working.webp
│  │     └─ services/
│  │        ├─ drywall/
│  │        ├─ power-washing/
│  │        └─ other service folders (auto-indexed by gallery)
│  ├─ components/
│  │  └─ gutter-modal.html
│  ├─ css/
│  │  ├─ base.css
│  │  ├─ main.css
│  │  ├─ header.css
│  │  ├─ hero.css
│  │  ├─ services.css
│  │  ├─ animations.css
│  │  ├─ footer.css
│  │  └─ leaves.css
│  └─ js/
│     ├─ main.js
│     └─ animations/
│        ├─ modal.js
│        ├─ leaves.js
│        └─ service-gallery.js
└─ dist/
   └─ (generated build output)

🤝 Development Workflow

This project follows a branch safety protocol to ensure clean, reversible edits:

# Create a new feature branch
git checkout -b feature/<short-task-name>

# Stage and commit changes
git add .
git commit -m "feat: add <feature-name>"

# Push to GitHub
git push -u origin feature/<short-task-name>


Once verified and approved, merge the branch into main for Netlify auto-deploy.

🧩 Current Phase: Optimization & Polish

The project is currently in its final optimization phase, focusing on:

SEO fine-tuning

Code cleanup and accessibility review

Domain consistency checks (inlikeflynnhandyman.com)

Copilot-powered file audits (HTML/CSS/JS)

Preparing for public Netlify launch

📄 License / Credits

All website content, text, and media © In Like Flynn LLC.
Source code is licensed for internal project use only.
For reuse, contact the project owner.

Built with ❤️ by In Like Flynn LLC — Premium Handyman & Construction Services serving South-Central Pennsylvania.