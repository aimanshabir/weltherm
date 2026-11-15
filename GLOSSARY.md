# Weltherm Project — Layman's Glossary

Every piece of jargon used while building this app, explained in plain language with everyday analogies. Grouped by theme — skim the section you need.

---

## 🌍 The Big Picture

| Jargon | Layman meaning |
|---|---|
| **Website** | A brochure: you look at it, it doesn't change much |
| **Web app** | A machine: you interact with it (logins, forms, admin panels) — Weltherm is this |
| **Frontend** | The dining area of a restaurant — everything the customer sees and touches |
| **Backend** | The kitchen — where orders are processed, hidden from customers |
| **Server** | A computer that's always on, "serving" pages to anyone who asks |
| **Browser** (or **client**) | The app you browse with (Chrome, Edge) — the customer's seat at the table |
| **Database** | The pantry/filing cabinet where information is permanently stored (our products, posts, logins) |
| **Request/Response** | The conversation: browser asks ("show me products"), server answers (here's the page) |

## 🛠️ The Tools We Used

| Jargon | Layman meaning |
|---|---|
| **Code framework** | A half-built house. Walls and plumbing exist; you just furnish the rooms. Makes decisions *for* you |
| **Library** | A toolbox. *You* decide when to pick up each tool (React is this) |
| **React** | An engine for drawing interactive screens out of reusable pieces |
| **Next.js** | The complete car built around that engine: pages, server, speed — all wired up |
| **Node.js** | Lets JavaScript run *outside* the browser (on your PC / a server). Without it, JS only lives in browsers |
| **npm** | The app store for code packages. `npm install` = download tools others built |
| **package.json** | Your project's shopping list — every tool the project depends on |
| **TypeScript** | JavaScript with a spell-checker. Catches mistakes before the page even runs |
| **Tailwind CSS** | Ready-made outfits for your page. Instead of sewing CSS by hand, you pick pre-made classes like `rounded-2xl` |

## 🧱 Building Blocks (React world)

| Jargon | Layman meaning |
|---|---|
| **Component** | A LEGO brick of your page — a card, a button, a header. Build once, reuse everywhere |
| **JSX** | HTML written inside JavaScript — `<h1>{product.name}</h1>` mixes the two |
| **Props** | Instructions handed to a LEGO brick: "here's *this* product, draw a card for it" |
| **State** | A component's private whiteboard. Writing on it makes the screen redraw (e.g., "menu is open") |
| **`useState`** | The React command that creates that whiteboard |
| **Server Component** (default) | Code that runs only in the kitchen — can touch the database, sends finished HTML |
| **Client Component** (`"use client"`) | Code shipped to the browser — handles clicks, typing, menus |
| **Hydration** | The mannequin coming alive: page arrives as static HTML, then JavaScript attaches to make buttons work |
| **`.map()`** | "For each item in this list, produce one of these" — how 8 cards render from a list of 8 products |

## 🗺️ Pages & Addresses

| Jargon | Layman meaning |
|---|---|
| **Routing** | The building's signage system: which code answers which URL |
| **Route** | One specific address (`/products`) |
| **URL** | The street address of a page |
| **Slug** | The human-friendly name inside a URL: `/products/`**`electric-hamaam`** |
| **Dynamic route** (`[slug]`) | One template serving many pages — like one form printing 91 certificates |
| **localhost** | Your own computer pretending to be the internet. Only you can see it |
| **Port 3000** | The unit number. One address (your PC), many apartments (programs) |
| **Dev server** | A live workshop: rebuilds the site every time you save a file |

## 🗄️ Data & Databases

| Jargon | Layman meaning |
|---|---|
| **SQLite** | A database that's just *one file* on disk (`prisma/dev.db`). No installation — perfect for learning |
| **ORM** | A translator. Lets you ask the database in JavaScript instead of its native language |
| **Prisma** | The specific ORM we use — our translator between code and SQLite |
| **Schema** | The blueprint of the database: what boxes exist and what goes in each (Products, Posts, Users...) |
| **Model** | One drawer in the filing cabinet. "Product" model = the products drawer |
| **SQL** | The database's native language (`SELECT * FROM products`). Prisma writes it for us |
| **CRUD** | Create, Read, Update, Delete — the four things every app does to data. The admin panel = a nice face for CRUD |
| **Seed / seeding** | Pre-filling the pantry with initial stock (we "seeded" 91 real products from the old site) |
| **Upsert** | "Update if it exists, create if it doesn't" — one command, no duplicates |
| **API** | A waiter: takes your order to the kitchen, brings results back. A formal menu of things a program will do for you |
| **JSON** | A standard way to write data as labeled fields: `{"name": "Geyser", "price": 0}` — the packing tape of the web |
| **Markdown** | Easy formatting: `**bold**`, `# heading`, `- list`. The blog posts are written in it |

## 📨 Forms & Actions

| Jargon | Layman meaning |
|---|---|
| **Server Action** | A form that delivers straight to the kitchen — no waiter (API) needed. Our contact form saves to the DB with one of these |
| **Validation** | The bouncer at the door: `required`, `type="email"` reject bad input before it reaches the server |

## 🔐 Logins & Security

| Jargon | Layman meaning |
|---|---|
| **Auth** (authentication) | Checking *who you are* — the ID check at the door |
| **bcrypt** | A one-way blender for passwords. You can blend "Admin@123" into mush, but nobody can un-blend it back. We only ever store the mush |
| **Hash** | The mush itself |
| **Session** | Your wristband at an event. Show it once, roam freely (7-day expiry on ours) |
| **Cookie** | The wristband itself — a small note your browser keeps and shows the server on every visit |
| **httpOnly cookie** | A tamper-proof wristband: even sneaky JavaScript in the page can't read or fake it |
| **Token** | The random ticket number on the wristband |

## ⚡ Speed Tricks

| Jargon | Layman meaning |
|---|---|
| **Cache** | A photocopy drawer. Made the page once? Keep copies instead of re-doing the work |
| **Prerender / Static generation (SSG)** | Baking all pages *in advance* (we pre-baked 117) instead of cooking each on order |
| **Revalidate / `updateTag`** | Throwing away exactly the stale photocopies when data changes — why edits appear instantly |
| **Streaming / Suspense** | Serving bread and the menu *instantly* while the main dish still cooks. **Suspense** = the "food is coming" placeholder plate |
| **Partial Prerendering (PPR)** | Half the page pre-baked (header, layout), half cooked fresh (your search results) |
| **Prefetching** | The site guessing your next click and quietly loading it before you click — why navigation feels instant |
| **Lazy loading** | Don't load images until you scroll near them |
| **Hot reload** | Save the file → the page updates itself instantly, like editing in a mirror |

## 🎨 Looks & Layout (CSS)

| Jargon | Layman meaning |
|---|---|
| **HTML** | The skeleton — what's on the page (heading, image, button) |
| **CSS** | The skin and clothes — how it looks (colors, spacing, layout) |
| **Semantic HTML** | Using honest labels (`<nav>` for navigation, `<footer>` for bottom) instead of calling everything a generic box |
| **Box model** | Every element is a framed painting: picture (content), matting (**padding**), frame (**border**), wall space to the next painting (**margin**) |
| **Flexbox** | Lining items up in a row or column, with spacing and centering controls |
| **Grid** | A chessboard layout: rows *and* columns (our 2→3→4 column product grids) |
| **Responsive design** | The page reshuffles itself for phone / tablet / desktop |
| **Breakpoint** (`sm:`, `lg:`) | The width thresholds where the layout changes costume |
| **Mobile-first** | Design for the phone first, then enhance for bigger screens |
| **Hover state** | What an element looks like when the mouse rests on it (button darkens, card lifts) |
| **Transition** | The smooth animation between two states, instead of a sudden jump |
| **Utility class** | A nickname for a CSS rule: `p-6` means "padding: 24px" |

## 🔎 Being Found & Being Fair

| Jargon | Layman meaning |
|---|---|
| **SEO** | Search Engine Optimization — making Google rank you. Pre-built pages + proper headings + descriptions |
| **Metadata** | The page's business card shown in Google results and link previews |
| **Accessibility (a11y)** | Ramps beside the stairs — making the site usable for everyone, including blind visitors |
| **Screen reader** | Software that reads pages aloud; `alt` text and `aria-label` are how it knows what's what |

## 🚀 Shipping It

| Jargon | Layman meaning |
|---|---|
| **Dev mode** | Rehearsal: everything visible, slower, forgiving |
| **Build / production build** | The optimized, pre-baked version of the site (`npm run build`) |
| **Deploy** | Opening the shop to the real world (a real URL, real visitors) |
| **Vercel** | A landlord that hosts web apps; made by the Next.js creators |
| **VPS** | Renting your own small computer to run the site yourself |
| **Self-hosted** | You own and run the whole building (our current setup — DB and images are all local files) |
| **Serverless** | Renting a chef per meal instead of hiring one full-time |
| **Environment variables (.env)** | Settings and secrets kept *outside* the code in a lockbox — like the master key not taped to the door |
| **Git** | A save-game system for code: checkpoints, undo, "who changed what" |

## 📦 Project-Specific Terms

| Jargon | Layman meaning |
|---|---|
| **WordPress / WooCommerce** | The old weltherm.com's engine — a very popular website kit with a shop add-on |
| **Scraping / Store API import** | Politely copying the catalog from the old shop into our new one |
| **Moderation queue** | The editor's desk: submitted posts wait as **PENDING** until an admin approves (**PUBLISHED**) or declines (**REJECTED**) |
| **Admin panel** | The control room behind the shop — manage products, posts, messages |
| **Turbopack** | Next.js's super-fast builder (bundling + hot reload) |
| **WSL** | Windows Subsystem for Linux — a Linux apartment inside your Windows building |
| **Terminal / CLI** | Text-only remote control for your computer — type commands, get results |
| **Prisma Studio** | A visual file-browser for the database (`npx prisma studio`) |

---

**The 10 you'll use daily:** frontend, backend, database, component, route, build, deploy, cache, state, CRUD. Nail those and every tutorial on the internet becomes readable.
