<script lang="ts">
    export let label = "Loading...";
    export let fail = false;
</script>

<div class="progress-bar-container">
    <div class="progress-bar" id="progress-bar" class:fail></div>
    <label class="label" for="progress-bar">{label}</label>
</div>

<style lang="scss">
    .progress-bar-container {
        padding: 0 20px;
        margin: 5px 0;
    }
    .progress-bar {
        width: 100%;
        height: 0.5rem;
        background-color: #f4f4f4;
        position: relative;
        &.fail {
            background-color: #da1e28;
            &::after {
                display: none;
                background-size: 0% 100% !important;
                animation: none !important;
            }
        }
        &::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            animation-duration: 1.0s;
            animation-iteration-count: infinite;
            animation-name: progress-bar;
            animation-timing-function: linear;
            background-image: linear-gradient(90deg,#0f62fe 12.5%,transparent 12.5%);
            background-position-x: 0%;
            background-size: 300% 100%;
            content: "";
        }
    }
    .label {
        width: 100%;
        text-align: center;
        font-size: 0.9rem;
    }
    @keyframes progress-bar {
        0% {
            background-position-x: 25%
        }

        80%,
        100% {
            background-position-x: -105%
        }
    }
</style>