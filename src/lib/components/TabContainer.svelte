<script lang="ts">
    export let hidden = false;
</script>

<div class="tab-container" class:hidden></div>

<style lang="scss">
    .tab-container {
        width: 100%;
        height: 100%;
        &.hidden {
            display: none;
        }
    }
</style>