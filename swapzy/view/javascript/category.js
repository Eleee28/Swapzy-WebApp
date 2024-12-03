let allProducts = [];
let selectedLat = 0;
let selectedLng = 0;

async function populateStateDropdown() {
    try {
        const response = await fetch('/api/condition-enum');
        const stateEnumValues = await response.json();

        const stateDropdown = document.getElementById('state-options')

        stateDropdown.innerHTML = '';

        stateEnumValues.forEach((state) => {
            // Create a label element to wrap the checkbox
            const label = document.createElement('label');
            label.style.cursor = 'pointer'; // Make the label clickable
            label.classList.add('dropdown-item'); // Optional: Add a class for styling

            // Create the checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = state; // Set the value of the checkbox to the product status
            checkbox.id = `state-${state.replace(/\s+/g, '-')}`; // Set a unique id for the checkbox

            // Create the text node for the label (e.g., "New", "Used")
            const textNode = document.createTextNode(` ${state}`);

            // Append the checkbox and text to the label
            label.appendChild(checkbox);
            label.appendChild(textNode);

            // Add the label to the dropdown
            stateDropdown.appendChild(label);

            // Event listener for checkbox change
            checkbox.addEventListener('change', filterProducts);
        });
    } catch(err) {
        console.error('Error fetching state enum values: ', err);
    }
}

const priceSlider = document.getElementById('price-slider');
const priceLabel = document.getElementById('price-label');

priceSlider.addEventListener('input', function() {
    if (priceSlider.value == priceSlider.max) {
        priceLabel.textContent = 'No limit';
    } else {
        priceLabel.textContent = priceSlider.value;
    }
    filterProducts();
});

const checkStatus = document.querySelectorAll('.product-status-dropdown input[type="checkbox"]');

checkStatus.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});

document.querySelector('.cleanbtn').addEventListener('click', function() {
    // Clear all filters
    document.querySelector('.location-search-input').value = '';
    priceSlider.value = 10000;
    document.querySelectorAll('.product-status-dropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    displayProducts(allProducts);
});


async function fetchProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (!category) {
        console.error("Category not found");
        window.location.href = "error.html";
    }

    const title = document.getElementById('category-title');

    title.textContent = capitalizeFirstLetter(category);

    if (category !== "favorite") {
        try {
            const response = await fetch(`/api/products?category=${encodeURIComponent(category.trim())}`);
            if (response.ok) {
                const products = await response.json();
                allProducts = products;
                displayProducts(products);
            }
        } catch (error) {
            console.error('Error fetching products by category:', error);
            document.querySelector('.product-list').innerHTML = '<p>Error loading products.</p>';
        }

    } else {
        try {
            const response = await fetch('/api/favorite');
            if (response.ok) {
                const products = await response.json();
                allProducts = products;
                displayProducts(products);
        }
        } catch (error) {
            console.error('Error fetching products by category:', error);
            document.querySelector('.product-list').innerHTML = '<p>Error loading products.</p>';
        }
    }
}

function filterProducts() {
    const price = priceSlider.value;

    // Get checked product status filters
    const statusFilters = [];
    document.querySelectorAll('.product-status-dropdown input[type="checkbox"]:checked').forEach(checkbox => {
        statusFilters.push(checkbox.value);
    });

    let filteredProducts = [];

    allProducts.forEach(product => {
        // Location filter
        let matchesLocation = true;
        if (selectedLat !== 0 && selectedLng !== 0) {
            const prodLocation = product.location.coordinates;
            const prodLat = parseFloat(prodLocation[1]);
            const prodLng = parseFloat(prodLocation[0]);
            const selLat = parseFloat(selectedLat);
            const selLng = parseFloat(selectedLng);

            if (prodLat && prodLng) {
                const distance = calculateDistance(selLat, selLng, prodLat, prodLng);
                console.log("distance: ", distance);
                matchesLocation = (parseFloat(distance) <= 50);
            } else {
                matchesLocation = false;
            }
        } else {
            matchesLocation = false;
        }

        // Price filter
        let matchesPrice = false;
        if (price) {

            const productPrice = parseFloat(product.price);
            const sliderPrice = parseFloat(price);
            if (price === priceSlider.max)
                matchesPrice = true;
            else {
                matchesPrice = (productPrice <= sliderPrice);
            }
        }

        // Product status filter
        let matchesStatus = false;
        if (statusFilters.length > 0) {
            matchesStatus = statusFilters.includes(product.condition);
        } else {
            matchesStatus = true;
        }

        //if (matchesLocation && matchesPrice && matchesStatus)
        if (matchesLocation && matchesPrice && matchesStatus)
            filteredProducts.push(product);

    })

    displayProducts(filteredProducts);
}

// Haversine formula to calculate the distance between two lat/lng points (in kilometers)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function displayProducts(products) {
    const productList = document.querySelector('.product-list');

    // Clear existing products
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p>No products found for this category.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
        <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}€</p>
                <p class="product-status">${capitalizeFirstLetter(product.condition)}</p>
                <p class="product-description">${product.description || 'No description available.'}</p>
            </div>
        `;

        // On click event to redirect to product page
        productCard.onclick = () => {
            window.location.href = `product.html?id=${product.id}`;
        };

        productList.appendChild(productCard)
    });
}

async function getUserLocation() {
    try {
        const response = await fetch('/api/location');
        if (response.ok) {
            const { lat, lng } = await response.json();
            return { lat, lng };
        }
        if (response.status === 404 || response.status === 401)
            return { lat: 0, lng: 0 };
    } catch (err) {
        console.error(err);
        return { lat: 0, lng: 0 };
    }
}

async function initializeMap() {
    const { lat, lng } = await getUserLocation();

    selectedLat = lat;
    selectedLng = lng;

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
        selectedLat = position.lat;
        selectedLng = position.lng;
        updateMarker(position.lat, position.lng);
        filterProducts();
    });

    // Map click event
    map.on('click', function (e) {
        selectedLat = e.latlng.lat;
        selectedLng = e.latlng.lng;
        updateMarker(e.latlng.lat, e.latlng.lng);
        document.getElementById('location-search-input').value = '';
        filterProducts();
    });

    // Geocoding function (example using OpenStreetMap's Nominatim API)
    async function geocodeLocation(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const results = await response.json();
        return results.length > 0 ? results[0] : null;
    }

    // Location search
    const locationInput = document.getElementById('location-search-input');
    locationInput.addEventListener('keypress', async function (e) {
        if (e.key == 'Enter') {
            e.preventDefault();

            const query = locationInput.value;
            if (query) {
                const result = await geocodeLocation(query);
                if (result) {
                    const { lat, lon } = result;
                    selectedLat = lat;
                    selectedLng = lng;
                    updateMarker(lat, lon);
                    filterProducts();
                } else {
                    alert('Location not found');
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchProducts);
document.addEventListener('DOMContentLoaded', initializeMap);
document.addEventListener('DOMContentLoaded', populateStateDropdown);