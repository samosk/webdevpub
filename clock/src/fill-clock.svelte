<script>

</script>
<main>
    <div class="wrapper">
        <div class="bg">
          <div class="text"></div>
        </div>
      </div>
</main>
<style>
/*$loadingTime: 10s;
$color: rgb(255, 0, 0);*/

.bg {
  background-color: color;
  animation: loading loadingTime linear infinite;
}

.text {
  color: color;
  width: 200px;
  border: 1px solid color;

  /*:after {
    padding-left: 20px;
    content: "0%";
    display: block;
    text-align: center;
    animation: percentage $loadingTime linear infinite;
  }*/
}
.text:after {
    /* This value is the OPPOSITE color of our background */
    color: rgb(0, 255, 255); 
    mix-blend-mode: difference;
}
</style>