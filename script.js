// Mobile nav toggle

console.log("script.js loaded");
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



// HERO AUTO SLIDER

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;


function changeSlide(index){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });


    slides[index].classList.add("active");
    dots[index].classList.add("active");

}


function autoSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    changeSlide(currentSlide);

}


setInterval(autoSlide,5000);


// manual dots click

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        currentSlide=index;
        changeSlide(index);

    });

});

// PARTNERS CAROUSEL
const partnersTrack = document.getElementById("partnersTrack");
const partnerPrev = document.querySelector(".partner-arrow-left");
const partnerNext = document.querySelector(".partner-arrow-right");
const partnersCarousel = document.querySelector(".partners-carousel");

if (partnersTrack && partnerPrev && partnerNext) {
    const originalSlides = Array.from(partnersTrack.children);
    const totalSlides = originalSlides.length;

    const prependClones = originalSlides.slice(-3).map(slide => slide.cloneNode(true));
    const appendClones = originalSlides.slice(0, 3).map(slide => slide.cloneNode(true));

    prependClones.forEach(clone => partnersTrack.insertBefore(clone, partnersTrack.firstChild));
    appendClones.forEach(clone => partnersTrack.appendChild(clone));

    const slides = Array.from(partnersTrack.children);

    let currentIndex = 3;
    let isAnimating = false;
    let partnerAutoSlide;

    function getStep() {
        const slide = slides[0];
        const gap = parseFloat(getComputedStyle(partnersTrack).gap) || 0;
        return slide.offsetWidth + gap;
    }

    function updateClasses() {
        slides.forEach(slide => {
            slide.classList.remove("is-left", "is-center", "is-right");
        });

        if (slides[currentIndex]) slides[currentIndex].classList.add("is-left");
        if (slides[currentIndex + 1]) slides[currentIndex + 1].classList.add("is-center");
        if (slides[currentIndex + 2]) slides[currentIndex + 2].classList.add("is-right");
    }

    function updatePosition(animate = true) {
        partnersTrack.style.transition = animate ? "transform 0.5s ease" : "none";
        partnersTrack.style.transform = `translateX(-${currentIndex * getStep()}px)`;
        updateClasses();
    }

    function moveNext() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex += 1;
        updatePosition(true);
    }

    function movePrev() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex -= 1;
        updatePosition(true);
    }

    partnerNext.addEventListener("click", moveNext);
    partnerPrev.addEventListener("click", movePrev);

    partnersTrack.addEventListener("transitionend", () => {
        if (currentIndex >= totalSlides + 3) {
            currentIndex = 3;
            updatePosition(false);
        } else if (currentIndex <= 0) {
            currentIndex = totalSlides;
            updatePosition(false);
        }

        isAnimating = false;
    });

    window.addEventListener("resize", () => {
        updatePosition(false);
    });

    // AUTO SCROLL
    partnerAutoSlide = setInterval(moveNext, 1500);

    // PAUSE ON HOVER
    if (partnersCarousel) {
        partnersCarousel.addEventListener("mouseenter", () => {
            clearInterval(partnerAutoSlide);
        });

        partnersCarousel.addEventListener("mouseleave", () => {
            partnerAutoSlide = setInterval(moveNext, 3000);
        });
    }

    updatePosition(false);
}

document
.getElementById("contactForm")
.addEventListener("submit", async function(e){

    e.preventDefault();


    const name = document.getElementById("full-name").value;

    const email = document.getElementById("email").value;

    const message = document.getElementById("message").value;


    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);


    const response = await fetch(
        "http://localhost:3000/send-email",
        {
            method: "POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        }
    );


    const result = await response.json();

    console.log(result);

});