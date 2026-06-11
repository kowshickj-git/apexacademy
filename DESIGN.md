# APEX ROBOTICS ACADEMY — DESIGN SYSTEM REFERENCE

## DESIGN.md

---

## 1. BRAND IDENTITY

**Academy Name:** APEX ROBOTICS ACADEMY  
**Tagline:** Learn · Build · Innovate  
**Subheading:** Empowering the Next Generation of Engineers, Innovators, and Technology Leaders  
**Founded:** 2024  
**Founder:** KOWSHICK J  
**Locations:** Chennai & Erode, Tamil Nadu, India  
**Contact:** apex.support.academy@gmail.com | +91 88072 00577

---

## 2. COLOR SYSTEM

All colors are defined as CSS custom properties in `styles.css`.

```css
:root {
  --bg:        #050507;   /* Page background — near-black with blue tint */
  --surface:   #18181B;   /* Card / panel background */
  --surface2:  #1c1c20;   /* Nested card / alternate surface */
  --border:    #27272A;   /* Default border */
  --border2:   #3F3F46;   /* Stronger border */

  --primary:   #10B981;   /* Emerald green — primary accent */
  --pdim:      rgba(16,185,129,.12);  /* Primary tint (card backgrounds) */
  --pglow:     rgba(16,185,129,.24);  /* Primary glow (shadows/radials) */

  --secondary: #0EA5E9;   /* Sky blue — secondary accent */
  --sdim:      rgba(14,165,233,.12);  /* Secondary tint */
  --sglow:     rgba(14,165,233,.24);  /* Secondary glow */

  --text:      #FFFFFF;   /* Primary text */
  --muted:     #A1A1AA;   /* Secondary text / descriptions */
  --dim:       #52525B;   /* Tertiary text / labels */
}
```

### Color Usage Rules
- **Green (#10B981):** Primary CTAs, active states, positive indicators, headings accent
- **Blue (#0EA5E9):** Secondary CTAs, info elements, alternate card accents
- Never mix more than 2 accents in a single component
- Background radial glows use `rgba(16,185,129,.05–.12)` — always subtle
- Card borders: `var(--border)` default; hover `rgba(255,255,255,.11)`

---

## 3. TYPOGRAPHY

### Font Families
```css
--font: 'Inter', -apple-system, sans-serif;   /* All body and UI text */
--mono: 'JetBrains Mono', monospace;          /* Labels, badges, code, stats */
```

Import from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type Scale

| Class       | Size                    | Weight | Usage                          |
|-------------|-------------------------|--------|--------------------------------|
| `.t-display`| clamp(38px,5vw,64px)   | 500    | Page hero headings             |
| `.t-h2`     | clamp(26px,3.5vw,42px) | 500    | Section headings               |
| `.t-h3`     | clamp(17px,2vw,24px)   | 500    | Card headings                  |
| `.t-h4`     | 16px                    | 500    | Sub-headings                   |
| `.t-body`   | 15.5px                  | 400    | Body text, descriptions        |
| `.t-small`  | 13px                    | 400    | Supporting copy                |
| `.t-eyebrow`| 11px / mono             | 500    | Section labels (green, caps)   |
| `.t-label`  | 10px / mono             | 500    | Data labels (dim, caps)        |
| `.t-mono`   | 12px / mono             | 400    | Technical values               |

### Typography Rules
- Display: letter-spacing `-0.03em`; line-height `1.04`
- Body: line-height `1.6`
- Eyebrow: letter-spacing `0.16em`, uppercase, `var(--primary)` color
- Labels: letter-spacing `0.14em`, uppercase, `var(--dim)` color

---

## 4. SPACING SYSTEM

```css
--nav-h:   68px   /* Navigation bar height */
--max-w:   1280px /* Max content width */

Section padding:       5.5rem 2rem     (.section)
Section small padding: 3rem 2rem       (.section-sm)
Card padding:          1.25rem         (.card-p)
Card padding large:    1.75rem         (.card-pl)
```

### Grid System
```css
.grid-2 { grid-template-columns: repeat(2, 1fr); gap: 1.5rem }
.grid-3 { grid-template-columns: repeat(3, 1fr); gap: 1.5rem }
.grid-4 { grid-template-columns: repeat(4, 1fr); gap: 1.5rem }
```

---

## 5. BORDER RADIUS

```css
--r-card:  16px     /* Cards, panels, modals */
--r-ctrl:  8px      /* Inputs, buttons, small elements */
--r-pill:  9999px   /* Badges, tags, pills */
```

---

## 6. COMPONENT LIBRARY

### 6.1 Buttons

```html
<!-- Primary (green) -->
<a href="#" class="btn btn-primary">Enroll Now</a>
<a href="#" class="btn btn-primary btn-lg">Enroll Now</a>

<!-- Secondary (blue) -->
<a href="#" class="btn btn-secondary">Book Demo</a>

<!-- Ghost (outlined) -->
<a href="#" class="btn btn-ghost">Learn More</a>

<!-- Outlined green tint -->
<a href="#" class="btn btn-outline-p">Explore →</a>

<!-- Outlined blue tint -->
<a href="#" class="btn btn-outline-s">View Details</a>
```

Sizes: `.btn` (default) · `.btn-lg` (large) · `.btn-sm` (small) · `.btn-full` (full width)

Hover effects: `translateY(-1px)` + colored box-shadow glow

### 6.2 Cards

```html
<!-- Standard surface card -->
<div class="card card-p">Content</div>

<!-- Glass morphism card (for hero overlays) -->
<div class="card-glass">Content</div>
```

Card hover: `translateY(-2px)` + `box-shadow: var(--shadow)`

### 6.3 Badges

```html
<!-- Green badge with animated dot -->
<span class="badge badge-g">
  <span class="badge-dot"></span>
  500+ Students
</span>

<!-- Blue badge -->
<span class="badge badge-b">Official Partner</span>
```

### 6.4 Tags

```html
<span class="tag tag-g">Arduino</span>     <!-- green -->
<span class="tag tag-b">ESP32</span>       <!-- blue -->
<span class="tag tag-d">Python</span>      <!-- dim/neutral -->
<span class="tag tag-amber">Planning</span> <!-- amber -->
<span class="tag tag-red">Advanced</span>  <!-- red -->
<span class="tag tag-purple">Master</span> <!-- purple -->
```

### 6.5 Progress Bars

```html
<div class="bar-track">
  <div class="bar-fill bar-g" style="width:78%"></div>  <!-- green -->
  <div class="bar-fill bar-b" style="width:65%"></div>  <!-- blue -->
</div>
```

### 6.6 Section Header Pattern

```html
<div class="section-header">
  <span class="t-eyebrow">Label Text</span>
  <h2 class="t-h2">Heading <span class="t-green">Accent</span></h2>
  <div class="section-sep"></div>
  <p class="t-body">Description text</p>
</div>
```

`.section-sep` = 40px green→blue gradient line

### 6.7 Stats Strip

```html
<div class="card stats-strip">
  <div class="stat-item">
    <div class="stat-num green">500+</div>
    <div class="stat-label">Students Trained</div>
  </div>
</div>
```

### 6.8 Forms

```html
<div class="form-field" id="field-id">
  <label class="form-label">Label *</label>
  <input class="form-input" type="text" placeholder="...">
  <span class="form-err">Error message</span>
</div>
```

Focus state: green border + `box-shadow: 0 0 0 3px var(--pdim)`  
Error state: red border + `.has-error` on parent `.form-field`

---

## 7. VISUAL EFFECTS

### 7.1 WebGL Neural Network Background

**File:** `webgl.js`  
**Element:** `<canvas id="bg-canvas">`  
**Effect:** Animated particle network with 90 nodes + 280 particles

- Nodes: green (#10B981) and blue (#0EA5E9), opacity ~0.52
- Connection lines: drawn between nodes within `14.5%` of viewport diagonal
- Particles: slow drifting green dots, opacity 0.04–0.26
- All motion: sinusoidal float using `time` counter
- Z-index: `0` (behind all content)

```javascript
// Tuning constants in webgl.js
const NODE_COUNT = 90;
const PARTICLE_COUNT = 280;
const GREEN = '16,185,129';
const BLUE  = '14,165,233';
```

### 7.2 Ambient Body Glows

```css
body::before {  /* Top-left green blob */
  background: radial-gradient(ellipse, rgba(16,185,129,.05) 0%, transparent 70%);
  width: 70vw; height: 70vh;
}
body::after {   /* Top-right blue blob */
  background: radial-gradient(ellipse, rgba(14,165,233,.04) 0%, transparent 70%);
  width: 60vw; height: 60vh;
}
```

### 7.3 Glass Morphism

```css
.card-glass {
  background: rgba(24,24,27,.65);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,.07);
}
```

### 7.4 Hero Orb (Homepage)

Concentric circles with slow rotation:
- Outer ring: `rotateSlow 30s linear infinite reverse` (dashed)
- Inner ring: `rotateSlow 18s linear infinite`
- Center glow: `radial-gradient(circle, rgba(16,185,129,.22), rgba(5,5,7,.8))`
- `box-shadow: 0 0 40px rgba(16,185,129,.25), 0 0 80px rgba(16,185,129,.1)`

### 7.5 Floating Cards (Homepage Hero)

6 cards positioned absolutely around the central orb:  
Animation: `float 5s ease-in-out infinite` with staggered delays (0s, 0.4s, 0.8s, 1.2s, 1.6s, 2.4s)

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
```

---

## 8. ANIMATION SYSTEM

### 8.1 CSS Keyframes (defined in styles.css)

```css
@keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes fadeUp    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes scaleIn   { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes rotateSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
```

### 8.2 Delay Utility Classes

```css
.d-1 { animation-delay: .1s }
.d-2 { animation-delay: .22s }
.d-3 { animation-delay: .36s }
.d-4 { animation-delay: .5s }
.d-5 { animation-delay: .65s }
.d-6 { animation-delay: .8s }
```

### 8.3 Scroll Reveal System (About Page)

Uses `IntersectionObserver` — no dependencies required.

```css
.sr       { opacity:0; transform:translateY(32px);  transition: opacity .7s, transform .7s }
.sr-left  { opacity:0; transform:translateX(-32px); transition: ... }
.sr-right { opacity:0; transform:translateX(32px);  transition: ... }
.sr-scale { opacity:0; transform:scale(.94);        transition: ... }

/* Triggered when element enters viewport: */
.sr.visible { opacity:1; transform:translateY(0) }
```

Threshold: `0.12` | Root margin: `0px 0px -40px 0px`

### 8.4 GSAP Scroll Animations (Homepage)

Loaded via CDN with `defer`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
```

Applied to: `.section-header` children, `.level-card`, `.partner-card`, `.stat-item`, `.hero-fc`

### 8.5 Page Transition System

**File:** `transitions.js`  
**Mechanism:** CSS transform + sessionStorage flag

```
User clicks link
  → Body scales down to 98.7%
  → Dark curtain sweeps IN from left (400ms, EASE_IN)
  → Browser navigates (at 380ms — curtain fully covers screen)
  → New page loads; curtain sweeps OUT to right (520ms, EASE_OUT)
  → Content staggers in via IntersectionObserver
```

Curtain design:
- Fill: `#050507` with green+blue ambient blobs
- Grid overlay: `rgba(16,185,129,.035)` neural grid pattern
- Leading edge: 3px glow line `#10B981 → #0EA5E9`
- Glow: `box-shadow: 0 0 12px 6px rgba(16,185,129,.65), 0 0 40px 16px rgba(14,165,233,.35)`

Easing curves:
```javascript
EASE_IN  = 'cubic-bezier(0.76,0,0.24,1)'   // Curtain enters
EASE_OUT = 'cubic-bezier(0.16,1,0.3,1)'    // Curtain exits
```

Timeline:
| Time    | Event                                 |
|---------|---------------------------------------|
| 0ms     | Body scale-down begins               |
| 0–400ms | Curtain sweeps in from left          |
| ~200ms  | Brand name appears on curtain        |
| 380ms   | Browser navigates to next page       |
| 40ms+   | Curtain exits (sweeps right)         |
| 80ms+   | Content staggers in (0–300ms delays) |

---

## 9. PAGE TRANSITION INTERACTIONS

### Hover States
- Cards: `translateY(-2px)` + shadow
- Buttons: `translateY(-1px)` + colored glow shadow
- Touch devices: hover transforms disabled via `@media(hover:none)`

### Active States (touch)
```css
.btn:active    { opacity:.82; transform:scale(.98) }
.card:active   { opacity:.9 }
```

### Modal
- Opens with `scaleIn` animation (0.25s)
- On mobile: slides up from bottom (bottom-sheet pattern)
- Closes on backdrop click or Escape key

---

## 10. RESPONSIVE BREAKPOINTS

```css
@media(max-width:1100px)  /* Large tablet */
@media(max-width:900px)   /* Tablet / landscape phone */
@media(max-width:640px)   /* Small tablet / large phone */
@media(max-width:480px)   /* Standard phone */
@media(max-width:380px)   /* Small phones (SE, Galaxy A) */

@media(max-width:812px) and (orientation:landscape)  /* Phone landscape */
@media(hover:none) and (pointer:coarse)              /* Touch devices */
@supports(padding:max(0px))                          /* iOS safe areas */
```

### Mobile-Specific Rules
- `font-size: 16px` on all inputs (prevents iOS zoom)
- Min touch target: `44×44px` on buttons and nav links
- iOS safe area: `env(safe-area-inset-*)` on nav, mobile menu, footer
- Hamburger menu: swipe-down to close + Escape key
- Modals: full-width bottom sheets on `< 640px`

---

## 11. NAVIGATION

**File:** `nav.js`  
**Type:** Fixed, JS-injected into all pages

### Nav Links
| Label      | Route            |
|------------|------------------|
| Home       | index.html       |
| About      | about.html       |
| Curriculum | curriculum.html  |
| Projects   | projects.html    |
| Contact    | contact.html     |
| Book Demo  | book-demo.html   |
| Enroll Now | enroll.html      |

### Scroll behavior
- Default: `background: rgba(5,5,7,.82)` + `backdrop-filter: blur(24px)`
- Scrolled (>50px): `.scrolled` class → `background: rgba(5,5,7,.96)`

---

## 12. SHADOWS

```css
--shadow:    0 4px 32px rgba(0,0,0,.6), 0 1px 4px rgba(0,0,0,.4)
--shadow-lg: 0 20px 60px rgba(0,0,0,.65)
```

---

## 13. MANTRA BAR

Appears above the footer on every page:

```
◆  Learn it. Build it. Own the Future.  ◆
     EVERY EXPERT WAS ONCE A BEGINNER WHO REFUSED TO GIVE UP.
```

Styling: green-tinted background, radial glow from top, decorative gradient lines flanking the quote.

---

## 14. FOOTER

Three-column layout (1.4fr 1fr 1fr):
1. **Brand** — name, tagline, description, email, phone, locations
2. **Academy** — About, Curriculum, Projects
3. **Connect** — Contact, Book Demo, Enroll

Copyright line includes: `Chennai & Erode, Tamil Nadu`

---

## 15. FILE STRUCTURE

```
/
├── index.html          ← Homepage
├── about.html          ← About + Founder (KOWSHICK J)
├── curriculum.html     ← 10-level roadmap with modals
├── projects.html       ← 10 capstone project showcases
├── book-demo.html      ← 3-step demo booking wizard
├── enroll.html         ← Course enrollment form
├── contact.html        ← Contact + Chennai/Erode maps
├── styles.css          ← Global design system
├── nav.js              ← Shared navigation (JS-injected)
├── webgl.js            ← Neural network background canvas
└── transitions.js      ← Page transition curtain system
```

---

## 16. CURRICULUM LEVELS

| # | Title                      | Ages  | Capstone                    |
|---|----------------------------|-------|-----------------------------|
| 1 | Little Inventor            | 6–8   | Smart Home Alarm System     |
| 2 | Junior Maker               | 7–9   | Automatic Night Lamp        |
| 3 | Electronics Explorer       | 8–10  | Smart Intruder Alert        |
| 4 | Coding Explorer            | 9–11  | Smart Classroom Automation  |
| 5 | Sensor Master              | 10–12 | Smart Dustbin               |
| 6 | Robot Builder              | 10–12 | RC Controlled Robot         |
| 7 | Autonomous Robotics Eng.   | 11–13 | Autonomous Delivery Robot   |
| 8 | IoT Explorer               | 12–14 | Smart Home Automation       |
| 9 | AI Explorer                | 13–15 | AI Object Detection System  |
|10 | AI Robotics Master         | 14–16 | AI Human Following Robot    |

---

*Generated by APEX Robotics Academy Design System — June 2024*
