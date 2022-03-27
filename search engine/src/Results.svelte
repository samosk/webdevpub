<script>
    export let json;
    import { fly, fade, slide, draw } from "svelte/transition";
</script>

{#if json && "data" in json && "items" in json.data && json.data.items.length > 0}
    <div id = "item-holder">
        {#each json.data.items as item}
            {#if item.type == "dataverse"}
                <div id = "item">
                    {#each Object.entries(item) as [key, value]}
                        <!-- <p in:fade>{JSON.stringify(key)} {JSON.stringify(value)}</p> -->
                    {/each}
                    <p>
                        {item.url}
                    </p>
                    <h2>
                        <a href="{item.url}">
                            {item.identifier}
                        </a>
                    </h2>
                    <h3 class="max-chars">
                        {item.description}
                    </h3>
                    <h4 class="date">
                        {item.published_at}
                    </h4>
                </div>
            {/if}
        {/each}
    </div>
{:else if json}
    <div>
        <h2>Invalid search request</h2>
    </div>
{/if}

<style>
    #item-holder {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        overflow-y: scroll;
        box-sizing: border-box;
        padding-left: 5%;
        padding-right: 5%;
        row-gap: 3%;
        min-width: 100%;
    }
    #item {
        border-radius: 25px;
        background-color: #81d4fa;
        border: 2px solid #ffffff;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 5px;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
    }
    h2{
        color: aliceblue;
    }
    h3{
        word-wrap: break-word;
        word-break: normal;
    }
    p {
        padding: 2px;
    }
    a{
        color: #710193;
        
    }
    a:hover{
        color: #0000ff;
        transition: 200ms;
    }
    /** https://onaircode.com/html-css-custom-scrollbar-examples/ */
    ::-webkit-scrollbar {
        width: 15px;
        height: 15px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: rgba(0, 0, 139, 0.4);
    }
    ::-webkit-scrollbar-thumb {
        background: #81d4fa;
        border-radius: 50px;
    }
    .max-chars{
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 2em;
        max-height: 8em;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .date{
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        max-width: 5rem;
        text-overflow: clip;
    }
    @media only screen and (max-width:425px){
        #item-holder{
            background-size: cover;
            height: 100vh;
            width: 100vw;
            padding-bottom: 25px;
        }
        a{
            font-size: 1.2rem;
        }
        h3, p{
            font-size: 0.9rem;
        }
        .date{
            font-size: 0.8rem;
        }
        
    }
</style>