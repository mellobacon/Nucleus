<script lang="ts">
    export let label = "";
</script>

<div class="numberinput">
    <span class="label">{label}:</span>
    <div class="input">
        <input type="number" value="13">
    </div>
</div>

<style lang="scss">
    .numberinput {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }
    .input {
        margin-left: 10px;
        height: 2rem;
        width: 3rem;
        input {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white;
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }
    }
</style>