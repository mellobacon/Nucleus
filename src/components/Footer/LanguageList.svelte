<script lang="ts">
    import { Modal, Search } from "carbon-components-svelte";
    import { setFileLanguage } from "../../scripts/EditorFile";

    export let showlangs = false;
    export let langs;

    let selectedlang = "None";
    let langmode = null;
</script>

<Modal
    bind:open={showlangs}
    modalHeading="Languages"
    on:open
    on:close
    passiveModal
>
    <div id="model-content">
        <Search placeholder="Search for a language" size="lg"></Search>
        <div id="langlist">
            <div><span class="note">Missing a language? Search for new ones in Extensions ></span></div>
            {#each langs as language}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="language" on:click={() => {
                    selectedlang = language.lang;
                    langmode = language.mode;
                }}>
                    <span class="name">{language.lang}</span>
                    <span class="tags">
                        {#each language.tags as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </span>
                </div>
            {/each}
        </div>
        <div id="selected">Selected: {selectedlang}</div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="button" on:click={async() => {
            setFileLanguage(selectedlang, langmode);
            showlangs = false;
        }}>
            Select
        </div>
    </div>
</Modal>

<style>
    :global(.bx--modal-container) {
        max-height: none !important;
    }
    :global(#language-dropdown .bx--modal-content) {
        margin-bottom: 0 !important;
    }
    #model-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    #langlist {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        background-color: #1e1e1e;
        padding: 20px;
        height: 350px;
        overflow-y: overlay;
    }
    #langlist::-webkit-scrollbar {
        width: 10px;
    }
    #langlist::-webkit-scrollbar-thumb {
        background-color: #414141;
    }
    #langlist>div {
        display: flex;
        justify-content: flex-start;
        width: 100%;
    }
    .note {
        font-size: 10px;
        color: #BDD4FF;
        text-decoration: underline;
        cursor: pointer;
    }
    .language {
        padding: 5px 5px;
        border-radius: 3px;
        background-color: #424242;
        display: flex;
        width: 100%;
        justify-content: flex-start;
        margin: 3px 0;
        align-items: center;
        cursor: pointer;
    }
    .language:hover {
        background-color: #2276B2;
    }
    .tags {
        margin-left: auto;
        display: flex;
    }
    .tag {
        margin: 0 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        padding: 0 5px;
        color: #717171;
        background-color: #424242;
    }
    #selected {
        font-size: 20px;
        margin: 15px 0;
    }
    #button {
        width: 100px;
        height: 30px;
        background-color: #2276B2;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    #button:hover {
        background-color: #195b8a;
    }
</style>