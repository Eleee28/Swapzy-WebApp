async function navButtonHandler() {
    // Navigation buttons
    const favButton = document.getElementById("fav-button");
    const profileButton = document.getElementById("profile-button");
    const sellButton = document.getElementById("sell-button");

    const response = await fetch('/api/check-login');
    const data = await response.json();

    // Favorite button event listener
    favButton.addEventListener('click', () => {
        try {
            if (data.isLoggedIn) {
                window.location.href = 'category.html?category=favorite';
            } else {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });

    // Profile button event listener
    profileButton.addEventListener('click', () => {
        try {
            if (!data.isLoggedIn) {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });

    // Sell button event listener
    sellButton.addEventListener('click', () => {
        try {
            if (data.isLoggedIn) {
                window.location.href = 'upload_product.html';
            } else {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });
}

async function setupProfileDropdown() {
    // Profile dropdown
    const profileDropdownContainer = document.getElementById("profile-dropdown-container");

    const response = await fetch('/api/check-login');
    const data = await response.json();

    if (data.isLoggedIn) {
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');

        dropdownMenu.innerHTML = `
            <a href="my-products.html" class="dropdown-item">My Products</a>
            <a href="settings.html" class="dropdown-item">Settings</a>
            <a class="dropdown-item" style="color: #e74c3c" onclick="logOut()">Log Out</a>
        `;

        profileDropdownContainer.appendChild(dropdownMenu);
    }
}

// Function on click on logout button
async function logOut() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = '/';
        } else {
            alert(result.message || 'Failed to log out');
        }
    } catch (err) {
        console.error('Error logging out: ', err);
        alert('An error ocurred during logout');
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (response.ok) {
            const categories = await response.json();

            const categoryList = document.getElementById('category-list');
            const staticLinksContainer = document.querySelector('.navbar .static-links');

            // Clear existing categories
            categoryList.innerHTML = '';
            staticLinksContainer.innerHTML = '';

            var i = 0;

            // Create categories
            categories.forEach(category => {
                // Dropdown links
                const dropdownItem = document.createElement('a');
                dropdownItem.href = `category.html?category=${encodeURIComponent(category.name_id)}`;
                dropdownItem.textContent = capitalizeFirstLetter(category.name_id);
                categoryList.appendChild(dropdownItem);

                if (i < 4) { // Static links (not all are to be shown)
                    const staticLink = document.createElement('a');
                    staticLink.href = `category.html?category=${encodeURIComponent(category.name_id)}`;
                    staticLink.textContent = capitalizeFirstLetter(category.name_id);
                    staticLinksContainer.appendChild(staticLink);
                }
                i++;
            });
        } 
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// From: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', navButtonHandler);
document.addEventListener('DOMContentLoaded', loadCategories);
document.addEventListener('DOMContentLoaded', setupProfileDropdown);