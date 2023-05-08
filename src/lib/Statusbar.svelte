<div id="statusbar">
    <div id="title">
        <span>Nucleus</span>
        <div class="divider"></div>
    </div>
    <div class="editor-tools">
        
    </div>
</div>

<style lang="scss">
    #statusbar {
        z-index: 8000;
        width: -webkit-fill-available;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
    }
    #title {
        color: #8c8c8c;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        span {
            height: 100%;
            padding: 0 10px;
        }
    }
    .divider {
        width: 0.0625rem;
		height: 1rem;
    }
    .editor-tools {
        height: 100%;
        width: -webkit-fill-available;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 10px;
    }
</style>