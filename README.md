### Project Name: **ShakaPlayer Offline Video Downloader**

### Project Description:

**ShakaPlayer Offline Video Downloader** is a web-based application utilizing Shaka Player, allowing users to stream HLS videos online and download them for offline viewing. This project showcases the various capabilities of Shaka Player, particularly offline content management.

### Features:

1. **Online Video Streaming**: Stream HLS videos directly in the browser.
2. **Offline Video Download**: Download videos in different qualities for offline viewing.
3. **Offline Content Management**: Features to delete downloaded videos.
4. **Download Progress Display**: Real-time display of the video download progress.
5. **Base64 Encoding for Enhanced Security**: Video URLs are encoded in Base64 for added security during loading and downloading.

### Installation and Setup Instructions:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/shaka-offline-video-downloader.git
    cd shaka-offline-video-downloader
    ```

2. **Start a Local Server**:
    Due to the need for HTTP for video file access and playback capabilities, it's recommended to run a local server. For the simplest setup, you can use `http-server`:
    ```bash
    npm install -g http-server
    http-server
    ```

3. **Access the Application**:
    Once the server is running, go to `http://localhost:8080` in your browser to use the application.

### Usage:

1. **Online Streaming**:
    - Click the "Play Online" button to stream the video online.

2. **Offline Download and Playback**:
    - "Download" buttons for different video qualities are available. Click on them to start the download process, and the progress will be displayed.
    - After the download completes, the corresponding offline play and delete buttons for each quality will be shown.

3. **Offline Content Deletion**:
    - Click the "Delete" button to remove the downloaded content from storage.

### Technologies Used:

- **HTML5**: Main structure of the page.
- **CSS3**: Designing and beautifying the user interface.
- **JavaScript (ES6+)**: Main logic and interactions.
- **Shaka Player**: Video playback and content management.
- **m3u8-parser**: Parsing HLS files.

### Contributing:

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

### License:

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Feel free to reach out if you have any questions or need further assistance!

Enjoy streaming and offline viewing with **ShakaPlayer Offline Video Downloader**!