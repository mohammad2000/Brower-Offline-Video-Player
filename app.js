document.addEventListener('DOMContentLoaded', async function() {
    var video = document.getElementById('video');
    var player = new shaka.Player(video);
    var downloadManager = new shaka.offline.Storage(player);
    var qualityButtons = document.getElementById('quality-buttons');
    var playOnlineButton = document.getElementById('play-online');
    var progressBarContainer = document.getElementById('progress-container');
    var progressBar = document.getElementById('progress-bar');
    var messageElement = document.getElementById('message');
    var manifestUri = 'https://cdn.bitmovin.com/content/assets/sintel/hls/playlist.m3u8';

    function fetchMasterPlaylist(uri) {
        return fetch(uri)
            .then(response => response.text())
            .then(text => {
                const parser = new m3u8Parser.Parser();
                parser.push(text);
                parser.end();
                return parser.manifest.playlists;
            });
    }

    function relativeToAbsolute(base, relative) {
        const stack = base.split("/");
        const parts = relative.split("/");
        stack.pop();
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === ".") continue;
            if (parts[i] === "..") stack.pop();
            else stack.push(parts[i]);
        }
        return stack.join("/");
    }

    function base64Encode(string) {
        return btoa(string);
    }

    function base64Decode(string) {
        return atob(string);
    }

    async function initPlayer() {
        const encodedManifestUri = base64Encode(manifestUri);
        const decodedManifestUri = base64Decode(encodedManifestUri);

        const playlists = await fetchMasterPlaylist(decodedManifestUri);
        const storedContents = await downloadManager.list();

        playlists.forEach((playlist) => {
            const absoluteUri = relativeToAbsolute(decodedManifestUri, playlist.uri);
            const encodedUri = base64Encode(absoluteUri);
            const decodedUri = base64Decode(encodedUri);

            const hasStoredContent = storedContents.some(content => content.originalManifestUri === decodedUri);

            var button = document.createElement('button');
            button.innerText = `Download ${playlist.attributes.RESOLUTION.height}p`;
            button.classList.add('quality-button');

            if (hasStoredContent) {
                const content = storedContents.find(content => content.originalManifestUri === decodedUri);
                var offlineButton = document.createElement('button');
                offlineButton.innerText = `Play Offline ${playlist.attributes.RESOLUTION.height}p`;
                offlineButton.classList.add('quality-button');
                offlineButton.onclick = () => playOffline(content.offlineUri);
                qualityButtons.appendChild(offlineButton);

                var deleteButton = document.createElement('button');
                deleteButton.innerText = `Delete ${playlist.attributes.RESOLUTION.height}p`;
                deleteButton.classList.add('delete-button');
                deleteButton.onclick = () => deleteOffline(content.offlineUri, button, offlineButton, deleteButton);
                qualityButtons.appendChild(deleteButton);
            } else {
                button.addEventListener('click', () => {
                    progressBarContainer.classList.remove('hidden');
                    messageElement.classList.add('hidden');
                    downloadVideo(decodedUri, button);
                });
            }

            qualityButtons.appendChild(button);
        });
    }

    async function downloadVideo(uri, button) {
        try {
            let totalSize = 0;
            let downloadedSize = 0;

            player.addEventListener('segmentdownloading', event => {
                totalSize += event.data.totalBytes;
            });

            player.addEventListener('segmentdownloaded', event => {
                downloadedSize += event.data.totalBytes;
                const progress = downloadedSize / totalSize;
                progressBar.style.width = `${progress * 100}%`;
                progressBar.textContent = `${Math.floor(progress * 100)}%`;
            });

            var options = {
                downloadAll: false,
            };
            var contentUri = await downloadManager.store(uri, options);
            messageElement.classList.remove('hidden');
            messageElement.textContent = 'Video downloaded successfully!';
            progressBarContainer.classList.add('hidden');
            updateButtonsAfterDownload(contentUri, button);
        } catch (error) {
            console.error('Error downloading video', error);
            alert('Error downloading video!');
            progressBarContainer.classList.add('hidden');
        }
    }

    function updateButtonsAfterDownload(contentUri, button) {
        button.innerText = `Play Offline`;
        button.classList.remove('quality-button');
        button.classList.add('play-button');
        button.onclick = () => playOffline(contentUri);

        var deleteButton = document.createElement('button');
        deleteButton.innerText = `Delete Offline`;
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteOffline(contentUri, button, deleteButton);
        qualityButtons.insertBefore(deleteButton, button.nextSibling);
    }

    function playOnline() {
        const encodedManifestUri = base64Encode(manifestUri);
        const decodedManifestUri = base64Decode(encodedManifestUri);

        player.load(decodedManifestUri).then(() => {
            console.log('Playing online content');
            video.play();
        }).catch(error => {
            console.error('Error playing online content', error);
        });
    }

    function playOffline(contentUri) {
        player.load(contentUri).then(() => {
            console.log('Playing offline content');
            video.play();
        }).catch(error => {
            console.error('Error playing offline content', error);
        });
    }

    async function deleteOffline(contentUri, playButton, deleteButton) {
        try {
            await downloadManager.remove(contentUri);
            alert('Offline content deleted');
            qualityButtons.removeChild(playButton);
            qualityButtons.removeChild(deleteButton);
        } catch (error) {
            console.error('Error deleting offline content', error);
            alert('Error deleting offline content');
        }
    }

    playOnlineButton.addEventListener('click', playOnline);

    initPlayer().catch(error => {
        console.error('Error initializing player', error);
    });
});