let confirmBtnAction = null;

// Change image popup
function openChangeImagePopup() {
    document.getElementById("popup-title").textContent = "Enter Image URL";
    document.getElementById("popup-info").textContent = "";
    document.getElementById("image-url").style.display = "block";
    document.getElementById("image-url").value = "";
    document.getElementById("popup-passwd").style.display = "none";
    document.getElementById("confirm-btn").innerText = "Save";
    document.getElementById('error-message').style.display= "none";
    
    confirmBtnAction = 'change-image';

    document.getElementById("popup").style.display = "flex";
}

// Delete account popup
function openDeleteAccountPopup() {
    document.getElementById("popup-title").textContent = "Deleting Account";
    document.getElementById("popup-info").textContent = "Introduce your password to delete account";
    document.getElementById("image-url").style.display = "none";
    document.getElementById("popup-passwd").style.display = "block";
    document.getElementById("confirm-btn").innerText = "Delete";
    document.getElementById('error-message').style.display= "none";
    
    confirmBtnAction = 'delete-account';

    document.getElementById("popup").style.display = "flex";
}

// Call function depending on button
function confirmAction() {
    if (confirmBtnAction === 'change-image')
        updateProfilePic();
    else if (confirmBtnAction === 'delete-account')
        deleteUser();
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function updateProfilePic() {
    const imageUrl = document.getElementById("image-url").value;

    if (imageUrl) {
        const profilePic = document.getElementById("profile-pic");
        profilePic.src = imageUrl;
        closePopup();
    } else {
        // Display error message
        const errorDiv = document.getElementById('error-message');
        errorDiv.style.display = 'block';
        errorDiv.textContent = "Invalid image URL";
    }
}

async function logOut() {
    const popup = document.getElementById('info-popup');
    const closePopupButton = document.getElementById('close-popup');

    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            // Show popup
            document.getElementById("info-popup-message").textContent = "You have successfully logged out!"; 
            popup.style.display = "flex";
            
            setTimeout(() => {
                window.location.href = result.redirect;
            }, 3000); // Redirect after 3 seconds
        } else {
            alert(result.message || 'Failed to log out');
        }
    } catch (err) {
        console.error('Error logging out: ', err);
        alert('An error ocurred during logout');
    }

    closePopupButton.addEventListener('click', () => {
        popup.style.display = "none";
        window.location.href = '/';
    })
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

async function updateUserInfo() {
    // UI elements
    const imageUrl = document.getElementById("profile-pic").src;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeat-password").value;

    // Get location using marker
    const lat = marker.getLatLng().lat;
    const lng = marker.getLatLng().lng;

    // User to send to backend
    const updatedUserInfo = {
        username: username,
        email: email,
        image_url: imageUrl,
        password: password,
        repeat_password: repeatPassword,
        location: {
            lat: lat,
            lng: lng
        }
    };

    try {
        const response = await fetch('/api/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserInfo)
        });

        const result = await response.json();
        if (response.ok)
            showPopupMessage("User information updated", '/');
        else if (response.status === 400)
            showPopupMessage(result.message, 'settings.html');

    } catch (err) {
        console.error('Error while updating user:', err);
    }    
}

async function deleteUser() {
    const password = document.getElementById("popup-passwd").value;

    try {
        if (!password) {
            // Display error message
            const errorDiv = document.getElementById('error-message');
            errorDiv.style.display = 'block';
            errorDiv.textContent = "Enter your password";
        }

        const response = await fetch('/api/delete-user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Display error message
            const errorDiv = document.getElementById('error-message');
            errorDiv.style.display = 'block';
            errorDiv.textContent = data.message;
        }

        if (data.message === "User account deleted successfully") {
            closePopup();
            showPopupMessage("Account deleted successfully", '/');
        }

    } catch (err) {
        console.error("Error:", err.message);
        showPopupMessage(err.message || "An error occurred. Please try again.", 'settings.html');
    }
}

// Function to show popup message
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

async function loadUserInfo() {
    // UI elements
    const profilePic = document.getElementById("profile-pic");
    const usernameInput = document.getElementById("username");
    const locationInput = document.getElementById("location");
    const emailInput = document.getElementById("email");

    try {
        const userResponse = await fetch('/api/check-login');
        const userResult = await userResponse.json();

        if (userResult.isLoggedIn) {
            const response = await fetch(`/api/users/${userResult.username}`);

            if (response.ok) {
                const result = await response.json();

                profilePic.src = result.profile_img || "../images/profile_picture_sample.jpg";
                usernameInput.value = result.username;
                emailInput.value = result.email;

                // Load user location
                if (result.location && result.location.coordinates) {
                    const [lng, lat] = result.location.coordinates;

                    const city = await getCityFromCoordinates(lat, lng);
                    locationInput.value = city || '';
                }
            }
        }
    } catch (err) {
        console.error('Error while updating user:', err);
    } 
}

// Reverse geocoding to get a city name from coordinates
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
        document.getElementById('location').value = '';
    });

    // Geocoding function
    async function geocodeLocation(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const results = await response.json();
        return results.length > 0 ? results[0] : null;
    }

    // Location search
    const locationInput = document.getElementById('location');
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

// On page load event listeners
document.addEventListener('DOMContentLoaded', loadUserInfo);
document.addEventListener('DOMContentLoaded', initializeMap);