function clearFields() {
    document.getElementById("product-name").value = '';
    document.getElementById("product-price").value = '';
    document.getElementById("product-description").value = '';
    document.getElementById("product-photo").value = '';
    document.getElementById("product-location").value = '';
}

async function populateCategoryDropdown() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();

        const categoryDropdown = document.getElementById('product-category-options')

        categoryDropdown.innerHTML = '';

        categories.forEach((category) => {
            const option = document.createElement('a');
            option.classList.add('dropdown-item', 'd-flex', 'align-items-center');
            option.style.cursor = 'pointer';
            
            const icon = document.createElement('img');
            icon.src = `https://fonts.gstatic.com/s/i/materialicons/${category.image}/v6/24px.svg`; // Material Icons URL
            icon.alt = ' ';
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.marginRight = '10px';
            icon.style.transform = 'translateY(35%)';
            

            const name = document.createElement('span');
            name.textContent = category.name_id;

            option.appendChild(icon);
            option.appendChild(name);
            
            option.addEventListener('click', () => {
                document.getElementById('product-category-button').textContent = category.name_id;
                document.getElementById('product-category-button').dataset.value = category.name_id;
            });
            categoryDropdown.appendChild(option);
        });
    } catch(err) {
        console.error('Error fetching categories: ', err);
    }
}

async function populateStateDropdown() {
    try {
        const response = await fetch('/api/condition-enum');
        const stateEnumValues = await response.json();

        const stateDropdown = document.getElementById('state-options')

        stateDropdown.innerHTML = '';

        stateEnumValues.forEach((state) => {
            const option = document.createElement('a');
            option.style.cursor = 'pointer';
            option.textContent = state;
            option.classList.add('dropdown-item');
            option.addEventListener('click', () => {
                document.getElementById('state-button').textContent = state;
                document.getElementById('state-button').dataset.value = state;
            });
            stateDropdown.appendChild(option);
        });
    } catch(err) {
        console.error('Error fetching state enum values: ', err);
    }
}

async function getUserLocation() {
    try {
        const response = await fetch('/api/location');
        if (response.ok) {
            const { lat, lng } = await response.json();
            return { lat, lng };
        }
        if (response.status === 404)
            return { lat: 0, lng: 0 };
    } catch (err) {
        console.error(err);
        return { lat: 0, lng: 0 };
    }
}

async function getCityFromCoordinates(lat, lng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            return data.address.city || data.address.town || data.address.village || data.address.country || '';
        } else {
            console.error('Failed to retrieve city from coordinates');
            return null;
        }
    } catch (err) {
        console.error('Error during geocoding: ', err);
        return null;
    }
}

let marker;

async function initializeMap() {
    const { lat, lng } = await getUserLocation();

    // Initialize Leaflet map
    var zoom = ((lat === 0 && lng === 0) ? 2 : 13);
    const map = L.map('map').setView([lat,lng], zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a marker (will move to user selected location)
    marker = L.marker([lat, lng], { draggable: true}).addTo(map);

    // Function to update marker position and display coordinates
    function updateMarker(lat, lng) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 13); // Zoom in on the location
    }

    // Event listener for marker drag
    marker.on('dragend', function (e) {
        const position = e.target.getLatLng();
        updateMarker(position.lat, position.lng);
    });

    // Map click event
    map.on('click', function (e) {
        updateMarker(e.latlng.lat, e.latlng.lng);
        document.getElementById('product-location').value = '';
    });

    // Geocoding function (example using OpenStreetMap's Nominatim API)
    async function geocodeLocation(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const results = await response.json();
        return results.length > 0 ? results[0] : null;
    }

    // Location search
    const locationInput = document.getElementById('product-location');
    locationInput.addEventListener('keypress', async function (e) {
        if (e.key == 'Enter') {
            e.preventDefault();

            const query = locationInput.value;
            if (query) {
                const result = await geocodeLocation(query);
                if (result) {
                    const { lat, lon } = result;
                    updateMarker(lat, lon);
                } else {
                    alert('Location not found');
                }
            }
        }
    });
}

const uploadButton = document.getElementById("upload-button");

uploadButton.addEventListener('click', async () => {
    const name = document.getElementById("product-name").value;
    const category = document.getElementById("product-category-button").dataset.value;
    const price = document.getElementById("product-price").value;
    const description = document.getElementById("product-description").value;
    const state = document.getElementById("state-button").dataset.value;
    const photo = document.getElementById("product-photo").value;
    
    // Get location using marker
    const lat = marker.getLatLng().lat;
    const lng = marker.getLatLng().lng;

    if (!name || !category || !price || !description || !state || !photo || !location) {
        showPopupMessage('Please fill in all the fields', 'upload_product.html');
    }

    try {
        const response = await fetch('/api/products/save', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ 
                name: name, 
                category: category, 
                price: price, 
                description: description, 
                condition: state, 
                image_url: photo, 
                location: {
                    lat: lat,
                    lng: lng
                } 
            })
        });

        const result = await response.json();

        if (response.ok) {
            showPopupMessage('Product uploaded successfully!', '/');
        } else {
            alert(result.message || 'Failed to upload product');
        }
    } catch (err) {
        console.error('Error: ', err);
        alert('An error occurred while uploading the product');
    }
});

function showPopupMessage(message, location) {
    const popup = document.getElementById('info-popup');
    const closePopupButton = document.getElementById('close-popup');

    document.getElementById("info-popup-message").textContent = message;
    popup.style.display = "flex";
    
    setTimeout(() => {
        window.location.href = location;
    }, 3000); // Redirect after 3 seconds

    closePopupButton.addEventListener('click', () => {
        popup.style.display = "none";
        window.location.href = location;
    })
}

document.addEventListener('DOMContentLoaded', clearFields);

document.addEventListener('DOMContentLoaded', populateCategoryDropdown);

document.addEventListener('DOMContentLoaded', populateStateDropdown);

document.addEventListener('DOMContentLoaded', initializeMap);
