// Get saved links from localStorage
const embedLinks = JSON.parse(localStorage.getItem('embedLinks')) || [];

function createPlayerUI() {
    const playerWrapper = document.getElementById('player-wrapper');
    
    if (embedLinks.length === 0) {
        playerWrapper.innerHTML = '<p>No embedded content available. Add some from the admin panel.</p>';
        return;
    }

    // Create selection dropdown
    const selector = document.createElement('select');
    selector.className = 'content-selector';
    selector.onchange = function() {
        displaySelectedContent(this.value);
    };

    // Add options to selector
    selector.innerHTML = '<option value="">Select content to play</option>' +
        embedLinks.map(link => `<option value="${link.id}">${link.title}</option>`).join('');

    // Create player container
    const playerContainer = document.createElement('div');
    playerContainer.className = 'embed-container';
    playerContainer.id = 'embed-container';

    // Create video player
    const videoPlayer = document.createElement('video');
    videoPlayer.id = 'videoPlayer';
    videoPlayer.style.display = 'none';

    playerWrapper.innerHTML = '';
    playerWrapper.appendChild(selector);
    playerWrapper.appendChild(playerContainer);
    playerContainer.appendChild(videoPlayer);
}

function displaySelectedContent(id) {
    const container = document.getElementById('embed-container');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Reset displays
    container.innerHTML = '';
    videoPlayer.style.display = 'none';
    videoPlayer.src = '';
    
    if (!id) return;

    const content = embedLinks.find(link => link.id === parseInt(id));
    if (!content) return;

    let url = content.link.toLowerCase();
    
    // Handle direct video files (MP4) and HLS streams (M3U8)
    if (url.endsWith('.mp4') || url.endsWith('.m3u8')) {
        videoPlayer.style.display = 'block';
        container.appendChild(videoPlayer);
        
        if (url.endsWith('.m3u8')) {
            // Handle HLS streams
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(content.link);
                hls.attachMedia(videoPlayer);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    videoPlayer.play();
                });
            } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari which has built-in HLS support
                videoPlayer.src = content.link;
            }
        } else {
            // Handle MP4 files
            videoPlayer.src = content.link;
        }
        return;
    }

    // Handle other platform embeds
    let embedUrl = content.link;
    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
        embedUrl = convertYouTubeUrl(embedUrl);
    } else if (embedUrl.includes('vimeo.com')) {
        embedUrl = convertVimeoUrl(embedUrl);
    }

    container.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
}

function convertYouTubeUrl(url) {
    const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()
        : new URLSearchParams(new URL(url).search).get('v');
    return `https://www.youtube.com/embed/${videoId}`;
}

function convertVimeoUrl(url) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}`;
}

// Initialize the player UI
createPlayerUI();

// Update player when localStorage changes
window.addEventListener('storage', function(e) {
    if (e.key === 'embedLinks') {
        const embedLinks = JSON.parse(e.newValue) || [];
        createPlayerUI();
    }
});
