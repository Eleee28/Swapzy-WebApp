async function loadProductInfo() {
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

                document.getElementById("profile-image").src = user.profile_img || "../images/profile_picture_sample.jpg";
                document.getElementById("user-name").innerText = user.username || "Username here";
            }

            // Initialize Leaflet map for product location
            const location = product.location.coordinates;
            const latitude = location[1];
            const longitude = location[0];

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
            

            heartCheckBox.addEventListener('change', async function (event) {
                event.stopPropagation();

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

// Call function on page load
document.addEventListener('DOMContentLoaded', loadProductInfo);

// Carousel logic
let currentIndex = 0;

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

function goToUserPage() {
    window.location.href = `user.html?id=${document.getElementById("user-name").innerText}`
}