<script>
	//https://codepen.io/kanishkkunal/pen/KwpGNa
	//https://superdevresources.com/3d-css-button/
	import { Clock } from "./clock";
	import FillClock from "./fill-clock.svelte";
	import { fly, fade, slide, draw } from "svelte/transition";
	import { spring, tweened} from "svelte/motion";
	let clock = new Clock(23, 50);
	let i = 0;
	let hours = spring();
	let minutes = spring();
	$minutes=parseInt(clock.time.hour) *60 + parseInt(clock.time.minute);
	$hours=parseInt(clock.time.hour);
	function tick() {
		clock.tick();
		clock = clock;
		if(clock.time.hour + clock.time.minute == 0){
			hours = spring();
			minutes = spring();
			$minutes=parseInt(clock.time.hour) *60 + parseInt(clock.time.minute);
			$hours=parseInt(clock.time.hour);	
		}else{
		hours.set(parseInt(clock.time.hour));
		minutes.set(parseInt(clock.time.hour) *60 + parseInt(clock.time.minute));
		}
	}
	setInterval(tick, 1000);
</script>

<main>
<div class="grid-container">
	<div class="column">
	<div>
	<h3>
		{#if clock.alarmIsTrigger == true}
			WAKE UP!!
		{:else}
			Alarm: {clock.alarmTime}
		{/if}
	</h3>
	<div>
        {#key clock.time.hour}
            <span in:fly={{ y: -20 }}>
                {clock.time.hour}
            </span>
        {/key}
        <span>:</span>
        {#key clock.time.minute}
            <span in:fly={{ y: -20 }}>
                {clock.time.minute}
            </span>
        {/key}
    </div>
	<button on:click={() => (clock.toggleAlarm())} class="button-3d" id="C-button1">ToggleAlarm</button>
		<input type="time" bind:value={clock.setAlarmFromString}>
	<p id="time" />
	<p id="alarm" />
	</div>
	</div>
	<div class="column">	
		<h3>
			{#if clock.alarmIsTrigger == true}
				WAKE UP!!
			{:else}
				Alarm: {clock.alarmTime} {/if}
		</h3>
		<cir>
			<svg viewBox="-50 -50 100 100" style="height:inherit">
				<circle class="clock-face" r="48" />
				<!-- markers -->
				{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
					<line class="major" y1="40" y2="45" transform="rotate({30 * minute})" />
					{#each [1, 2, 3, 4] as offset}
						<line
							class="minor"
							y1="42"
							y2="45"
							transform="rotate({6 * (minute + offset)})"
						/>
					{/each}
				{/each}
				<!-- hour hand -->
				<line
					class="hour"
					y1="33"
					y2="38"
					transform="rotate({(6 / 12) * $minutes - 180})"
				/>
				<!-- minute hand -->
				<g transform="rotate({6 * $minutes - 180})">
					<line class="minute" y1="30" y2="38" />
				</g>
			</svg>
		</cir>
		<div><button on:click={() => (clock.toggleAlarm())} class="button-3d" id="C-button2">ToggleAlarm</button>
			<input type="time" bind:value={clock.setAlarmFromString}> </div>
		</div>
		<div class="column">
			<h3>
				{#if clock.alarmIsTrigger == true}
					WAKE UP!!
				{:else}
					Alarm: {clock.alarmTime}
				{/if}
			</h3>
			<rec>
				<svg width="20" height="10" style="height:inherit">
					<rect width="100%" height="100%" style="fill:rgb(79,79,79);stroke-height:1;stroke:rgb(0,0,0)" />
					<rect height="{(clock.time.minute/60) * 100}%" width="50%" style="fill:rgb(0,0,0);stroke-height:1;stroke:rgb(0,0,0)" />
					<rect height="{(clock.time.minute/60 + clock.time.hour/24 * 100)}%" width="50%" x="50%" style="fill:rgb(0,0,0);stroke-height:1;stroke:rgb(0,0,0)" />
				</svg>
			</rec>
			<p>
				<!--Tid: {clock.time}-->
			</p>
			<div><button on:click={() => (clock.toggleAlarm())} class="button-3d" id="C-button2">ToggleAlarm</button>
				<input type="time" bind:value={clock.setAlarmFromString}> </div>
			<p id="time" />
			<p id="alarm" />
			</div>		
</div>			
</main>

<style>
	:global(html,body) {
		margin: 0px;
		padding: 0px;
		min-height: 100%;
		width: 100%;
	}
	main {
		color: red;
		text-align: center;
		background:linear-gradient(45deg, whitesmoke, black);
		background-size: 2600% 100%;
        animation: gradient 5s linear infinite;
		background-color: whitesmoke;
		width: 100%;
		min-height: 100%;
		display:flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		margin: 0px;
	}
	.grid-container {
		display: grid;
		grid-template-columns: auto auto auto;
		grid-gap: 1em;
		padding: 1em;
	}
	.grid-container>div{
		background-color: rgba(255, 255, 255, 0.6);
  		text-align: center;
  		padding:0;
  		font-size: 2em;
		height: 100%;
		width: 100%;
	}
	svg {
        width: 100%;
        height: 100%;
    }
    .clock-face {
        stroke: #000;
        fill: none;
    }
    .minor {
        stroke: #000;
        stroke-width: 0.4;
    }
    .major {
        stroke: #000;
        stroke-width: 0.8;
    }
    .minute {
        stroke: rgb(180, 0, 0);
        stroke-width: 1;
    }
    .hour {
        stroke: #000;
        stroke-width: 2;
    }
	.column{
		display:flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		min-height: 100%;
	}
	cir{
		height: 7em;
	}
	rec{
		height: 7em;
		width: 75%;
	}
	@keyframes gradient {
		33% {
            background-position:33%;
        }
        50% {
            background-position:50%;
        }
	}
	h3{
		color: red;
	}
	p {
		font-size: 2em;
		color: black;
		text-align: center;
	}
	span {
		display: inline-block;
		font-size: 3em;
		color: black;
	}
	.button-3d {
 	position:relative;
  	width: auto;
  	display:inline-block;
  	color:#000000;
  	text-decoration:none;
  	border-radius:20px;
  	border:solid 1px #797979;
  	background:#0000ff;
  	text-align:center;
  	padding:16px 18px 14px;
  	margin: 12px;
  	-webkit-transition: all 0.1s;
		-moz-transition: all 0.1s;
		transition: all 0.1s;
  	-webkit-box-shadow: 0px 6px 0px #797979;
  	-moz-box-shadow: 0px 6px 0px #797979;
  	box-shadow: 0px 6px 0px #797979;
	}
	.button-3d:active{
    	-webkit-box-shadow: 0px 2px 0px #000000;
    	-moz-box-shadow: 0px 2px 0px #000000;
    	box-shadow: 0px 2px 0px #000000;
    	position:relative;
    	top:4px;
	}
	#C-button1{
		border-radius: 10px;
		background: white;
		color: #000000;	
	}
	#C-button2{
		border-radius: 20px;
		background: white;
		color: #000000;
	}
	@media only screen and (max-width: 870px) {
  		.grid-container {
			display: flex;
			flex-direction: column;
			column-gap: 1em;
			height: 100%;
			padding: 1em;
  		}
	}
</style>
