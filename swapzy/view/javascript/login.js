document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const formData = new URLSearchParams(new FormData(this));
    
    // Send data to backend
    const response = await fetch('/api/login', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const result = await response.json();
        const errorMessage = result.errorMessage || 'An error ocurred';

        // Display error message
        const errorDiv = document.getElementById('error-message');
        errorDiv.style.display = 'block';
        errorDiv.textContent = errorMessage;
    } else {
        const result = await response.json();
        window.location.href = '/'; // Redirect to root
    }
});