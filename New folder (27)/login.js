// Default admin credentials (in real-world, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'suman',
    password: 'suman123'
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('loginMessage');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Set session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now());
        
        // Redirect to admin panel
        window.location.href = 'admin.html';
    } else {
        messageElement.textContent = 'Invalid username or password';
        messageElement.style.color = '#ff4444';
    }
}

// Handle enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});
