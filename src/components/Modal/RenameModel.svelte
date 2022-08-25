<script lang="ts">
    import { Modal } from "carbon-components-svelte";
    import Input from "../Input/Input.svelte";
    import { fs } from "@tauri-apps/api";
    import { updateTree } from "../FileTree/TreeData";
    import langlist from "../../scripts/languages/languages.json";
    import { sep } from "@tauri-apps/api/path";
    export let open = false;
    export let filename = "";
    export let path = "/";
    let filenameinput = "";
    let extinput = filenameinput.split(".")[1]
        ? filenameinput.split(".")[1]
        : "-";

    let invalid = false;
    let invalidtext = "";

    function getExt() {
        let _ = filenameinput.split(".");
        if (_.length > 1) {
            extinput = _.slice(-1)[0];
        }
        else if (extinput === undefined || extinput === "") {
            extinput = "-";
        }
        let keys = Object.keys(langlist);
        for (let key of keys) {
            let extensions = langlist[key].extensions;
            if (extensions && extensions.includes(`.${extinput}`)) {
                extinput = `${key}`;
            }
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
                {invalid}
                bind:value={filenameinput}
                labelText="Name:"
                placeholder="Enter name..."
                invalidText={invalidtext}
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
                labelText="File Type:"
            />
        </div>
        <div class="buttongroup">
            <div class="button disabled">Back</div>
            <div
                class="button"
                on:click={async () => {
                    // TODO: process any/all invalid characters (different per OS apparently)
                    
                    if (filenameinput === "" || filenameinput === "." || filenameinput === sep || undefined) {
                        invalid = true;
                        if (filenameinput === "." || filenameinput === sep) {
                            invalidtext = `"${filenameinput}"" is not a valid file or directory name`;
                        }
                        else {
                            invalidtext = "Enter a name for your file";
                        }
                        return;
                    }
                    let oldpath = path;
                    let newpath = path.split(sep);
                    newpath.pop();

                    newpath.push(`${filenameinput}`);
                    path = newpath.join(sep);

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
