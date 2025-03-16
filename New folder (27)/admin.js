// Check authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = parseInt(sessionStorage.getItem('adminLoginTime')) || 0;
    const currentTime = Date.now();
    const sessionTimeout = 3600000; // 1 hour

    if (!isLoggedIn || (currentTime - loginTime) > sessionTimeout) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = 'login.html';
}

// Check authentication on page load
if (!checkAuth()) {
    window.location.href = 'login.html';
}

// Store links in localStorage
let embedLinks = JSON.parse(localStorage.getItem('embedLinks')) || [];

function addLink() {
    const title = document.getElementById('linkTitle').value.trim();
    const link = document.getElementById('embedLink').value.trim();
    
    if (!title || !link) {
        alert('Please enter both title and link');
        return;
    }

    // Basic validation for common embed links
    if (!isValidEmbedLink(link)) {
        alert('Please enter a valid embed link (YouTube, Vimeo, etc.)');
        return;
    }

    const newLink = {
        id: Date.now(),
        title: title,
        link: link
    };

    embedLinks.push(newLink);
    localStorage.setItem('embedLinks', JSON.stringify(embedLinks));
    
    displayLinks();
    clearInputs();
}

function isValidEmbedLink(link) {
    // Support for video platforms and direct video links
    const validDomains = [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'dailymotion.com',
        'twitch.tv'
    ];
    
    try {
        const url = new URL(link);
        // Check for valid video platforms
        const isDomainValid = validDomains.some(domain => url.hostname.includes(domain));
        // Check for direct video files
        const isVideoFile = link.toLowerCase().endsWith('.mp4') || link.toLowerCase().endsWith('.m3u8');
        
        return isDomainValid || isVideoFile;
    } catch {
        return false;
    }
}

function deleteLink(id) {
    embedLinks = embedLinks.filter(link => link.id !== id);
    localStorage.setItem('embedLinks', JSON.stringify(embedLinks));
    displayLinks();
}

function displayLinks() {
    const linksList = document.getElementById('savedLinks');
    linksList.innerHTML = '';
    
    embedLinks.forEach(link => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${link.title}</span>
            <div>
                <button onclick="window.open('${link.link}', '_blank')">Preview</button>
                <button onclick="deleteLink(${link.id})" style="background-color: #ff4444;">Delete</button>
            </div>
        `;
        linksList.appendChild(li);
    });
}

function clearInputs() {
    document.getElementById('linkTitle').value = '';
    document.getElementById('embedLink').value = '';
}

// Initial display of saved links
displayLinks();
