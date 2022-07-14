<script lang="ts">
    import Editor from "./Editor/Editor.svelte";
    import Footer from "../Footer/Footer.svelte";
</script>

<div id="container">
    <div class="main">
        
    </div>
    <Footer></Footer>
</div>

<style>
    #container {
        flex-grow: 1;
        height: 100%;
    }
    .main {
        width: 100%;
        height: calc(100% - 1.4rem);
        background-image: url("/assets/images/Watermark(3).png");
        background-repeat: no-repeat;
        background-position: center;
    }
</style>