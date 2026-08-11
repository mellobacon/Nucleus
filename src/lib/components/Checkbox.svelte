<script lang="ts">
    export let label = "Label";

    export let checked = false;
    function toggleCheck() {
        checked = !checked;
    }
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="checkbox" on:click={toggleCheck}>
    <label for="checkbox">{label}</label>
    <input type="checkbox" {checked}>
    <div class="checkmark"></div>
</div>

<style lang="scss">
    .checkbox {
        display: block;
        position: relative;
        padding-left: 35px;
        cursor: pointer;
        user-select: none;
        width: min-content;
        margin: 10px 0;
    }
    label {
        cursor: pointer;
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .checkbox input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark {
        position: absolute;
        top: 3px;
        left: 3px;
        height: 16px;
        width: 16px;
        background-color: var(--window-inputBackground);
        outline: solid 1px var(--window-borderColor);
        border-radius: 1.5px;
    }

    .checkbox:hover input ~ .checkmark {
        outline: solid 1px var(--window-borderColor);
    }

    .checkbox input:checked ~ .checkmark {
        background-color: var(--window-buttonAccentHoverBackground);
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    .checkbox input:checked ~ .checkmark:after {
        display: block;
    }

    .checkbox .checkmark:after {
        left: 6px;
        top: 1px;
        width: 3px;
        height: 9px;
        border: solid #f3f3f3;
        border-width: 0 2px 2px 0;
        border-radius: 1px;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>