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
const loader = document.querySelector(".loader");
const printPage = document.querySelector(".print-page");
const quizSubmit = document.querySelector(".quiz-submit");
const quizResult = document.querySelector(".quiz-result");
const quizScorebar = document.querySelector(".quiz-scorebar span");
const learnedProgress = document.querySelector(".learned-progress");
const certificateYear = document.querySelector(".certificate-year");

document.getElementById("current-year").textContent = new Date().getFullYear();

if (certificateYear) {
    certificateYear.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
    setTimeout(() => {
        loader.classList.add("hidden");
    }, 450);
});

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

document.querySelectorAll(".toc-grid a, .footer a[href^='#']").forEach((link) => {
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

printPage.addEventListener("click", () => {
    window.print();
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

    const title = card.querySelector("h3")?.textContent || "topic";
    const back = card.querySelector(".flip-card-back");
    const learnedKey = `learned:${title}`;
    const learnedButton = document.createElement("button");
    learnedButton.type = "button";
    learnedButton.className = "learned-btn";
    learnedButton.textContent = localStorage.getItem(learnedKey) === "true" ? "Learned" : "Mark as learned";

    if (localStorage.getItem(learnedKey) === "true") {
        card.classList.add("learned");
    }

    learnedButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const isLearned = !card.classList.contains("learned");
        card.classList.toggle("learned", isLearned);
        localStorage.setItem(learnedKey, String(isLearned));
        learnedButton.textContent = isLearned ? "Learned" : "Mark as learned";
        updateLearnedProgress();
    });

    back.appendChild(learnedButton);
});

const updateLearnedProgress = () => {
    const cards = document.querySelectorAll(".flip-card");
    const learnedCount = document.querySelectorAll(".flip-card.learned").length;
    learnedProgress.textContent = `${learnedCount} of ${cards.length} topics marked learned`;
};

document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", updateLearnedProgress);
});

updateLearnedProgress();

const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
}[character]));

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resetSearchHighlights = () => {
    document.querySelectorAll("[data-search-text]").forEach((element) => {
        element.textContent = element.dataset.searchText;
    });
};

const highlightSearchTerm = (card, searchTerm) => {
    if (!searchTerm) {
        return;
    }

    const pattern = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");

    card.querySelectorAll("h3, p").forEach((element) => {
        if (!element.dataset.searchText) {
            element.dataset.searchText = element.textContent;
        }

        const originalText = element.dataset.searchText;
        element.innerHTML = escapeHtml(originalText).replace(pattern, "<mark class=\"search-highlight\">$1</mark>");
    });
};

topicSearch.addEventListener("input", () => {
    const searchTerm = topicSearch.value.trim().toLowerCase();
    resetSearchHighlights();

    document.querySelectorAll(".flip-card").forEach((card) => {
        const text = card.textContent.toLowerCase();
        const isHidden = searchTerm !== "" && !text.includes(searchTerm);

        card.classList.toggle("hidden-topic", isHidden);

        if (!isHidden) {
            highlightSearchTerm(card, searchTerm);
        }
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

quizSubmit.addEventListener("click", () => {
    const answers = ["q1", "q2", "q3"];
    const score = answers.reduce((total, name) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return total + (selected?.value === "correct" ? 1 : 0);
    }, 0);

    document.querySelectorAll(".quiz-card label").forEach((label) => {
        const input = label.querySelector("input");
        label.classList.remove("correct-answer", "wrong-answer");

        if (input?.value === "correct") {
            label.classList.add("correct-answer");
        }

        if (input?.checked && input.value !== "correct") {
            label.classList.add("wrong-answer");
        }
    });

    const percent = Math.round((score / answers.length) * 100);
    const message = score === answers.length
        ? "Excellent work. You understand the key ideas."
        : score >= 2
            ? "Good effort. Review the highlighted answers and try again."
            : "Keep studying the sections above, then try again.";

    quizScorebar.style.width = `${percent}%`;
    quizResult.textContent = `You scored ${score} out of ${answers.length} (${percent}%). ${message}`;
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
