<script lang="ts">
    export let label = "link";
    export let href = "#";
    export let _class = ""
</script>

<a href={href} class="link {_class}">{ label }</a>

<style lang="scss">
    .link {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        width: fit-content;
        &:visited {
            color: unset;
        }
    }
</style>