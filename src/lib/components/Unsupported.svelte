<script lang="ts">
    import EditOff from "../../assets/icons/edit_off.svelte";

    export let hidden = false;
    export let path = "";
</script>

<div class="container" class:hidden>
    <div class="unsupported">
        <EditOff />
        <span class="desc">The file cannot be displayed because it is either binary or uses an unsupported text encoding.</span>
        <a href="/" class="link">Open in File Explorer</a>
    </div>
</div>

<style lang="scss">
    .container {
        height: 100%;
        display: flex;
        padding: 0 20px;
        background-color: var(--window-centerBackground);
        .unsupported {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60%;
            width: 100%;
            .desc {
                color: var(--window-secondaryForeground);
                font-size: 14px;
            }
            :global(svg) {
                width: 48px;
                height: 48px;
                padding: 20px 0;
                color: var(--window-accent);
            }
            .link {
                font-size: 0.9rem;
                padding: 5px 0;
            }
        }
    }
    .hidden {
        display: none !important;
    }
</style>