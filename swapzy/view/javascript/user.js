function moveCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel .product-card');
    const cardWidth = cards[0].offsetWidth + 20; // Ajuste para el margen
    const maxIndex = cards.length - Math.floor(track.offsetWidth / cardWidth);

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