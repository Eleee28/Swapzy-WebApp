async function populateStateDropdown() {
    try {
        const response = await fetch('/api/condition-enum');
        const stateEnumValues = await response.json();

        const stateDropdown = document.getElementById('state-options')

        stateDropdown.innerHTML = '';

        // const defaultOption = document.createElement('a');
        // defaultOption.textContent = 'Select Status';
        // stateDropdown.appendChild(defaultOption);

        stateEnumValues.forEach((state) => {
            const option = document.createElement('a');
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

const prodCategoryButton = document.getElementById('product-category-button');
const categoryOptions = document.getElementById('product-category-options');

let selectedCategory = null;

categoryOptions.addEventListener('click', (event) => {
    event.preventDefault();

    if (event.target.tagName === 'A' && event.target.dataset.value) {
        selectedCategory = event.target.dataset.value;

        prodCategoryButton.textContent = selectedCategory;
    }
})

/*
const stateButton = document.getElementById('state-button');
const stateOptions = document.getElementById('state-options');

let selectedState = null;

stateOptions.addEventListener('click', (event) => {
    event.preventDefault();

    if (event.target.tagName === 'A' && event.target.dataset.value) {
        selectedState = event.target.dataset.value;

        stateButton.textContent = selectedState;
    }
})
*/

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
    const category = selectedCategory;
    const price = document.getElementById("product-price").value;
    const description = document.getElementById("product-description").value;
    const state = document.getElementById("state-button").dataset.value;
    const photo = document.getElementById("product-photo").value;
    const location = document.getElementById("product-location").value;

    if (!name || !category || !price || !description || !state || !photo || !location) {
        alert('Please fill in all the fields');
        return;
    }

    try {
        const response = await fetch('/api/products/save', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ name, category, price, description, state, photo, location })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Product uploaded successfully!');
            console.log(result);
        } else {
            alert(result.message || 'Failed to upload product');
        }
    } catch (err) {
        console.error('Error: ', err);
        alert('An error occurred while uploading the product');
    }
});

async function navButtonHandler() {
    const favButton = document.getElementById("fav-button");
    const profileButton = document.getElementById("profile-button");
    const sellButton = document.getElementById("sell-button");

    const response = await fetch('/api/check-login');
    const data = await response.json();

    favButton.addEventListener('click', () => {
        console.log('Fav button clicked');
    });

    profileButton.addEventListener('click', () => {
        try {
            if (data.isLoggedIn) {
                window.location.href = 'settings.html';
            } else {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });

    sellButton.addEventListener('click', () => {
        try {
            if (data.isLoggedIn) {
                window.location.href = 'upload_product.html';
            } else {
                alert('You must be logged in to sell a product');
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });
}

document.addEventListener('DOMContentLoaded', navButtonHandler);

document.addEventListener('DOMContentLoaded', populateStateDropdown);

document.addEventListener('DOMContentLoaded', initializeMap);
