document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (path.includes("index.html") || path === "/" || path === "/index") {
        document.getElementById("nav-notas").classList.add("ativo");
    } else if (path.includes("marcadores")) {
        document.getElementById("nav-marcadores").classList.add("ativo");
    } else if (path.includes("lixeira")) {
        document.getElementById("nav-lixeira").classList.add("ativo");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector(".ph-list");
    const nav = document.querySelector("nav");

    menuBtn.addEventListener("click", function () {
        nav.classList.toggle("hidden");
    });
});