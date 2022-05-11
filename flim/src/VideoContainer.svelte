<script>
    import { Button, Overlay } from "svelte-materialify";
    import Player from "./Player.svelte";
    let video_player_is_active = false;
    let is_fullscreen = false;
    export let video_vid;
    export let video_pic;
    export let title;
</script>

<main>
    <div class="video-container">
        <section>
            <div
                class="thumbnail"
                data-duration="13:37"
                on:click={() => {
                    video_player_is_active = true;
                }}
            >
                <img
                    class="thumbnail-image"
                    src={video_pic ??
                        "http://unsplash.it/250/150?gravity=center"}
                    alt=""
                />
            </div>
            <div class="video-bottom-section">
                <div>
                    <img
                        class="channel-icon"
                        src="https://i1.wp.com/globalgrind.com/wp-content/uploads/sites/16/2014/10/screen-shot-2014-10-17-at-3-46-07-pm.png?quality=80&strip=all&ssl=1"
                        alt=""
                    />
                </div>
                <div class="video-details">
                    <div class="video-title" alt="" src={title}>{title}</div>
                    <div class="video-channel-name" alt="">Channel Name</div>
                    <div class="video-metadata">
                        <span>12K views</span>
                        •
                        <span>1 week ago</span>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <Overlay
        opacity={is_fullscreen ? 1 : 0.7}
        color="black"
        active={video_player_is_active}
        on:click={() => {
            video_player_is_active = false;
        }}
    >
        <div
            id="video"
            class:fullscreen={is_fullscreen == true}
            on:click={(e) => {
                e.stopPropagation();
            }}
        >
            <div id="close">
                <Button
                    class="error-color"
                    size="small"
                    on:click={() => {
                        video_player_is_active = false;
                    }}
                >
                    Close
                </Button>
            </div>
            <div id="fullscreen">
                <Button
                    size="small"
                    class="primary-color"
                    on:click={() => {
                        is_fullscreen = !is_fullscreen;
                        // do not focus the fullscreenbutton if clicked
                        // this is because otherwise clicking space will cause
                        // the video player to maximize/minimize instead of pause/play
                        // when space is clicked
                        if (document.activeElement != document.body)
                            document.activeElement.blur();
                    }}
                >
                    {is_fullscreen ? "Minimize" : "Theatre Mode"}
                </Button>
            </div>

            {#if is_fullscreen && video_vid.endsWith("mp4")}
                <div id="gigascreen">
                    <Button
                        size="small"
                        class="secondary-color"
                        on:click={() => {
                            // do not focus the fullscreenbutton if clicked
                            // this is because otherwise clicking space will cause
                            // the video player to maximize/minimize instead of pause/play
                            // when space is clicked
                            if (document.activeElement != document.body)
                                document.activeElement.blur();

                            let div = document.getElementById("vid");
                            if (div.requestFullscreen) div.requestFullscreen();
                            else if (div.webkitRequestFullscreen)
                                div.webkitRequestFullscreen();
                            else if (div.msRequestFullScreen)
                                div.msRequestFullScreen();
                        }}
                    >
                        {"Gigascreen"}
                    </Button>
                </div>
            {/if}
            {#if video_vid.endsWith("mp4")}
                <Player {video_vid} {video_pic} />
            {:else}
                <iframe
                    width="100%"
                    height="100%"
                    src={video_vid}
                    title=""
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                />
            {/if}
        </div>
    </Overlay>
</main>

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
        background-color: rgba(0, 0, 0, 0.85);
        color: white;
        right: 5px;
        bottom: 5px;
        padding: 0.1em 0.3em;
        border-radius: 0.3em;
        font-size: 0.9rem;
    }

    .thumbnail-image {
        width: 100%;
        height: 100%;
        min-width: 250px;
        min-height: 150px;
        background-color: #aaa;
    }

    .video-bottom-section {
        display: flex;
        align-items: flex-start;
        margin-top: 1rem;
    }

    .channel-icon {
        margin-right: 0.75rem;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        background-color: #aaa;
    }

    .video-details {
        display: flex;
        flex-direction: column;
    }

    .video-title {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        text-decoration: none;
        color: black;
    }

    .video-channel-name {
        margin-bottom: 0.1rem;
        text-decoration: none;
        transition: color 150ms;
    }

    .video-channel-name:hover {
        color: #111;
    }

    /* .video-channel-name,.video-metadata {
  color: #555;
} */

    #video {
        position: fixed;
        transition: all 0.3s ease-out;
        left: 15%;
        right: 15%;
        top: 15%;
        bottom: 15%;
    }

    #video.fullscreen {
        left: 0%;
        right: 0%;
        top: 0%;
        bottom: 0%;
    }

    #video.fullscreen #gigascreen {
        position: absolute;
        top: 10px; /* position the top  edge of the element at the middle of the parent */
        left: 50%; /* position the left edge of the element at the middle of the parent */

        transform: translate(-50%, 0);
        z-index: 100;
    }
    #video #close {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 100;
    }

    #video #fullscreen {
        position: absolute;
        top: -10px;
        left: -10px;
        z-index: 100;
    }

    #video.fullscreen #close {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 100;
    }

    #video.fullscreen #fullscreen {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 100;
    }
</style>
