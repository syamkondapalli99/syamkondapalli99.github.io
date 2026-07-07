// Mobile nav toggle
const toggle = document.querySelector('.menu-toggle');
const nav    = document.querySelector('.nav');
toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('nav--open');
    toggle.setAttribute('aria-expanded', open);
});

// Close mobile nav after choosing a link
nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
    });
});

// Scroll-triggered reveal animations (also gates the custom
// connect / code / cloud illustrations — they stay paused until
// their nearest .reveal ancestor scrolls into view)
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }
}

// Accordion / dropdown content
document.querySelectorAll('.accordion-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.accordion-item');
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        item.classList.toggle('is-open', !expanded);
    });
});

// Contact form (front-end only — wire up to a real endpoint or form service)
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formNote.textContent = "Thanks — we'll get back to you within one business day.";
        form.reset();
    });
}
