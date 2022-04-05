<script>
</script>
<article class="video-container">
    <a href="#0" class="thumbnail" data-duration="13:37">
        <img class="thumbnail-image" src="http://unsplash.it/250/150?gravity=center" alt="">
    </a>
    <div class="video-bottom-section">
        <a href="#0">
            <img class="channel-icon" src="http://unsplash.it/36/36?gravity=center" alt="">
        </a>
        <div class="video-details">
            <a href="#0" class="video-title" alt="">Video Title</a>
            <a href="#0" class="video-channel-name" alt="">Channel Name</a>
            <div class="video-metadata">
                <span>12K views</span>
                •
                <span>1 week ago</span>
            </div>
        </div>
    </div>
</article>
<style>

.video-container {
  display: flex;
  flex-direction: column;
}

.thumbnail {
  position: relative;
  display: flex;
}

.thumbnail::before {
  content: attr(data-duration);
  position: absolute;
  background-color: rgba(0, 0, 0, .85);
  color: white;
  right: 5px;
  bottom: 5px;
  padding: .1em .3em;
  border-radius: .3em;
  font-size: .9rem;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  min-width: 250px;
  min-height: 150px;
  background-color: #AAA;
}

.video-bottom-section {
  display: flex;
  align-items: flex-start;
  margin-top: 1rem;
}

.channel-icon {
  margin-right: .75rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  background-color: #AAA;
}

.video-details {
  display: flex;
  flex-direction: column;
}

.video-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: .5rem;
  text-decoration: none;
  color: black;
}

.video-channel-name {
  margin-bottom: .1rem;
  text-decoration: none;
  transition: color 150ms;
}

.video-channel-name:hover {
  color: #111;
}

.video-channel-name,.video-metadata {
  color: #555;
}





</style>