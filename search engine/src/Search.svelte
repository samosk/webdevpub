<script>
    import { promise } from "./stores.js";
    let question;
    async function search() {
        const res = await fetch(
            `https://demo.dataverse.org/api/search?q=` + question
        );
        const json = await res.json();
         if (res.ok) {
            return json;
        } else {
            throw new Error(json);
        } 
    }
    let searched=false;
</script>
{#if searched==false}
    <p id="bild"> <img src="https://pbs.twimg.com/profile_images/1163151704973615105/62PeCDbZ_400x400.jpg" alt="yeas" width="100em"> </p>
{/if}
<div class:searched>
    <form
        on:submit|preventDefault={async () => {
            $promise = search();
            await $promise;
            searched = true;
        }}
    >
        <input bind:value={question} />
    </form>
</div>

<style>
    div {
        display: flex;
        gap: 10px;
        width: 50%;
        justify-self: center;
        align-items: center;
        transition: all 1s;
    }
    form,
    form input {
        width: 100%;
        margin-top: 5%;
        margin-left: 5%;
    }
    div.searched {
        display: flex;
        align-self: flex-start;
        justify-self: start;
        align-items: start;
        margin: 0;
    }
</style>