function checkSessionPeriodically(interval) {
    if (typeof interval === 'undefined') // This check is from Chat-GPT
        interval = 60000;

    let alertShown = false;

    async function checkSession() {
        try {
            const response = await fetch('/api/session-info');
            const data = await response.json();

            if (data.remainingTime > 0 && data.remainingTime <= 10000) {
                alert("Your session is about to expire!"); // Alert 10 seconds before expiration
            } else if (data.remainingTime <= 0) {
                if (!alertShown && !sessionStorage.getItem('sessionExpired')) {
                    alert("Session expired");
                    alertShown = true;

                    // Store session has expired (avoid re-trigger the alert) - Chat-GPT
                    sessionStorage.setItem('sessionExpired', 'true');

                    window.location.href = '/';
                }
            }
        } catch (err) {
            console.error("Error checking session: ", err);
        }
    }

    checkSession();

    // Periodic checks
    setInterval(checkSession, interval);
}

checkSessionPeriodically();