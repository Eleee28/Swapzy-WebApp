async function loadUserInfo() {
    // Get id from url paremeters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        console.error("User ID not found");
        window.location.href = "error.html";
    }

    try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
            const user = await response.json();

            // Load user information on UI elements
            document.getElementById("profile-pic").src = user.profile_img;
            document.getElementById("profile-name").innerText = user.username;
            document.getElementById("profile-email").innerText = user.email;

            // Get location values
            const location = user.location.coordinates;
            const latitude = location[1];
            const longitude = location[0];

            // Initialize Leaflet map for user location
            const map = L.map('map').setView([latitude, longitude], 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href=href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add marker at the product location
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup(`<b>${user.username}</b>`)
                .openPopup();
        }
    } catch (err) {
        console.error('Error loading user: ', err);
    }
}

async function loadUserProducts() {
    // Get id from url paremeters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    try {
        const response = await fetch(`/api/products?seller=${encodeURIComponent(userId)}`);
        if (response.ok) {
            const products = await response.json();
            console.log(products);
            
            if (products.length === 0) {
                document.querySelector('.results-container').innerHTML = '<p>This user has not uploaded any product yet.</p>';
                return;
            }
            
            const carousel = document.querySelector('.results-track');
            carousel.innerHTML = '';
        
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.setAttribute("data-product-id", product.id);

                // On click event to redirect to product page
                productCard.onclick = () => {
                    window.location.href = `product.html?id=${product.id}`;  // from chat-gpt
                };

                productCard.innerHTML = `
                    <img src="${product.image_url}" alt="Product Image" class="product-image">
                        <div class="product-info">
                            <span class="product-price">${product.price}€</span>
                        </div>
                        <p class="product-title">${product.name}</p>
                `;

                carousel.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Error fetching user products:', error);
        document.querySelector('.carousel-container').innerHTML = '<p>Error loading products.</p>';
    }
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', loadUserInfo);
document.addEventListener('DOMContentLoaded', loadUserProducts);