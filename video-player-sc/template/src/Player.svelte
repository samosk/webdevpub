<!-- 

	Video player INSPIRED BY AND IMPROVED FROM https://svelte.dev/tutorial/media-elements

 -->
 <script>
	// These values are bound to properties of the video
	let time = 0;
	let duration;
	let paused = true;

	let showControls = true;
	let showControlsTimeout;

	// Used to track time of last mouse down event
	let lastMouseDown;

	function handleMove(e) {
		// Make the controls visible, but fade out after
		// 2.5 seconds of inactivity
		clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => (showControls = false), 2500);
		showControls = true;

		if (!duration) return; // video not loaded yet
		if (e.type !== "touchmove" && !(e.buttons & 1)) return; // mouse not down

		const clientX =
			e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
		const { left, right } = this.getBoundingClientRect();
		time = (duration * (clientX - left)) / (right - left);
	}

	// we can't rely on the built-in click event, because it fires
	// after a drag — we have to listen for clicks ourselves
	function handleMousedown(e) {
		lastMouseDown = new Date();
	}

	function handleMouseup(e) {
		if (new Date() - lastMouseDown < 300) {
			if (paused) e.target.play();
			else e.target.pause();
		}
	}

	function handleKeyDown(e) {
		let video = document.getElementById("vid");
		if (e && e.key == " ") {
			if (paused) video.play();
			else video.pause();
		}
	}

	function format(seconds) {
		if (isNaN(seconds)) return "...";

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = "0" + seconds;

		return `${minutes}:${seconds}`;
	}
</script>

<svelte:window on:keydown|preventDefault={handleKeyDown} />

<div id="container">
	<video
		id="vid"
		poster="https://sveltejs.github.io/assets/caminandes-llamigos.jpg"
		src="https://sveltejs.github.io/assets/caminandes-llamigos.mp4"
		on:mousedown|preventDefault|stopPropagation={handleMousedown}
		on:mouseup|preventDefault|stopPropagation={handleMouseup}
		bind:currentTime={time}
		bind:duration
		bind:paused
	>
		<track kind="captions" />
	</video>


	<div
		class="controls"
		style="opacity: {duration && showControls ? 1 : 0}"
		on:mousemove|preventDefault|stopPropagation={handleMove}
		on:touchmove|preventDefault|stopPropagation={handleMove}
		on:mousedown|preventDefault|stopPropagation={handleMove}
		on:mouseup|preventDefault|stopPropagation={handleMove}
	>
		<div class="info">
			<span class="time">{format(time)}</span>
			<span>
				<span class="time">{format(duration)}</span>
			</span>
		</div>
		<progress value={time / duration || 0} />
	</div>
</div>

<style>
	#container {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.controls {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		transition: opacity 1s;
		margin-bottom: 0;
		padding-bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-items: end;
		align-content: flex-end;
	}

	.info {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	span {
		color: white;
		text-shadow: 0 0 8px black;
		font-size: 1.4em;
		opacity: 0.7;
	}

	.time {
		width: 3em;
	}

	.time:last-child {
		text-align: right;
	}

	progress {
		width: 100%;
		height: 20px;
		-webkit-appearance: none;
		appearance: none;
	}

	progress::-webkit-progress-bar {
		background-color: rgba(0, 0, 0, 0.2);
	}

	progress::-webkit-progress-value {
		background-color: rgba(255, 255, 255, 0.6);
	}

	video {
		position: absolute;
		width: 100%;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>