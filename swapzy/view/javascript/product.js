async function loadProductInfo() {
    // Get id from url paremeters
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get("id");

    if (!prodId) {
        console.error("Product ID not found");
        window.location.href = "error.html"
    }

    try {
        const response = await fetch(`/api/products/${prodId}`);
        if (response.ok) {
            const product = await response.json();

            // Load product information on UI elements
            document.getElementById("product-image").src = product.image_url;
            document.getElementById("product-price").innerText = `${product.price}€`;
            document.getElementById("product-title").innerText = product.name;
            document.getElementById("product-description").innerText = product.description;
            document.getElementById("product-category").innerText = product.category;
            document.getElementById("product-status").innerText = product.condition;

            // Get user details
            const userResponse = await fetch(`/api/users/${product.seller}`);
            if (userResponse.ok) {
                const user = await userResponse.json();

                // Load user information on UI elements
                document.getElementById("profile-image").src = user.profile_img || "../images/profile_picture_sample.jpg";
                document.getElementById("user-name").innerText = user.username;
            }

            // Get location values
            const location = product.location.coordinates;
            const latitude = location[1];
            const longitude = location[0];

            // Initialize Leaflet map for product location
            const map = L.map('map').setView([latitude, longitude], 13);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href=href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Add marker at the product location
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup(`<b>${product.name}</b>`)
                .openPopup();
            
            // Set heart state
            const heartCheckBox = document.querySelector('.checkbox');
            heartCheckBox.checked = false;

            // Get favorite products to check if this one is favorite
            const favoriteResponse = await fetch('/api/favorite/ids');
            if (favoriteResponse.ok) {
                const favorite = await favoriteResponse.json();
                const isFavorite = favorite.some(fav => fav.id == prodId);
                heartCheckBox.checked = isFavorite;
            }

            // Heart event listener
            heartCheckBox.addEventListener('change', async function (event) {
                event.stopPropagation(); // Avoid event from propagating to parent

                if (!favoriteResponse.ok) {
                    alert("You must be logged in to add products to favorites");
                    heartCheckBox.checked = false;
                    return;
                }

                const action = heartCheckBox.checked ? 'add' : 'delete';

                try {
                    const response = await fetch(`/api/favorite/${action}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ prodId })
                    });
                    if (!response.ok) {
                        console.log(`Failed to ${action} favorite`);
                        
                        heartCheckBox.checked = !heartCheckBox.checked;
                    } else {
                        console.log(`${action}ed to favorites`);

                        // Change heart state in recent products
                        const recProd = document.querySelector('.recently-uploaded-section .carousel-track').querySelector(`[data-product-id="${prodId}"]`);
                        if (recProd)
                            recProd.querySelector('.checkbox').checked = !recProd.querySelector('.checkbox').checked;

                        // Hide and show carousel to update view
                        document.querySelector('.recently-uploaded-section .carousel-container').style.display = 'none';
                        document.querySelector('.recently-uploaded-section .carousel-container').style.display = 'block';
                    }
                } catch (err) {
                    console.error('Error updating favorites: ', err);
                    heartCheckBox.checked = !heartCheckBox.checked;
                }
                
            })
        }
    } catch (err) {
        console.error('Error loading product: ', err);
    }
}

// TODO - move to general file
// Carousel logic
let currentIndex = 0;

function moveCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel .product-card');
    const cardWidth = cards[0].offsetWidth + 20; // Adjust for margin
    const maxIndex = cards.length - Math.floor(track.offsetWidth / cardWidth);

    // Make sure index is within limits
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }

    // Calculate movement and move
    const offset = -currentIndex * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
}

function goToUserPage() {
    window.location.href = `user.html?id=${document.getElementById("user-name").innerText}`
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', loadProductInfo);