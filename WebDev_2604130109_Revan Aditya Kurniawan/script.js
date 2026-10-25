
const navbar = document.querySelector(".navbar");
const indicator = document.querySelector(".nav-indicator");
const links = document.querySelectorAll(".navbar a");
const galleryCards = document.querySelectorAll(".gallery-card");
const prevButton = document.getElementById("prevPage");
const nextButton = document.getElementById("nextPage");
const pageIndicator = document.getElementById("pageIndicator");
const galleryCount = document.getElementById("galleryCount");

const itemsPerPage = 3;
let currentPage = 0;

// Menggerakkan sliding indicator
function moveIndicator(link) {
    const navRect = navbar.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    indicator.style.width = `${linkRect.width}px`;
    indicator.style.height = `${linkRect.height}px`;

    indicator.style.transform =
        `translate(${linkRect.left - navRect.left - 1}px, ${linkRect.top - navRect.top - 1}px)`;
}

// Mengatur menu aktif
function setActive(link) {
    links.forEach(item => {
        item.classList.remove("active", "hovered");
    });

    link.classList.add("active");
    moveIndicator(link);
}

// Posisi awal indicator pada menu aktif
const activeLink = document.querySelector(".navbar a.active");

if (activeLink) {
    moveIndicator(activeLink);
}

// Interaksi mouse dan klik navbar
links.forEach(link => {

    // Saat mouse diarahkan ke menu
    link.addEventListener("mouseenter", () => {
        links.forEach(item => item.classList.remove("hovered"));
        link.classList.add("hovered");

        moveIndicator(link);
    });

    // Saat navbar diklik
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");

        // Pastikan link mengarah ke section dalam halaman
        if (!targetId || !targetId.startsWith("#")) return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        // Ubah menu aktif dan geser indicator
        setActive(link);

        // Hitung posisi section dengan memperhitungkan header
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

        // Scroll menuju section secara smooth
        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });

        // Perbarui hash URL
        history.pushState(null, "", targetId);
    });
});

// Saat mouse meninggalkan navbar
navbar.addEventListener("mouseleave", () => {
    const currentActive = navbar.querySelector("a.active");

    links.forEach(item => item.classList.remove("hovered"));

    if (currentActive) {
        moveIndicator(currentActive);
    }
});

// Sesuaikan posisi indicator saat ukuran layar berubah
window.addEventListener("resize", () => {
    const currentHovered = navbar.querySelector("a.hovered");
    const currentActive = navbar.querySelector("a.active");

    if (currentHovered) {
        moveIndicator(currentHovered);
    } else if (currentActive) {
        moveIndicator(currentActive);
    }
});

const totalPages = Math.ceil(
    galleryCards.length / itemsPerPage
);

function showGalleryPage() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;

    galleryCards.forEach((card, index) => {
        const isVisible = index >= start && index < end;

        card.hidden = !isVisible;

        // Hentikan video yang sedang diputar ketika
        // kartunya berpindah halaman.
        if (!isVisible) {
            const video = card.querySelector("video");

            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    });

    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === totalPages - 1;

    pageIndicator.textContent =
        `PAGE ${String(currentPage + 1).padStart(2, "0")} / ` +
        `${String(totalPages).padStart(2, "0")}`;

    const firstItem = start + 1;
    const lastItem = Math.min(end, galleryCards.length);

    galleryCount.textContent =
        `${String(firstItem).padStart(2, "0")} — ` +
        `${String(lastItem).padStart(2, "0")}`;
}

nextButton.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        showGalleryPage();
    }
});

prevButton.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        showGalleryPage();
    }
});

showGalleryPage();