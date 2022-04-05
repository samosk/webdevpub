<script>
import SearchBar from "./SearchBar.svelte";
import MenuIcons from "./MenuIcons.svelte";
import Categories from "./Categories.svelte";
import RMY from "./RMY.svelte";
import Trend from "./Trend.svelte";
import Subs from "./Subs.svelte";
</script>

<main>
	<header class="header">
		
		<!-- <a href="#0">
			<img src="logo.svg" alt="YouTube Logo" class="youtube-logo"/>
		</a> -->
		<SearchBar/>

		<MenuIcons/>
	</header>
	<Categories/>

	<div class="videos">
		<RMY/>

		<Trend/>

		<Subs/>
	</div>
</main>

<style>
	*, *::before, *::after {
  box-sizing: border-box;
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

main {
  margin: 0;
}

.videos {
  background-color: #F9F9F9;
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

</style>