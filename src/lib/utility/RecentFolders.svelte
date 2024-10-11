<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { openFolder } from '../File';

    let recentFolders: string[] = [];
    let filteredFolders: string[] = [];
    let searchTerm = '';
    let selectedIndex = 0;
    const dispatch = createEventDispatcher();

    onMount(async () => {
        console.log("RecentFoldersPopup mounted");
    
        let data = localStorage.getItem("recentFolders");
        if (data) {
            recentFolders = JSON.parse(data);
            filteredFolders = [...recentFolders];
        } else {
            recentFolders = [];
            filteredFolders = [];
        }
    });

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            console.log("Escape key pressed");
            dispatch('close');
        } else if (event.key === 'ArrowDown') {
            selectedIndex = (selectedIndex + 1) % filteredFolders.length;
            event.preventDefault();
        } else if (event.key === 'ArrowUp') {
            selectedIndex = (selectedIndex - 1 + filteredFolders.length) % filteredFolders.length;
            event.preventDefault();
        } else if (event.key === 'Enter') {
            handleFolderClick(filteredFolders[selectedIndex]);
        }
    }

    function handleFolderClick(folder: string) {
        openFolder(folder);
        dispatch('close');
    }

    $: {
        filteredFolders = recentFolders.filter(folder => 
            folder.toLowerCase().includes(searchTerm.toLowerCase())
        );
        selectedIndex = 0;
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="overlay" on:click={() => dispatch('close')}>
    <div class="popup" on:click|stopPropagation>
        <input 
            type="text" 
            bind:value={searchTerm} 
            placeholder="Search recent folders..."
            autofocus
        />
        {#if filteredFolders.length === 0}
            <p>No matching folders</p>
        {:else}
            <ul>
                {#each filteredFolders as folder, index}
                    <li class:selected={index === selectedIndex}>
                        <button on:click={() => handleFolderClick(folder)}>
                            {folder}
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style lang="scss">
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 10vh;
        z-index: 1000;
    }

    .popup {
        border-radius: 8px;
        padding: 10px;
        width: 80%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        background: rgba(30, 30, 30, 0.90);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        background: rgba(60, 60, 60, 0.5);
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 16px;
    }

    input:focus {
        outline: none;
        box-shadow: 0 0 0 2px #006FF2;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin-bottom: 5px;
    }

    li.selected {
        background-color: rgba(0, 111, 242, 0.2);
        border-radius: 4px;
    }

    button {
        width: 100%;
        text-align: left;
        padding: 8px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    p {
        color: #888;
        text-align: center;
    }
</style>