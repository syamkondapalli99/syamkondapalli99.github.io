// Mobile nav toggle

console.log("script.js?v=10 loaded");
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', open);
    });

}


// Close mobile nav after choosing a link
if (nav && toggle) {

    nav.querySelectorAll('.nav-link').forEach(link => {

        link.addEventListener('click', () => {

            nav.classList.remove('nav--open');
            toggle.setAttribute('aria-expanded', 'false');

        });

    });

}

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





// HERO AUTO SLIDER

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;


function changeSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });


    slides[index].classList.add("active");
    dots[index].classList.add("active");

}


function autoSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    changeSlide(currentSlide);

}


setInterval(autoSlide, 5000);


// manual dots click

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentSlide = index;
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

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const enquiryDropdown = document.getElementById("enquiry-type");

        const data = {

            name: document.getElementById("full-name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,

            // Gets visible text instead of value
            enquiryType: enquiryDropdown.options[enquiryDropdown.selectedIndex].text,

            message: document.getElementById("message").value

        };

        console.log("DATA SENT TO LAMBDA:", data);

        try {

            const response = await fetch(
                "https://f4o508lxz4.execute-api.ap-southeast-1.amazonaws.com/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            console.log("Lambda response:", result);

            if (response.ok) {

                showSuccessPopup();
                contactForm.reset();

            } else {

                alert(result.error || result.message || "Something went wrong.");

            }

        } catch (error) {

            console.error("Email failed:", error);

            alert("Unable to send message.");

        }

    });

}

const modal = document.getElementById("successModal");
const closeBtn = document.querySelector(".modal-close");

console.log("Modal:", modal);
console.log("Close button:", closeBtn);

function showSuccessPopup() {

    modal.classList.add("show");

    const timer = setTimeout(() => {
        modal.classList.remove("show");
    }, 10000);


    closeBtn.onclick = () => {
        clearTimeout(timer);
        modal.classList.remove("show");
    };
}

// ===============================
// CHATBOT
// ===============================

const chatButton = document.getElementById("chat-button");
const chatBox = document.getElementById("chat-box");
const closeChat = document.getElementById("close-chat");


// Open chatbot
if (chatButton && chatBox) {

    chatButton.addEventListener("click", () => {

        chatBox.style.display = "flex";

    });

}


// Close chatbot
if (closeChat && chatBox) {

    closeChat.addEventListener("click", () => {

        chatBox.style.display = "none";

    });

}


const sendButton = document.getElementById("send-chat");
const chatInput = document.getElementById("chat-input");
const chatContent = document.getElementById("chat-content");

// Button click sends message
if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}


// Enter key sends message
if (chatInput) {

    chatInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();

        }

    });

}


// Main send function
function sendMessage() {

    let message = chatInput.value.trim();

    if (message === "") return;


    // show user message
    chatContent.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;


    chatInput.value = "";


    let reply = getBotResponse(message);


    setTimeout(() => {

        chatContent.innerHTML += `
            <div class="bot-message">
                ${reply}
            </div>
        `;

        chatContent.scrollTop = chatContent.scrollHeight;

    }, 500);

}

function getBotResponse(message) {

    message = message.toLowerCase();



    // Greetings
    if (
        message.includes("hello") ||
        message.includes("hi") ||
        message.includes("hey") ||
        message.includes("good morning") ||
        message.includes("good afternoon")
    ) {

        return "Hello! 😊 Welcome to JKS Soft Tech. How can I assist you today?";

    }



    // Services
    else if (
        message.includes("service") ||
        message.includes("services") ||
        message.includes("offer") ||
        message.includes("what do you do") ||
        message.includes("what can you provide")
    ) {

        return `
We provide AI solutions, website development, software consulting, cloud solutions, and customised technology solutions for businesses.

For more information please visit our Services page<a href="services.html" class="chat-link-button">
    here
</a>.
`;

    }

    // Website development
    else if (
        message.includes("website") ||
        message.includes("web development") ||
        message.includes("web design") ||
        message.includes("build a website")
    ) {

        return "Yes, we design and develop responsive websites that are modern, accessible, user-friendly, and tailored to your business goals.";

    }



    // AI solutions
    else if (
        message.includes("ai") ||
        message.includes("artificial intelligence") ||
        message.includes("machine learning") ||
        message.includes("automation")
    ) {

        return "We provide AI-powered solutions to help businesses automate processes, improve efficiency, and create smarter digital experiences.";

    }



    // Software development
    else if (
        message.includes("software") ||
        message.includes("application") ||
        message.includes("app development")
    ) {

        return "We develop customised software solutions based on your business requirements, helping you improve operations and productivity.";

    }



    // Cloud services
    else if (
        message.includes("cloud") ||
        message.includes("aws") ||
        message.includes("server") ||
        message.includes("hosting")
    ) {

        return "We provide cloud-based solutions to help businesses improve scalability, reliability, and digital infrastructure.";

    }



    // Pricing
    else if (
        message.includes("price") ||
        message.includes("cost") ||
        message.includes("pricing") ||
        message.includes("how much") ||
        message.includes("quote")
    ) {

        return "Our pricing depends on your project requirements, features, and complexity. Contact us for a customised quotation.";

    }



    // Project timeline
    else if (
        message.includes("time") ||
        message.includes("how long") ||
        message.includes("duration") ||
        message.includes("timeline")
    ) {

        return "Project timelines depend on the size and complexity of the project. After discussing your requirements, we can provide an estimated timeframe.";

    }



    // Contact
else if (
    message.includes("contact") ||
    message.includes("phone") ||
    message.includes("reach") ||
    message.includes("talk")
) {

    return `You can contact us through our enquiry form or email us at 
    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@jkssofttech.com" 
       target="_blank" 
       class="email-link">
       info@jkssofttech.com
    </a>.

    You can also fill out the Contact Us form<a href="index.html#contact" class="chat-link-button">
        here
    </a>.

    Our team will respond within 3 business days.`;

}


    // Location
    else if (
        message.includes("location") ||
        message.includes("where are you") ||
        message.includes("based")
    ) {

        return "We are based in Singapore and provide technology solutions for businesses.";

    }



    // Support
    else if (
        message.includes("support") ||
        message.includes("help") ||
        message.includes("problem")
    ) {

        return "Our team provides technical support and assistance for our digital solutions. Please contact us with your requirements.";

    }



    // Company information
    else if (
        message.includes("company") ||
        message.includes("about") ||
        message.includes("who are you")
    ) {

        return "JKS Soft Tech is a technology consulting company focused on delivering innovative software, AI, and digital solutions for businesses.";

    }



    // Clients
    else if (
        message.includes("client") ||
        message.includes("business") ||
        message.includes("who do you work with")
    ) {

        return "We work with businesses looking for reliable technology solutions, including websites, software, and AI-powered services.";

    }



    // Security
    else if (
        message.includes("security") ||
        message.includes("safe") ||
        message.includes("privacy")
    ) {

        return "We prioritise secure development practices and design solutions with reliability and user privacy in mind.";

    }

    else if (
        message.includes("job") ||
        message.includes("jobs")

    ) {

        return "Regarding job applications, please fill out the form in the Contact Us page. Our staff will attend to you.";

    }

    //  Consulting////
    else if (
        message.includes("consulting") ||
        message.includes("consultation") ||
        message.includes("consultant") ||
        message.includes("business advice")
    ) {

        return `
We provide technology and business consulting to help businesses choose the right solutions, improve processes, and achieve their goals. Let us know what you need assistance with.

For more information please visit our Consulting page<a href="consulting.html" class="chat-link-button">
    here
</a>.
`;
    }

    // Technology////
    else if (
        message.includes("technology") ||
        message.includes("tech") ||
        message.includes("digital") ||
        message.includes("software") ||
        message.includes("system") ||
        message.includes("application") ||
        message.includes("app") ||
        message.includes("platform") ||
        message.includes("website") ||
        message.includes("web") ||
        message.includes("cloud") ||
        message.includes("it") ||
        message.includes("innovation") ||
        message.includes("digital transformation")
    ) {

        return `
We provide a range of technology solutions, including software development, website and web application development, AI solutions, cloud services, automation, and customised digital solutions. Let us know what you're looking for, and we'll be happy to help!

For more information on technology please visit our Technology page<a href="technology.html" class="chat-link-button">
    here
</a>.

For more information on Artificial Intelligence please visit our Artificial Intelligence page<a href="ai.html" class="chat-link-button">
    here
</a>.
`;

    }

    //  Outsourcing////
    else if (
        message.includes("outsourcing") ||
        message.includes("resource outsourcing") ||
        message.includes("outsource")

    ) {

        return `
We offer outsourcing services to help businesses access skilled professionals for software development, IT projects, and technology solutions. Whether you need a dedicated team or additional technical expertise, we're here to help.

For more information please visit our Outsourcing page<a href="outsourcing.html" class="chat-link-button">
    here
</a>.
`;
    }

    else if (
        message.includes("What outsourcing services do you offer?") ||
        message.includes("Outsourcong services")


    ) {

        return `
We provide outsourcing services such as dedicated development teams, software development, IT support, project management, and customised technology solutions tailored to your business needs. Feel free to tell us about your project, and we'll recommend the best approach.

For more information please visit our Outsourcing page<a href="outsourcing.html" class="chat-link-button">
    here
</a>.
`;
    }

    // Industries
    else if (
        message.includes("industry") ||
        message.includes("industries") ||
        message.includes("sector") ||
        message.includes("business sector") ||
        message.includes("market") ||
        message.includes("business type") ||
        message.includes("who are your clients") ||
        message.includes("target industries")
    ) {

        return `
JKS Soft Tech works across multiple industries, with strong expertise in financial services, fintech, digital payments, and high-tech sectors. We help organisations modernise systems, build digital solutions, and improve business operations through technology.

For more information please visit our Outsourcing page<a href="industries.html" class="chat-link-button">
    here
</a>.
    
`;
    }

    // Industries
    else if (
        message.includes("bank") ||
        message.includes("banks") ||
        message.includes("banking industry")

    ) {

        return `
We support the banking industry with digital transformation, financial technology solutions, API-driven architectures, and modern systems that help create seamless experiences for customers and businesses.

For more information please visit our Outsourcing page<a href="industries.html" class="chat-link-button">
    here
</a>.
    
`;
    }

    // Industries
    else if (
        message.includes("fintech")

    ) {

        return `
We help fintech businesses build secure and scalable platforms, including digital payments, financial applications, API integrations, and technology solutions designed for growth.

For more information please visit our Outsourcing page<a href="industries.html" class="chat-link-button">
    here
</a>.
    
`;
    }

    // Career
    else if (
        message.includes("career") ||
        message.includes("careers")

    ) {

        return `
JKS Soft Tech provides opportunities for students, graduates, and professionals to grow their skills through internships, training programmes, and career development opportunities.

For more information please visit our Careers page<a href="careers.html" class="chat-link-button">
    here
</a>.
    
`;
    }

    // Internship
    else if (
        message.includes("internship") ||
        message.includes("intern") ||
        message.includes("student") ||
        message.includes("fresher") ||
        message.includes("graduate")

    ) {

        return `
We offer internship programmes that provide hands-on experience through real-world projects, software development, consulting, digital transformation, and exposure to industry practices.

For more information please visit our Careers page<a href="internship.html" class="chat-link-button">
    here
</a>.
    
`;
    }

    // Training
    else if (
        message.includes("training") ||
        message.includes("course") ||
        message.includes("learning") ||
        message.includes("skill development") ||
        message.includes("upskill") ||
       message.includes("certification")
   
    ) {

        return `
We offer advanced training programmes designed to help students and professionals build skills in emerging technologies, software development, AI, cloud solutions, and enterprise systems.

For more information please visit our Careers page<a href="advanced-training.html" class="chat-link-button">
    here
</a>.
    
`;
    }

    // Thank you
    else if (
        message.includes("thank") ||
        message.includes("thanks")
    ) {

        return "You're welcome! 😊 Feel free to ask if you have any other questions.";

    }



    // Default response
    // Default response
    else {

        return `I'm sorry, for further enquiries, please contact our team through the enquiry form or drop us an email at 
    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@jkssofttech.com" 
       target="_blank" 
       class="email-link">
       info@jkssofttech.com
    </a>
    and we will be happy to assist you.`;

    }
}

//////////////////Why Choose Us carousel/////////////////////

////////////////// WHY CHOOSE US INFINITE CAROUSEL //////////////////

const whyTrack = document.getElementById("whyTrack");
const whyCardsOriginal = Array.from(document.querySelectorAll("#whyTrack .info-card"));

const leftBtn = document.querySelector(".why-left");
const rightBtn = document.querySelector(".why-right");

if (whyTrack && whyCardsOriginal.length) {

    const totalWhyCards = whyCardsOriginal.length;

    // Clone cards
    const clonesBefore = whyCardsOriginal.map(card => card.cloneNode(true));
    const clonesAfter = whyCardsOriginal.map(card => card.cloneNode(true));

    clonesBefore.reverse().forEach(card => {
        whyTrack.insertBefore(card, whyTrack.firstChild);
    });

    clonesAfter.forEach(card => {
        whyTrack.appendChild(card);
    });


    const whyCards = Array.from(
        whyTrack.querySelectorAll(".info-card")
    );


    let whyIndex = totalWhyCards;
    let animating = false;


  function getCardWidth() {

    const gap = window.innerWidth <= 600 ? 0 : 22;

    return whyCards[0].offsetWidth + gap;

}


    function moveWhyCarousel(animation = true) {

        whyTrack.style.transition = animation
            ? "transform 0.6s ease"
            : "none";


        whyTrack.style.transform =
            `translateX(-${whyIndex * getCardWidth()}px)`;

    }


    function nextWhy() {

        if (animating) return;

        animating = true;

        whyIndex++;

        moveWhyCarousel(true);

    }


    function prevWhy() {

        if (animating) return;

        animating = true;

        whyIndex--;

        moveWhyCarousel(true);

    }



    whyTrack.addEventListener("transitionend", () => {


        // reached end clones
        if (whyIndex >= totalWhyCards * 2) {

            whyIndex = totalWhyCards;

            moveWhyCarousel(false);

        }


        // reached beginning clones
        if (whyIndex <= 0) {

            whyIndex = totalWhyCards;

            moveWhyCarousel(false);

        }


        animating = false;

    });



    rightBtn.addEventListener("click", nextWhy);

    leftBtn.addEventListener("click", prevWhy);



    // automatic movement

    setInterval(() => {

        nextWhy();

    }, 4000);



    window.addEventListener("resize", () => {

        moveWhyCarousel(false);

    });



    // initial position

    moveWhyCarousel(false);

}

const accordionButtons = document.querySelectorAll(".accordion-trigger");


accordionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const item = button.closest(".accordion-item");

        const expanded = button.getAttribute("aria-expanded") === "true";


        // close others (optional)
        document.querySelectorAll(".accordion-item").forEach(other => {

            if (other !== item) {

                other.classList.remove("is-open");

                other.querySelector(".accordion-trigger")
                    .setAttribute("aria-expanded", "false");

            }

        });



        button.setAttribute(
            "aria-expanded",
            !expanded
        );


        item.classList.toggle(
            "is-open",
            !expanded
        );


    });

});

// ===============================
// Capability Dropdown
// ===============================

const capabilityButtons = document.querySelectorAll(".capability-toggle");

console.log("Capability buttons found:", capabilityButtons.length);


capabilityButtons.forEach(button => {

    button.addEventListener("click", function () {

        const item = this.closest(".capability-item");

        const isOpen = item.classList.contains("open");


        // close all dropdowns
        document.querySelectorAll(".capability-item").forEach(other => {

            other.classList.remove("open");

            const otherButton = other.querySelector(".capability-toggle");

            if (otherButton) {
                otherButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });


        // open clicked dropdown
        if (!isOpen) {

            item.classList.add("open");

            this.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});

// Character counter

// Character counter

const messageCounterBox = document.getElementById("message");

if (messageCounterBox) {

    messageCounterBox.addEventListener("input", function () {

        const text = this.value.trim();

        document.getElementById("messageWordCount").innerText =
            text === "" ? 0 : text.split(/\s+/).length;

        document.getElementById("messageCharCount").innerText =
            this.value.length;

    });

}

