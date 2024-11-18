async function fetchRecentProducts() {
    try {
        const favoriteResponse = await fetch('/api/favorite/ids');
        const favorite = await favoriteResponse.json();
        const response = await fetch('/api/products/recent');

        if (!response.ok && favoriteResponse.status !== 401) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();

        if (products.length == 0) {
            const text = document.querySelector('.recently-uploaded-section .message-text');
            const carousel = document.querySelector('.recently-uploaded-section .carousel-container');

            carousel.style.display = "none";
            text.style.display = "block";
            text.textContent = "No products uploaded!";
            
            return;
        }

        // Get carousel track element
        const carousel = document.querySelector('.recently-uploaded-section .carousel-track');
        carousel.innerHTML = '';

        products.forEach(prod => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute("data-product-id", prod.id);

            // On click event to redirect to product page
            productCard.onclick = () => {
                window.location.href = `product.html?id=${prod.id}`;  // from chat-gpt
            };

            var heartCheckedClass = '';

            if (favoriteResponse.ok) {
                const isFav = favorite.some(fav => fav.id === prod.id); // Check if product is favorite 
                heartCheckedClass = isFav ? 'checked' : ''; // Set checked state
            }

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
                
                //TODO - else add pop up to say you must be logged in to add a product to fav
                if (!favoriteResponse.ok) {
                    alert("You must be logged in to add products to favorites");
                    productCard.querySelector('.checkbox').checked = '';
                    return;
                }

                
                // Add to favorite
                const checkbox = productCard.querySelector('.checkbox');
                const isChecked = checkbox.checked;
                const prodId = prod.id;

                try {
                    const action = isChecked ? 'add' : 'delete';
                    const response = await fetch(`/api/favorite/${action}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ prodId })
                    });

                    if (response.ok) {
                        console.log(`${action}ed to favorites`);

                        const favSection = document.getElementById('fav-carousel-track');

                        // if action is add append child, if action is delete remove child
                        if (action === 'add') {
                            const prodCardCpy = productCard.cloneNode(true);
                            favSection.appendChild(prodCardCpy);
                        } else if (action === 'delete') {
                            const prodInFav = favSection.querySelector(`[data-product-id="${prodId}"]`);
                            if (prodInFav)
                                favSection.removeChild(prodInFav);
                        }
                        //location.reload(); // Reload page to apply changes

                    } else {
                        console.log(`Failed to ${action} favorite`);
                    }
                } catch (err) {
                    console.error('Error updating favorites: ', err);
                }
            }

            // Append products to carousel
            carousel.appendChild(productCard);
            
        });
    } catch (err) {
        console.error('Error loading recent products: ', err);
    }
}

document.addEventListener('DOMContentLoaded', fetchRecentProducts);