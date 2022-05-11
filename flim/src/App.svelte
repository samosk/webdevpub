<script>
	import ElbenPing from "./ElbenPing.svelte";
	import RickRoll from "./RickRoll.svelte";
	import LoudFunny from "./LoudFunny.svelte";
</script>

<main>
	<header class="header">
		<img src="logo.svg" alt="YouTube Logo" class="youtube-logo" />
	</header>

	<div class="area">
		<ul class="circles">
			<li />
			<li />
			<li />
			<li />
			<li />
			<li />
			<li />
			<li />
			<li />
			<li />
		</ul>
	</div>
	<div class="videos">
		<ElbenPing />

		<RickRoll />

		<LoudFunny />
	</div>
</main>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		font-family: Roboto, Arial, Helvetica, sans-serif;
	}

	main {
		margin: 0;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}
	:root {
		--netflix-red: #e50914;
		--netflix-red-opacity: rgba(229, 9, 20, 0.3);
	}

	:global(body) {
		padding: 0;
		margin: 0;
	}

	main {
		min-height: 100vh;
		width: 100vw;
		background: none;
		padding-left: 5%;
		padding-right: 5%;
		box-sizing: border-box;
		position: relative;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		height: 60px;
	}
	img {
		padding: 0;
		margin: 0;
		height: 100%;
	}

	.area {
		background: #4e54c8;
		background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -1;
		overflow: hidden;
	}

	.circles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 1;
	}

	.circles li {
		position: absolute;
		display: block;
		list-style: none;
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.2);
		animation: animate 50s linear infinite;
		bottom: -150px;
	}

	.circles li:nth-child(1) {
		left: 25%;
		width: 80px;
		height: 80px;
		animation-delay: 0s;
	}

	.circles li:nth-child(2) {
		left: 10%;
		width: 20px;
		height: 20px;
		animation-delay: 2s;
		animation-duration: 12s;
	}

	.circles li:nth-child(3) {
		left: 70%;
		width: 20px;
		height: 20px;
		animation-delay: 4s;
	}

	.circles li:nth-child(4) {
		left: 40%;
		width: 60px;
		height: 60px;
		animation-delay: 0s;
		animation-duration: 18s;
	}

	.circles li:nth-child(5) {
		left: 65%;
		width: 20px;
		height: 20px;
		animation-delay: 0s;
	}

	.circles li:nth-child(6) {
		left: 75%;
		width: 110px;
		height: 110px;
		animation-delay: 3s;
	}

	.circles li:nth-child(7) {
		left: 35%;
		width: 150px;
		height: 150px;
		animation-delay: 7s;
	}

	.circles li:nth-child(8) {
		left: 50%;
		width: 25px;
		height: 25px;
		animation-delay: 15s;
		animation-duration: 45s;
	}

	.circles li:nth-child(9) {
		left: 20%;
		width: 15px;
		height: 15px;
		animation-delay: 2s;
		animation-duration: 35s;
	}

	.circles li:nth-child(10) {
		left: 85%;
		width: 150px;
		height: 150px;
		animation-delay: 0s;
		animation-duration: 11s;
	}

	@keyframes animate {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
			border-radius: 0;
		}

		100% {
			transform: translateY(-5000px) rotate(720deg);
			opacity: 0.8;
			border-radius: 50%;
		}
	}
	@media only screen and (max-width:550px){
        .area{
            background: #AAA;
        }
    }
</style>
