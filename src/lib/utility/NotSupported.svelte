<script lang="ts">
    import { invoke } from "@tauri-apps/api";
    import EditOff from "carbon-icons-svelte/lib/EditOff.svelte";
    export let hidden = false;
    export let path = "";
</script>

<div class="container" class:hidden>
    <div class="unsupported">
        <EditOff size={32} />
        <span class="desc">The file cannot be displayed because it is either binary or uses an unsupported text encoding.</span>
        <span class="link" on:click={() => {invoke("open_in_explorer", {path: path})}}>Open in File Explorer</span>
    </div>
</div>

<style lang="scss">
    .container {
        background-color: #171717;
        height: 100%;
        display: flex;
        .unsupported {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60%;
            width: 100%;
            :global(svg) {
                width: 48px;
                height: 48px;
                color: #376ba3;
                padding: 20px 0;
            }
            .desc {
                color: #939393;
            }
            .link {
                font-size: 0.9rem;
                color: #939393;
                cursor: pointer;
                text-decoration: underline;
                &:hover {
                    color: #4d73ad;
                }
                padding: 5px 0;
            }
        }
    }
    .hidden {
        display: none !important;
    }
</style>