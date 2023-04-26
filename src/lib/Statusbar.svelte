<div id="statusbar">
    <div id="title">
        <span>Nucleus</span>
    </div>
</div>

<style lang="scss">
    #statusbar {
        z-index: 8000;
        width: -webkit-fill-available;
        display: flex;
        align-items: center;
        border-top: 1px solid #393939;
        font-size: 0.9rem;
    }
    #title {
        color: #8c8c8c;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-right: 1px solid #393939;
        span {
            height: 100%;
            padding: 0 10px;
        }
    }
</style>