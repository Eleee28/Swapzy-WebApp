const priceSlider = document.getElementById('price-slider');
const priceLabel = document.getElementById('price-label');

priceSlider.addEventListener('input', function() {
    if (priceSlider.value == priceSlider.max) {
        priceLabel.textContent = 'No limit';
    } else {
        priceLabel.textContent = priceSlider.value;
    }
});