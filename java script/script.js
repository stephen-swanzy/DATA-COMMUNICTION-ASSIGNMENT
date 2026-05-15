const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.querySelector(".back-to-top");

document.getElementById("current-year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

links.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const panel = trigger.nextElementSibling;
        const icon = trigger.querySelector(".accordion-icon");
        const isOpen = panel.classList.toggle("open");

        trigger.setAttribute("aria-expanded", String(isOpen));
        icon.textContent = isOpen ? "-" : "+";
    });
});

document.querySelectorAll(".flip-card").forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            card.classList.toggle("is-flipped");
            card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
        }
    });
});

const activeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            links.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0
    }
);

sections.forEach((section) => activeObserver.observe(section));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.14
    }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
