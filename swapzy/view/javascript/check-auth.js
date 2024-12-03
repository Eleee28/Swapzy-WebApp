async function isAuthenticated() {
    try {
        const response = await fetch('/api/check-login');
        const data = await response.json();

        if (!data.isLoggedIn)
            window.location.href = 'error.html';
    } catch (err) {
        console.error("Error checking ")
    }
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', isAuthenticated);