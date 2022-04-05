<script>

</script>
<form class="search-bar">
    <input class="search-input" type="search" placeholder="Search" aria-label="Search">
    <button type="submit" class="search-btn">
        <img src="magnify.svg" alt="magnify">
    </button>
</form>
<style>
    .search-bar {
  display: flex;
  flex-grow: 1;
  margin: 0 2rem 0 4rem;
}

.search-input {
  width: 100%;
  font-size: inherit;
  padding: .4em;
  border: 1px solid #777;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.search-btn{
	display: flex;
	align-items: center;
	padding: 0 1.25rem;
	border: 1px solid #777;
	background-color: #F8F8F8;
	border-left: none;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	cursor: pointer;
}
.search-btn:hover{
	background-color: #F0F0F0;
}
</style>