<script lang="ts">
    export let shortcut = "";

    let keys = shortcut.split("+");
</script>

<div class="shortcut">
    {#each keys as key, i}
        <span>{key}</span>
        {#if i + 1 !== keys.length}
            +
        {/if}
    {/each}
</div>

<style lang="scss">
    .shortcut{
        display: flex;
        align-items: center;
        gap: 10px;
        span {
            background-color: var(--window-accent2);
            box-shadow: inset 0px -5px 0px 4px var(--window-accent3);
            padding: 6px 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--window-foreground);
            border-radius: 3px;
            font-size: 14px;
        }
    }
</style>