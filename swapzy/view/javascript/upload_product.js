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

// Initialize Leaflet map - default view, zoom level 2
const map = L.map('map').setView([0,0], 2);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker (will move to user selected location)
let marker = L.marker([0, 0], { draggable: true}).addTo(map);

// Function to update marker position and display coordinates
function updateMarker(lat, lng) {
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 13); // Zoom in on the location
    document.getElementById('product-location').value = `${lat}, ${lng}`; // Save coordinates in a hidden input
}

// Event listener for marker drag
marker.on('dragend', function (e) {
    const position = e.target.getLatLng();
    updateMarker(position.lat, position.lng);
});

// Geocoding function (example using OpenStreetMap's Nominatim API)
async function geocodeLocation(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const results = await response.json();
    return results.length > 0 ? results[0] : null;
}

// Search functionality
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('location-search').value;
    if (!query) return alert('Please enter a location.');

    const result = await geocodeLocation(query);
    if (result) {
        const { lat, lon } = result;
        updateMarker(lat, lon);
    } else {
        alert('Location not found.');
    }
});



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

document.addEventListener('DOMContentLoaded', populateStateDropdown);

