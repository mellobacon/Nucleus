<script lang="ts">
    import { Modal } from "carbon-components-svelte";
    import Input from "../Input/Input.svelte";
    import { fs } from "@tauri-apps/api";
    import { updateTree } from "../FileTree/TreeData";
    export let open = false;
    export let filename = "";
    export let path = "/";
    let filenameinput = "";
    let extinput = filenameinput.split(".")[1]
        ? filenameinput.split(".")[1]
        : "-";

    let invalid = false;
    function getExt() {
        extinput = filenameinput.split(".")[1];
        if (extinput === undefined || extinput === "") {
            extinput = "-";
        }
    }
</script>

<Modal
    preventCloseOnClickOutside
    bind:open
    modalHeading="Rename {filename}"
    on:open
    on:close
    passiveModal
>
    <div class="modelcontent">
        <div class="description">
            <p>Give a new name to {filename}</p>
        </div>
        <div class="input">
            <Input
                invalid={invalid}
                bind:value={filenameinput}
                labelText="Name:"
                placeholder="Enter name..."
                invalidText="Enter a name for your file"
                on:input={() => {
                    invalid = false;
                    getExt();
                }}
            />
            <div class="divider" />
            <Input
                readonly
                placeholder={extinput}
                _class="rename-ext"
                labelText="Extension:"
            />
        </div>
        <div class="buttongroup">
            <div class="button disabled">Back</div>
            <div
                class="button"
                on:click={async () => {
                    if (filenameinput === "" || undefined) {
                        invalid = true;
                        return;
                    }
                    let oldpath = path;
                    let newpath = path.split("\\");
                    newpath.pop();

                    newpath.push(`${filenameinput}`);
                    path = newpath.join("\\");

                    await fs.renameFile(oldpath, path);
                    await updateTree();
                    open = false;
                }}
            >
                Rename
            </div>
        </div>
    </div>
</Modal>

<style>
    .modelcontent {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .description {
        width: 100%;
    }
    .button {
        width: 80px;
        height: 35px;
        border-radius: 1px;
        margin: 0 5px 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2276b2;
        color: #f9f9f9;
        cursor: pointer;
    }
    .button:hover {
        background-color: #195b8a;
    }
    .buttongroup {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
    .disabled {
        background-color: #a9a9a9;
        color: #7a7a7a;
        cursor: not-allowed;
    }
    .input {
        display: flex;
    }
    .divider {
        width: 0.025rem;
        height: 2.5rem;
        margin: 24px 0px 0 0px;
        content: "";
        background-color: #606060;
    }
    :global(.rename-ext) {
        flex-grow: inherit;
    }
</style>
