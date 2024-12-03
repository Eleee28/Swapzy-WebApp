async function fetchFavoriteProducts() {
    try {
        const response = await fetch('/api/favorite');

        if (response.status === 401) {
            const text = document.querySelector('.favorites-section .message-text');
            const carousel = document.querySelector('.favorites-section .carousel-container');

            carousel.style.display = "none";
            text.style.display = "block";
            text.textContent = "You have to be logged in to see your favorites!";

            return;
        } else if (!response.ok){
            return response.status;
        }
        
        const products = await response.json();

        if (products.length == 0) {
            const text = document.querySelector('.favorites-section .message-text');
            const carousel = document.querySelector('.favorites-section .carousel-container');

            carousel.style.display = "none";
            text.style.display = "block";
            text.textContent = "No favorite products yet! Start adding your favorites to find them quickly.";
            
            return;
        }

        // Get carousel track element
        const carousel = document.querySelector('.favorites-section .carousel-track');
        carousel.innerHTML = ''; // Clear existing products

        products.forEach(prod => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute("data-product-id", prod.id);

            // On click event to redirect to product page
            productCard.onclick = () => {
                window.location.href = `product.html?id=${prod.id}`;  // from chat-gpt
            };

            const heartCheckedClass = 'checked'; // Always checked for favorites

            productCard.innerHTML = `
                <img src="${prod.image_url}" alt="Product Image" class="product-image">
                    <div class="product-info">
                        <span class="product-price">${prod.price}€</span>

                        <!-- From Uiverse.io by catraco https://uiverse.io/catraco/perfect-panda-49 --> 
                        <div title="Like" class="heart-container">
                            <input id="Give-It-An-Id" class="checkbox" type="checkbox" ${heartCheckedClass}>
                            <div class="svg-container">
                                <svg xmlns="http://www.w3.org/2000/svg" class="svg-outline" viewBox="0 0 24 24">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                    </path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" class="svg-filled" viewBox="0 0 24 24">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                    </path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" class="svg-celebrate">
                                    <polygon points="10,10 20,20"></polygon>
                                    <polygon points="10,50 20,50"></polygon>
                                    <polygon points="20,80 30,70"></polygon>
                                    <polygon points="90,10 80,20"></polygon>
                                    <polygon points="90,50 80,50"></polygon>
                                    <polygon points="80,80 70,70"></polygon>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <p class="product-title">${prod.name}</p>
            `;

            // Event listener for heart button
            const heartButton = productCard.querySelector('.heart-container');
            heartButton.onclick = async function(event) {
                event.stopPropagation(); // Prevent click from bubbling to product card -- chat-gpt

                const prodId = prod.id;

                try {
                    // Only allow product removal
                    const response = await fetch('/api/favorite/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ prodId })
                    });

                    if (response.ok) {
                        console.log('deleted from favorites');

                        // Remove product card
                        const favSection = document.getElementById('fav-carousel-track');
                        const prodInFav = favSection.querySelector(`[data-product-id="${prodId}"]`);
                        if (prodInFav) {
                            favSection.removeChild(prodInFav);

                            // Change heart state in recent products
                            const recProd = document.querySelector('.recently-uploaded-section .carousel-track').querySelector(`[data-product-id="${prodId}"]`);
                            if (recProd)
                                recProd.querySelector('.checkbox').checked = false;
                        }

                        if (favSection.hasChildNodes()) {
                            document.querySelector('.favorites-section .carousel-container').style.display = "block";
                            document.querySelector('.favorites-section .message-text').style.display = "none";
                        } else {
                            document.querySelector('.favorites-section .carousel-container').style.display = "none";
                            document.querySelector('.favorites-section .message-text').style.display = "block";
                            document.querySelector('.favorites-section .message-text').textContent = "No favorite products yet! Start adding your favorites to find them quickly.";
                        }

                        // Hide and show carousel to update view
                        document.querySelector('.recently-uploaded-section .carousel-container').style.display = 'none';
                        document.querySelector('.recently-uploaded-section .carousel-container').style.display = 'block';
                    } else {
                        console.log('Failed to remove from favorites');
                    }
                } catch (err) {
                    console.log("Error removing from favorites");
                }
            
            }

            // Append products to carousel
            carousel.appendChild(productCard);
        });
    } catch (errOk) {
        console.error('Error loading favorite products: ', errOk);
    }
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', fetchFavoriteProducts);