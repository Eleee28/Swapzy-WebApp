// TODO - maybe move to separate file and reuse for all carousels in app
// Carousel functionality
let currentIndexRecents = 0;
let currentIndexFav = 0;

// TODO - add reference
function moveCarouselRecents(direction) {
    const track = document.querySelector('.recently-uploaded-section .carousel-track');
    const cards = document.querySelectorAll('.recently-uploaded-section .product-card');

    const cardWidth = cards[0].offsetWidth + 20; // Adjust by margin
    const visibleCards = Math.floor(track.offsetWidth / cardWidth);
    const maxIndex = cards.length - visibleCards - 1;

    currentIndexRecents += direction;
    if (currentIndexRecents < 0) {
        currentIndexRecents = 0;
    } else if (currentIndexRecents > maxIndex) {
        currentIndexRecents = maxIndex;
    }

    const offset = -currentIndexRecents * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
}

// TODO - add reference
function moveCarouselFav(direction) {
    const track = document.querySelector('.favorites-section .carousel-track');
    const cards = document.querySelectorAll('.favorites-section .product-card');

    const cardWidth = cards[0].offsetWidth + 20; // Adjust by margin
    const visibleCards = Math.floor(track.offsetWidth / cardWidth);
    const maxIndex = cards.length - visibleCards  - 1;

    currentIndexFav += direction;
    if (currentIndexFav < 0) {
        currentIndexFav = 0;
    } else if (currentIndexFav > maxIndex) {
        currentIndexFav = maxIndex;
    }

    const offset = -currentIndexFav * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
}

// Adjust carousel on window resizing
function updateCarouselOffsets() {
    const recentsTrack = document.querySelector('.recently-uploaded-section .carousel-track');
    const recentsCards = document.querySelectorAll('.recently-uploaded-section .product-card');

    if (recentsCards.length > 0) {
        const recentsCardWidth = recentsCards[0].offsetWidth + 20;
        const recentsOffset = -currentIndexRecents * recentsCardWidth;
        recentsTrack.style.transform = `translateX(${recentsOffset}px)`;
    }

    const favTrack = document.querySelector('.favorites-section .carousel-track');
    const favCards = document.querySelectorAll('.favorites-section .product-card');
    if (favCards.length > 0) {
        const favCardWidth = favCards[0].offsetWidth + 20;
        const favOffset = -currentIndexFav * favCardWidth;
        favTrack.style.transform = `translateX(${favOffset}px)`;
    }
}

// On page load event listeners
window.addEventListener('resize', updateCarouselOffsets);