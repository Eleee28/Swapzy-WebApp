async function autoLogout() {

    const maxTime = 30 * 60 * 1000; // 30 minutes
    const alertTime = maxTime - 20;

    const response = await fetch('/api/check-login');
    const data = await response.json();

    if (data.isLoggedIn) {
        window.setTimeout(() => {
            alert("Logging out soon")
        }, alertTime);
        
        window.setTimeout(async () => {
            const logoutResponse = await fetch('/api/logout', {
                method: 'POST'
            });
            const data = await logoutResponse.json();

            window.location.href = data.redirect;
        }, maxTime);
    }
}

// On page load event listeners
document.addEventListener('DOMContentLoaded', autoLogout);