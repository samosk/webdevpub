<script>
  import VideoContainer from "./VideoContainer.svelte";
  import vidinf from "./vidinf.js";
</script>

<section class="video-section">
  <h2 class="video-section-title">Loud and Funny</h2>
  <VideoContainer
    video_pic={vidinf.EarRape[0].video_pic}
    video_vid={vidinf.EarRape[0].video_vid}
    title={vidinf.EarRape[0].title}
  />
  <VideoContainer
    video_pic={vidinf.EarRape[1].video_pic}
    video_vid={vidinf.EarRape[1].video_vid}
    title={vidinf.EarRape[1].title}
  />
  <VideoContainer
    video_pic={vidinf.EarRape[2].video_pic}
    video_vid={vidinf.EarRape[2].video_vid}
    title={vidinf.EarRape[2].title}
  />
  <VideoContainer
    video_pic={vidinf.EarRape[3].video_pic}
    video_vid={vidinf.EarRape[3].video_vid}
    title={vidinf.EarRape[3].title}
  />
  <VideoContainer
    video_pic={vidinf.EarRape[4].video_pic}
    video_vid={vidinf.EarRape[4].video_vid}
    title={vidinf.EarRape[4].title}
  />
  <VideoContainer
    video_pic={vidinf.EarRape[5].video_pic}
    video_vid={vidinf.EarRape[5].video_vid}
    title={vidinf.EarRape[5].title}
  />
</section>

<style>
  .video-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 3rem 1rem;
    padding: 3rem 0;
    margin: 0 1.5rem;
    border-top: 4px solid #ccc;
  }

  .video-section:first-child {
    border-top: none;
  }

  .video-section-title {
    grid-column: 1 / -1;
    margin: -0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }
</style>
