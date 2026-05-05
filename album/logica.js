const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.remove("locked");
        card.classList.add("unlocked");
    });
});