<script>
	import { onMount } from "svelte";

	let quote, inputText, Culor, timer;

	async function getRandomQuote() {
		startTimer();
		return (await (await fetch("https://api.quotable.io/random")).json())
			.content;
	}

	async function checkInput() {
		if (quote == false || inputText == false) return;
		Culor = false;
		for (let i = 0; i < inputText.length; i++) {
			if (i > quote.length) {
				console.log("Input longer than qoute");
				return;
			}

			if (quote[i] != inputText[i]) {
				Culor = true;
				console.log("New character does not match the qoute");
				return;
			}
		}
		if (quote.length == inputText.length && Culor == false) {
			inputText = "";
			quote = await getRandomQuote();
			startTimer();
		}
	}
	function correctCharacter(index) {
		if (quote == null || inputText == null || index >= quote.length || index >= inputText.length) return 'normal';
		return quote[index] == inputText[index] ? 'correct' : 'incorrect';
	}
	let startTime;
	function startTimer() {
		timer = 0;
		startTime = new Date();
		setInterval(() => {
			timer = getTimerTime();
		}, 1000);
	}
	function getTimerTime() {
		return Math.floor((new Date() - startTime) / 1000);
	}

	onMount(async () => {
		quote = await getRandomQuote();
	});
</script>

<body>
	<div class="timer" id="timer">{timer}</div>
	<div class="container">
		<div class="quote-display" id="quoteDisplay">
			{#if quote != undefined}
				{#key inputText}
					{#each [...Array(quote.length).keys()] as i}
						<span class={correctCharacter(i)}>{quote[i]}</span>
					{/each}
				{/key}
			{:else}
				Loading
			{/if}
		</div>
		<!-- <div class="quote-input" id="quoteInput">
			{#if inputText != undefined}
				{#key inputText}
					{#each [...Array(inputText.length).keys()] as i}
						<span class={correctCharacter(i)}>{inputText[i]}</span>
					{/each}
				{/key}
			{/if}
		</div> -->
		<textarea spellcheck="false"
			id="quoteInput"
			class="quote-input"
			on:paste={(e) =>{e.preventDefault()}}
			bind:value={inputText}
			on:input={() => {
				checkInput();
			}}
		/>
		
	</div>
</body>

<style>
	* {
		box-sizing: border-box;
	}

	body {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		margin: 0;
		background-color: #1e0555;
	}

	body,
	.quote-input {
		font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
			sans-serif;
	}

	.container {
		background-color: #f0db4f;
		padding: 1rem;
		border-radius: 0.5rem;
		width: 700px;
		max-width: 90%;
	}

	.timer {
		position: absolute;
		top: 2rem;
		font-size: 3rem;
		color: #f0db4f;
		font-weight: bold;
		user-select: none;
	}

	.quote-display {
		margin-bottom: 1rem;
		margin-left: calc(1rem + 2px);
		margin-right: calc(1rem + 2px);
		user-select: none;
	}

	.quote-input {
		background-color: transparent;
		border: 2px solid #a1922e;
		outline: none;
		width: 100%;
		height: 8rem;
		margin: auto;
		resize: none;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border-radius: 0.5rem;
		
	}

	.quote-input:focus {
		border-color: black;
	}

	.correct {
		color: white;
	}

	.incorrect {
		color: blue;
		text-decoration: underline;
	}
</style>
