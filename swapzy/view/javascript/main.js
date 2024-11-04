let currentIndex = 0;

function moveCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.product-card');
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
