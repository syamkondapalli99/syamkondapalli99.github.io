# JKS Soft Tech — Multi-Page Website

Same design system as before (navy/teal/orange, Merriweather + Inter, card-based sections) — now split into separate pages instead of one long scrolling page, with content pulled from the real jkssofttech.com site (About Us, Services) plus a new Industries page.

## Structure

```
jks-multipage/
├── index.html         Home — hero, stats, quick overview, partners, contact form
├── about.html         About Us — story, Digital Readiness 2.0 philosophy, culture
├── services.html      Services — Consulting / Technology / Outsourcing in full detail + tech stack
├── industries.html     Industries — Financial Services & FinTech spotlight, cross-industry approach
├── style.css           shared design system (unchanged, plus a couple of new page-hero/active-nav rules)
├── script.js            shared mobile nav + contact form handling
├── assets/               AWS Partner Network + DigitalOcean logos
└── README.md
```

## Running it locally

Open `index.html` directly in a browser, or use VS Code's "Live Server" extension. All four pages share `style.css` and `script.js`, so edits to either apply everywhere.

## Navigation

Every page has the same header/footer nav: Home · About Us · Services · Industries · Contact. Contact stays a single form on the Home page (`index.html#contact`) — every "Get in Touch" link across the site points there rather than duplicating the form. The current page's nav link gets a permanent orange underline (`.nav-link.is-active`) so people can see where they are.

## Where the content came from

Rewritten (not copied) from the public jkssofttech.com site and its LinkedIn/Crunchbase profile:
- **About Us** — company story, "Digital Readiness 2.0" philosophy, employee-first culture.
- **Services** — expanded detail on Consulting, Technology, and Outsourcing, including the outsourcing sub-categories (application outsourcing, BPO, infrastructure outsourcing, learning & training) and the full tech-stack chip list.
- **Industries** — a Financial Services & FinTech spotlight (their most visible specialty per LinkedIn), plus a cross-industry section reflecting their own "any industry, any geography" positioning.

The client quote used on both `services.html` and `industries.html` is illustrative placeholder copy, not a real client testimonial — swap in a real one when you have it, or remove the quote-card if you'd rather not use a placeholder.

## Scroll animations, custom illustrations, and dropdowns

- **Scroll-reveal**: every major section fades/slides in as you scroll to it (`.reveal` class + an `IntersectionObserver` in `script.js`). Cards in the same row stagger slightly (`.reveal-delay-1/2/3`). Fully disabled under `prefers-reduced-motion`.
- **Custom illustrations** (no stock images — all inline SVG/CSS, built to match the "connecting / coding / cloud" brief):
  - *Connecting* — the hero circuit diagram (Home) and a smaller version in `about.html`'s "Our Story" card. Trace lines animate as flowing dashes, nodes pulse — starts playing once scrolled into view.
  - *Coding* — a typing code-window (`.code-scene`) in the Technology section of `services.html`, lines type themselves out in sequence.
  - *Cloud computing* — an orbiting-nodes illustration (`.cloud-scene`) in the "Any industry, any geography" section of `industries.html`.
- **Dropdowns**: accordion-style expandable content (`.accordion` / `.accordion-item`), used for:
  - A "Common questions" FAQ next to the contact form on `index.html`.
  - "Our outsourcing coverage" on `services.html` (previously a static checklist).
  - "Industries we serve" on `industries.html` (new section).

  All accordions are plain HTML/CSS/JS (button + `aria-expanded`, smooth height animation via CSS grid, toggle logic in `script.js`) — no library required.

## Reminder: the contact form still isn't wired up

`script.js` just shows a confirmation message on submit. See the earlier conversation for how to connect it to Formspree, Web3Forms, EmailJS, or your own backend — happy to wire it up once you've picked one and have an endpoint.
