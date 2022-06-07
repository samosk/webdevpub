<script>
    import wallpaper from "./wallpaper.js";
</script>

<main>
    <div class="nature" id="center" style="overflow: ;hidden">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
    </div>
    <div class="minimal" id="center" style="overflow: ;hidden">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
        <img src={wallpaper.Nature[0].picture} alt="">
    </div>
</main>

<style>
* {
  margin: 0;
  padding: 0;
  
}
:global(body){
    overflow-y: scroll;
    
    overflow-x: hidden;
}
main{
    overflow-y: hidden;
    overflow-x: hidden;
}
img{
    height: 360px;
    border-radius: 40px;
    
}
div{
    gap: 0.5vw;
    float: left;
    overflow-y: hidden;
    overflow-x: hidden;
}
.nature{
    
    top: 20%;
    
    margin-bottom: 100px;
    position: absolute;
    display: flex;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
    overflow-x: scroll;
}
.minimal{
    
    top: 50%;
    
    margin-top: 100px;
    position: absolute;
    display: flex;
    grid-template-columns: auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto;
}
div#center{
    width: 100%;
    margin: 4px, 4px;
    padding: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    background-color: blue;
}
</style>
