// Event listener for search button
document.querySelector('.search-btn').addEventListener('click', handleSearch);

// Event listener for input field (Enter key press)
document.querySelector('.container-input .input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter')
        handleSearch();
});

async function handleSearch() {
    const searchInput = document.querySelector('.container-input .input').value.trim();

    if (!searchInput)
        return;

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(searchInput)}`);

        if (response.ok) {
            const searchResults = await response.json();
            displaySearchResults(searchResults);
        }
    } catch (err) {
        console.error("Error performing search: ", err);
    }
}

function displaySearchResults(products) {
    const searchResultsSection = document.querySelector('.search-results-section');
    const messageText = searchResultsSection.querySelector('.message-text');
    const resultsTrack = searchResultsSection.querySelector('.results-track');

    // Clear existing content
    resultsTrack.innerHTML = '';

    if (products.length === 0) {
        messageText.textContent = 'No products found for your search!';
        messageText.style.display = 'block';
        searchResultsSection.style.display = 'block';
        return;
    }

    // Hide message text and display results section
    messageText.style.display = 'none';
    searchResultsSection.style.display = 'block';

    // Add products to result container
    products.forEach(prod => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', prod.id);

        productCard.innerHTML = `
            <img src="${prod.image_url}" alt="Product Image" class="product-image">
            <div class="product-info">
                <span class="product-price">${prod.price}€</span>

            </div>
            <p class="product-title">${prod.name}</p>
        `;

        // On click event to redirect to product page
        productCard.onclick = () => {
            window.location.href = `product.html?id=${prod.id}`;  // from chat-gpt
        };

        resultsTrack.appendChild(productCard);
    });
}