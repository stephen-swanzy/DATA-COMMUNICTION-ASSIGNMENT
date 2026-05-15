const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.querySelector(".back-to-top");
const themeToggle = document.querySelector(".theme-toggle");
const scrollProgress = document.querySelector(".scroll-progress");
const topicSearch = document.querySelector("#topic-search");
const countElements = document.querySelectorAll("[data-count]");
const copyLink = document.querySelector(".copy-link");
const footerClock = document.querySelector("#footer-clock");

document.getElementById("current-year").textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
}

const updateThemeLabel = () => {
    themeToggle.textContent = document.body.classList.contains("dark-theme") ? "Light" : "Dark";
};

updateThemeLabel();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
    updateThemeLabel();
});

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

document.querySelectorAll(".quick-jumps a").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

copyLink.addEventListener("click", async () => {
    const liveLink = "https://stephen-swanzy.github.io/DATA-COMMUNICTION-ASSIGNMENT/";

    try {
        await navigator.clipboard.writeText(liveLink);
        copyLink.textContent = "Link Copied";
    } catch {
        copyLink.textContent = "Copy Failed";
    }

    setTimeout(() => {
        copyLink.textContent = "Copy Live Link";
    }, 1800);
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

topicSearch.addEventListener("input", () => {
    const searchTerm = topicSearch.value.trim().toLowerCase();

    document.querySelectorAll(".flip-card").forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.classList.toggle("hidden-topic", searchTerm !== "" && !text.includes(searchTerm));
    });
});

const animateCount = (element) => {
    const target = Number(element.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 32));

    const update = () => {
        current = Math.min(target, current + step);
        element.textContent = current;

        if (current < target) {
            requestAnimationFrame(update);
        }
    };

    update();
};

const countObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.8 }
);

countElements.forEach((element) => countObserver.observe(element));

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

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

const updateFooterClock = () => {
    const now = new Date();
    footerClock.textContent = now.toLocaleString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

updateFooterClock();
setInterval(updateFooterClock, 60000);
