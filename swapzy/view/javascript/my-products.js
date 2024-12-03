async function loadUserProducts() {
    const response = await fetch('/api/check-login');
    const data = await response.json();

    try {
        const response = await fetch(`/api/products?seller=${encodeURIComponent(data.username)}`); // Encode for correct handling of characters
        if (response.ok) {
            const products = await response.json();
            
            if (products.length === 0) {
                document.querySelector('.product-list').innerHTML = '<p>This user has not uploaded any product yet.</p>';
                return;
            }
            
            const list = document.querySelector('.product-list');
            list.innerHTML = ''; // Clear product list

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute("data-product-id", product.id);

                // On click event to redirect to product page
                productCard.onclick = () => {
                    window.location.href = `product.html?id=${product.id}`;  // from chat-gpt
                };

                productCard.innerHTML = `
                    <div class="product-image">
                    <img src="${product.image_url}" alt="Product Image">
                    </div>
                    <div class="product-info">
                        <div class="product-name-and-bin">
                            <h3 class="product-title">${product.name}</h3>
                            <!-- Bin Button -->
                            <div class="bin-container">
                                <button class="bin-btn">
                                    <img src="images/bin_icon.png" alt="Delete Icon">
                                </button>
                            </div>
                        </div>
                        <p class="product-price">${product.price}</p>
                        <p class="product-status">${product.condition}</p>
                        <p class="product-description">${product.description}</p>
                    </div>
                `;

                // Add the event listener for the delete button
                const deleteButton = productCard.querySelector('.bin-btn');
                deleteButton.addEventListener('click', function(event) {
                    event.stopPropagation();  // Stop the click from propagating to the productCard
                    deleteProduct(product.id);
                });

                list.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Error fetching user products:', error);
        document.querySelector('.product-list').innerHTML = '<p>Error loading products.</p>';
    }
}

async function deleteProduct(prodId) {

    try {
        const response = await fetch('/api/delete-product', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prodId })
        });

        const data = await response.json();

        if (!response.ok) {
            // Display error message
            alert("Error deleting product");
        } else {
            loadUserProducts();
        }

    } catch (err) {
        console.error("Error:", err.message);
    }
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', loadUserProducts);