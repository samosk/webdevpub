<script>
import VideoContainer from "./VideoContainer.svelte";
</script>
<section class="video-section">
    <h2 class="video-section-title">
        Trending
        <button class="video-section-title-close">&times;</button>
    </h2>
    <VideoContainer/>
    <VideoContainer/>
    <VideoContainer/>
    <VideoContainer/>
    <VideoContainer/>
    <VideoContainer/>
</section>
<style>
    .video-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 3rem 1rem;
  padding: 3rem 0;
  margin: 0 1.5rem;
  border-top: 4px solid #CCC;
}

.video-section:first-child {
  border-top: none;
}

.video-section-title {
  grid-column: 1 / -1;
  margin: -.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 .5rem;
}

.video-section-title-close {
  border: none;
  background: none;
  padding: 0;
  font-size: 2rem;
  color: #555;
  cursor: pointer;
}


</style>