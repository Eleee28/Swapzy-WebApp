let currentIndex = 0;

function moveCarouselRecents(direction) {
    const track = document.querySelector('.recently-uploaded-section .carousel-track');
    const cards = document.querySelectorAll('.recently-uploaded-section .product-card');
    const cardWidth = cards[0].offsetWidth + 20;
    const maxIndex = cards.length - 5;

    // Asegúrate de que el índice está dentro de los límites
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }

    // Calcula el desplazamiento y muévelo
    const offset = -currentIndex * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
}

function moveCarouselFav(direction) {
    const track = document.querySelector('.favorites-section .carousel-track');
    const cards = document.querySelectorAll('.favorites-section .product-card');
    const cardWidth = cards[0].offsetWidth + 20;
    const maxIndex = cards.length - 5;

    // Asegúrate de que el índice está dentro de los límites
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }

    // Calcula el desplazamiento y muévelo
    const offset = -currentIndex * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
}
