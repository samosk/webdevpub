<script>

</script>
<div class="categories">
    <section class="category-section">
        <button class="category active">All</button>
        <button class="category">Category 1</button>
        <button class="category">Category 2</button>
        <button class="category">Category 3</button>
        <button class="category">Category 4</button>
        <button class="category">Category 5</button>
        <button class="category">Category 6</button>
        <button class="category">Category 7</button>
        <button class="category">Category 8</button>
        <button class="category">Category 9</button>
    </section>
</div>
<style>
    .categories {
  padding: 1rem 2rem;
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
}

.category-section {
  display: flex;
  overflow: hidden;
}

.category {
  margin-right: 1rem;
  word-wrap: none;
  white-space: nowrap;
  border: 1px solid #CCC;
  border-radius: 690px; /* nice */
  background-color: #E7E7E7;
  padding: .5rem 1rem;
  font-size: inherit;
  cursor: pointer;
  transition: background-color 150ms;
}

.category:hover {
  background-color: #DDD;
}

.category.active {
  background-color: #606060;
  color: white;
  border-color: #EEE;
}

.category:last-child {
  margin-right: 0;
}
</style>