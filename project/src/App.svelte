<script>
    import wallpaper from "./wallpaper.js";
</script>
<style>
    /* * {
      box-sizing: border-box;
    }
    main {
      margin: 0;
      padding: 0;
      max-height: 1000px;
      font-family: Arial;
      overflow-y: auto;
    } */
    
    /* The grid: Four equal columns that floats next to each other */
    /* .column {
      
      float: left;
      width: 250px;
      margin-left: -10px;
      margin-right: -10px;
    } */
    
    /* Style the images inside the grid */
    /* .column img {
      opacity: 0.8; 
      cursor: pointer;
    }
    
    .column img:hover {
      opacity: 1;
    }
    .row{
      overflow-x: scroll;
      width: 100%;
      display: grid;
      padding-left: 8px;
      grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto;
    } */
    /* Clear floats after the columns */
    /* .row:after {
      content: "";
      display: table;
      clear: both;
    } */
    
    /* The expanding image container */
    /* .container {
      position: relative;
      display: none;
      margin-left: 4px;
    }
    img{
      max-width: 1600px;
      max-height: 800px;
      border-radius: 60px;
    } */
    
    /* Expanding image text */
    /* #imgtext {
      position: absolute;
      bottom: 15px;
      left: 15px;
      color: white;
      font-size: 20px;
    } */
    
    /* Closable button inside the expanded image */
    /* .closebtn {
      position: absolute;
      top: 10px;
      right: 15px;
      color: white;
      font-size: 35px;
      cursor: pointer;
    } */
section {
  background: #F4F4F4;
  padding: 50px 0;
}

.container {
  max-width: 1044px;
  margin: 0 auto;
  padding: 0 20px;
}

.carousel {
  display: block;
  text-align: left;
  position: relative;
  margin-bottom: 22px;
}
.carousel > input {
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
}
.carousel > input:nth-of-type(6):checked ~ .carousel__slides .carousel__slide:first-of-type {
  margin-left: -500%;
}
.carousel > input:nth-of-type(5):checked ~ .carousel__slides .carousel__slide:first-of-type {
  margin-left: -400%;
}
.carousel > input:nth-of-type(4):checked ~ .carousel__slides .carousel__slide:first-of-type {
  margin-left: -300%;
}
.carousel > input:nth-of-type(3):checked ~ .carousel__slides .carousel__slide:first-of-type {
  margin-left: -200%;
}
.carousel > input:nth-of-type(2):checked ~ .carousel__slides .carousel__slide:first-of-type {
  margin-left: -100%;
}
.carousel > input:nth-of-type(1):checked ~ .carousel__slides .carousel__slide:first-of-type {
  margin-left: 0%;
}
.carousel__slides {
  position: relative;
  z-index: 1;
  padding: 0;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
}

.carousel__slide {
  position: relative;
  display: block;
  flex: 1 0 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: all 300ms ease-out;
  vertical-align: top;
  box-sizing: border-box;
  white-space: normal;
}
.carousel__slide figure {
  display: flex;
  margin: 0;
}
.carousel__slide div {
  position: relative;
  width: 100%;
}
.carousel__slide div:before {
  display: block;
  content: "";
  width: 100%;
  padding-top: 66.6666666667%;
}
.carousel__slide div > img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.carousel__slide img {
  display: block;
  flex: 1 1 auto;
  object-fit: cover;
}
.carousel__slide figcaption {
  align-self: flex-end;
  padding: 20px 20px 0 20px;
  flex: 0 0 auto;
  width: 25%;
  min-width: 150px;
}
.carousel__slide .credit {
  margin-top: 1rem;
  color: rgba(0, 0, 0, 0.5);
  display: block;
}
.carousel__slide.scrollable {
  overflow-y: scroll;
}

.carousel__thumbnails {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  margin: 0 -10px;
}
.carousel__slides + .carousel__thumbnails {
  margin-top: 20px;
}
.carousel__thumbnails li {
  flex: 1 1 auto;
  max-width: calc((100% / 6) - 20px);
  margin: 0 10px;
  transition: all 300ms ease-in-out;
}
.carousel__thumbnails label {
  display: block;
  position: relative;
}
.carousel__thumbnails label:before {
  display: block;
  content: "";
  width: 100%;
  padding-top: 100%;
}
.carousel__thumbnails label > img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.carousel__thumbnails label:hover, .carousel__thumbnails label:focus {
  cursor: pointer;
}
.carousel__thumbnails label:hover img, .carousel__thumbnails label:focus img {
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.25);
  transition: all 300ms ease-in-out;
}
.carousel__thumbnails img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
    </style>
    
    <main>
    
    
    <!-- The four columns -->
    <!-- <div class="row">
      <div class="column">
        <img src={wallpaper.Nature[0].picture} alt="1" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[1].picture} alt="2" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[2].picture} alt="3" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[3].picture} alt="4" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[4].picture} alt="5" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[5].picture} alt="6" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[6].picture} alt="7" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[7].picture} alt="8" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[8].picture} alt="9" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[9].picture} alt="10" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[10].picture} alt="11" style="width:100%" onclick="myFunction(this);">
      </div>
      <div class="column">
        <img src={wallpaper.Nature[11].picture} alt="12" style="width:100%" onclick="myFunction(this);">
      </div>
    </div>
    
    <div class="container">
      <span onclick="this.parentElement.style.display='none'" class="closebtn">&times;</span>
      <img id="expandedImg" style="width:75%, align:center" alt="">
      <div id="imgtext"></div>
    </div> -->
    
      <section>
          <div class="container">
              <div class="carousel">
                  <input type="radio" name="slides" checked="checked" id="slide-1">
                  <input type="radio" name="slides" id="slide-2">
                  <input type="radio" name="slides" id="slide-3">
                  <input type="radio" name="slides" id="slide-4">
                  <input type="radio" name="slides" id="slide-5">
                  <input type="radio" name="slides" id="slide-6">
                  <ul class="carousel__slides">
                      <li class="carousel__slide">
                          <figure>
                              <div>
                                  <img src={wallpaper.Nature[0].picture} alt="">
                              </div>
                              <figcaption>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                  <span class="credit">Photo: Tim Marshall</span>
                              </figcaption>
                          </figure>
                      </li>
                      <li class="carousel__slide">
                          <figure>
                              <div>
                                  <img src="https://picsum.photos/id/1043/800/450" alt="">
                              </div>
                              <figcaption>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                  <span class="credit">Photo: Christian Joudrey</span>
                              </figcaption>
                          </figure>
                      </li>
                      <li class="carousel__slide">
                          <figure>
                              <div>
                                  <img src="https://picsum.photos/id/1044/800/450" alt="">
                              </div>
                              <figcaption>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                  <span class="credit">Photo: Steve Carter</span>
                              </figcaption>
                          </figure>
                      </li>
                      <li class="carousel__slide">
                          <figure>
                              <div>
                                  <img src="https://picsum.photos/id/1045/800/450" alt="">
                              </div>
                              <figcaption>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                  <span class="credit">Photo: Aleksandra Boguslawska</span>
                              </figcaption>
                          </figure>
                      </li>
                      <li class="carousel__slide">
                          <figure>
                              <div>
                                  <img src="https://picsum.photos/id/1049/800/450" alt="">
                              </div>
                              <figcaption>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                  <span class="credit">Photo: Rosan Harmens</span>
                              </figcaption>
                          </figure>
                      </li>
                      <li class="carousel__slide">
                          <figure>
                              <div>
                                  <img src="https://www.itl.cat/pngfile/big/324-3247104_desktop-wallpaper-free-download-nature-photography.jpg" alt="">
                              </div>
                              <figcaption>
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                  <span class="credit">Photo: Annie Spratt</span>
                              </figcaption>
                          </figure>
                      </li>
                  </ul>
                  <ul class="carousel__thumbnails">
                      <li>
                          <label for="slide-1"><img src={wallpaper.Nature[0].picture} alt=""></label>
                      </li>
                      <li>
                          <label for="slide-2"><img src="https://picsum.photos/id/1043/150/150" alt=""></label>
                      </li>
                      <li>
                          <label for="slide-3"><img src="https://picsum.photos/id/1044/150/150" alt=""></label>
                      </li>
                      <li>
                          <label for="slide-4"><img src="https://picsum.photos/id/1045/150/150" alt=""></label>
                      </li>
                      <li>
                          <label for="slide-5"><img src="https://picsum.photos/id/1049/150/150" alt=""></label>
                      </li>
                      <li>
                          <label for="slide-6"><img src="https://www.itl.cat/pngfile/big/324-3247104_desktop-wallpaper-free-download-nature-photography.jpg" alt=""></label>
                      </li>
                  </ul>
              </div>
          </div>
      </section>
    
    
    <script>
        
        // function myFunction(imgs) {
        //   var expandImg = document.getElementById("expandedImg");
        //   var imgText = document.getElementById("imgtext");
        //   expandImg.src = imgs.src;
        //   imgText.innerHTML = imgs.alt;
        //   expandImg.parentElement.style.display = "block";
        // }
    </script>
    </main>