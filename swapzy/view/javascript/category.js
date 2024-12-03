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
            // Label element for states
            const label = document.createElement('label');
            label.style.cursor = 'pointer';
            label.classList.add('dropdown-item');

            // Checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = state;
            checkbox.id = `state-${state.replace(/\s+/g, '-')}`;

            const textNode = document.createTextNode(` ${state}`);

            // Append checkbox and text to label
            label.appendChild(checkbox);
            label.appendChild(textNode);

            // Add label to dropdown
            stateDropdown.appendChild(label);

            // Event listener for checkbox change
            checkbox.addEventListener('change', filterProducts);
        });
    } catch(err) {
        console.error('Error fetching state enum values: ', err);
    }
}

// Price slider elements
const priceSlider = document.getElementById('price-slider');
const priceLabel = document.getElementById('price-label');

// Price slider event listener
priceSlider.addEventListener('input', function() {
    if (priceSlider.value == priceSlider.max) {
        priceLabel.textContent = 'No limit';
    } else {
        priceLabel.textContent = priceSlider.value;
    }
    filterProducts();
});

// Status checkbox element
const checkStatus = document.querySelectorAll('.product-status-dropdown input[type="checkbox"]');


// TODO - remove if it works
// checkStatus.forEach(checkbox => {
//     checkbox.addEventListener('change', filterProducts);
// });

// Clean button event listener
document.querySelector('.cleanbtn').addEventListener('click', function() {
    document.querySelector('.location-search-input').value = ''; // Clear all filters
    priceSlider.value = priceSlider.max;
    document.querySelectorAll('.product-status-dropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    displayProducts(allProducts);
});


async function fetchProducts() {
    // Get category from url paremeters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (!category) {
        console.error("Category not found");
        window.location.href = "error.html";
    }

    // Set category title
    const title = document.getElementById('category-title');
    title.textContent = capitalizeFirstLetter(category);

    // Categories page
    if (category !== "favorite") {
        try {
            const response = await fetch(`/api/products?category=${encodeURIComponent(category.trim())}`); // Encode for correct handling of characters
            if (response.ok) {
                const products = await response.json();
                allProducts = products;
                displayProducts(products);
            }
        } catch (error) {
            console.error('Error fetching products by category:', error);
            document.querySelector('.product-list').innerHTML = '<p>Error loading products.</p>';
        }

    } else { // Favorites page
        try {
                const loginResponse = await fetch('/api/check-login');
                const data = await loginResponse.json();

                if (data.isLoggedIn) {
                    const response = await fetch('/api/favorite');
                    if (response.ok) {
                        const products = await response.json();
                        allProducts = products;
                        displayProducts(products); 
                    }
                } else {
                    window.location.href = 'error.html';
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

    let filteredProducts = []; // Array for filtered products

    allProducts.forEach(product => {
        // Location filter
        let matchesLocation = true;
        if (selectedLat !== 0 && selectedLng !== 0) {
            // Parse location values
            const prodLocation = product.location.coordinates;
            const prodLat = parseFloat(prodLocation[1]);
            const prodLng = parseFloat(prodLocation[0]);
            const selLat = parseFloat(selectedLat);
            const selLng = parseFloat(selectedLng);

            if (prodLat && prodLng) {
                const distance = calculateDistance(selLat, selLng, prodLat, prodLng);
                matchesLocation = (parseFloat(distance) <= 50); // Match products in 50km radius
            } else {
                matchesLocation = false;
            }
        } else {
            matchesLocation = false;
        }

        // Price filter
        let matchesPrice = false;
        if (price) {
            // Parse price values
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

        if (matchesLocation && matchesPrice && matchesStatus)
            filteredProducts.push(product);

    })

    displayProducts(filteredProducts);
}

// Reference from: https://www.sisense.com/blog/latitude-longitude-distance-calculation-explained/
// Haversine formula to calculate the distance between two lat/lng points (in kilometers)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of Earth in km

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

let map;

async function initializeMap(lat, lng) {
    const mapContainer = document.querySelector('.location-map');

    const mapElement = document.getElementById('map');

    // Clear any exixting map
    if (map) {
        map.remove(); // Remove map instance and event listeners
        mapElement.innerHTML = ''; // Clear content
    }

    mapContainer.style.display = 'flex';

    selectedLat = lat;
    selectedLng = lng;

    // Initialize Leaflet map
    var zoom = ((lat === 0 && lng === 0) ? 2 : 13);
    map = L.map('map').setView([lat,lng], zoom);

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
}

// Geocoding function
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
                selectedLng = lon;
                //updateMarker(lat, lon);
                initializeMap(lat, lon);
                filterProducts();
            } else {
                alert('Location not found');
            }
        }
    }
});

// On page load event listeners
document.addEventListener('DOMContentLoaded', fetchProducts);
document.addEventListener('DOMContentLoaded', populateStateDropdown);