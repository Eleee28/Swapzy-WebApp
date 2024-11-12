async function loadProductInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get("id");

    if (!prodId) {
        console.error("Product ID not found");
        return;
    }

    try {
        const response = await fetch(`/api/products/${prodId}`);
        if (response.ok) {
            const product = await response.json();

            document.getElementById("product-image").src = product.image_url;
            document.getElementById("product-price").innerText = `${product.price}€`;
            document.getElementById("product-title").innerText = product.name;
            document.getElementById("product-description").innerText = product.description;

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
            
            // Get favorite products to check if this one is favorite
            const favoriteResponse = await fetch('/api/favorite/ids');
            const favorite = await favoriteResponse.json();
            const isFavorite = favorite.some(fav => fav.id == prodId);

            // Set heart state
            const heartCheckBox = document.querySelector('.checkbox');
            heartCheckBox.checked = isFavorite;

            heartCheckBox.addEventListener('change', async function (event) {
                event.stopPropagation();
                
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
                    }
                } catch (err) {
                    console.error('Error updating favorites: ', err);
                    heartCheckBox.checked = !heartCheckBox.checked;
                }
                
            })

            // Heart event listener
            // document.querySelector('.main-heart-container').onclick = async function (event) {
            //     event.stopPropagation();

            //     const isChecked = heartCheckBox.checked;
            //     heartCheckBox.checked = !isChecked;
            //     const action = isChecked ? 'add' : 'delete';

            //     try {
            //         const response = await fetch(`/api/favorite/${action}`, {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json'
            //             },
            //             body: JSON.stringify({ prodId })
            //         });

            //         if (!response.ok) {
            //             console.log(`Failed to ${action} favorite`);
                        
            //             heartCheckBox.checked = isChecked;
            //         } else {
            //             console.log(`${action}ed to favorites`);
            //         }
            //     } catch (err) {
            //         console.error('Error updating favorites: ', err);
            //         heartCheckBox.checked = isChecked;
            //     }
            // }
        }
    } catch (err) {
        console.error('Error loading product: ', err);
    }
}

// Call function on page load
document.addEventListener('DOMContentLoaded', loadProductInfo);