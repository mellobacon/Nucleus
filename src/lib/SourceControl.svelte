<script>
    import Checkmark from "../assets/icons/checkmark.svelte";
    import Github from "../assets/icons/github.svelte";
    import Gitlab from "../assets/icons/gitlab.svelte";
    import Sourcetree from "../assets/icons/sourcetree.svelte";
    import Button from "./components/Button.svelte";
    import Input from "./components/Input.svelte";

    export let openFolder = false;
    export let gitInit = false;
</script>

<div id="source-control">
    {#if !openFolder}
        <div id="init">
            {#if gitInit}
                <p>The opened folder doesn't contain a Git repository, or one can't be found. Initialize a repository to enable source control features</p>
                <div class="buttons">
                    <Button _class="button" style="secondary" label="Initialize Repository" />
                    <Button _class="button" style="secondary" label="Publish to GitHub" icon={Github} />
                    <Button _class="button" style="secondary" label="Publish to GitLab" icon={Gitlab} />
                    <Button _class="button" style="secondary" label="Publish to SourceTree" icon={Sourcetree} />
                </div>
            {:else}
                <p>In order to use source control features you have to open a folder with a valid git repository, or you can clone a repository from a URL.</p>
                <div class="buttons">
                    <Button _class="button" style="secondary" label="Open Folder" />
                    <Button _class="button" style="secondary" label="Clone Repository" />
                </div>
            {/if}
            <p>To learn more about Git, <a href="/" title="/">click here</a></p>
        </div>
    {:else}
        <div id="git">
            <div class="commit">
                <Input placeholder="Enter commit message..." />
                <Button _class="button" style="accent" label="Commit" icon={Checkmark} />
            </div>
            <p>No changes found (im too lazy to design this part)</p>
        </div>
    {/if}
</div>

<style lang="scss">
    #source-control {
        display: flex;
        padding: 10px 30px;
        height: 100%;
        #git {
            margin-top: 0 !important;
            .commit {
                width: 100%;
                :global(.button) {
                    max-width: none !important;
                }
            }
        }
        #init, #git {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 100px;
            gap: 5px;
            width: 100%;
            font-size: 14px;
            p {
                color: var(--window-descriptionForeground);
            }
            .buttons {
                display: inherit;
                flex-direction: inherit;
                gap: 10px;
                width: 100%;
                align-items: center;
            }
            :global(.button) {
                font-family: inherit;
                text-align: center;
                padding: 8px 30px;
                margin-top: 10px;
                margin-bottom: 5px;
                gap: 5px;
                cursor: pointer;
                font-size: 0.875rem;
                width: 100%;
                max-width: 350px;
            }
        }
    }
</style>
