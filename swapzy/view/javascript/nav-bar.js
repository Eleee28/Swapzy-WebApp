async function navButtonHandler() {
    const favButton = document.getElementById("fav-button");
    const profileButton = document.getElementById("profile-button");
    const sellButton = document.getElementById("sell-button");

    const response = await fetch('/api/check-login');
    const data = await response.json();

    favButton.addEventListener('click', () => {
        try {
            if (data.isLoggedIn) {
                //window.location.href = 'favorited.html';
                console.log("Fav button clicked")
            } else {
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error: ', err);
        }
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
                window.location.href = 'login.html';
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    });
}

document.addEventListener('DOMContentLoaded', navButtonHandler);