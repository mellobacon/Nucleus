<script lang="ts">
    import { hidden, tabinfo } from "../Content/Editor/scripts/Tabs";
</script>

<div id="footer">
    <div id="info">
        <div id="apptitle">
            <span>Nucleus</span>
        </div>
    </div>
    {#if !$hidden}
        <div id="codeinfo">
            <span>{$tabinfo}</span>
        </div>
    {/if}
</div>

<style>
    #footer {
        z-index: 8000;
        width: 100%;
        display: flex;
        height: 1.4rem;
        align-items: center;
        border-top: 1px solid #393939;
    }
    #info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-right: 1px solid #393939;
    }
    #codeinfo {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-grow: 1;
    }
    #codeinfo span {
        padding: 0 7px;
    }
    #codeinfo span:nth-child(even) {
        border-right: 1px solid #393939;
        border-left: 1px solid #393939;
    }
    #apptitle {
        padding: 0 15px;
    }
</style>