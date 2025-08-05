<svelte:options customElement={{tag: "search-panel", shadow:"none"}} />

<script lang="ts">
    import { afterUpdate } from "svelte";
    import DownArrow from "../../../assets/icons/down_arrow.svelte";
    import Matchcase from "../../../assets/icons/matchcase.svelte";
    import Matchword from "../../../assets/icons/matchword.svelte";
    import Regex from "../../../assets/icons/regex.svelte";
    import UpArrow from "../../../assets/icons/up_arrow.svelte";
    import Uppercase from "../../../assets/icons/uppercase.svelte";
    import Replace from "../../../assets/icons/replace.svelte";
    import ReplaceOne from "../../../assets/icons/replace_one.svelte";
    import ReplaceAll from "../../../assets/icons/replace_all.svelte";
    import { tooltip } from "../../../scripts/tooltip";
    import Input from "../Input.svelte";

    import { closeSearchPanel, findNext, findPrevious, replaceAll, replaceNext, SearchCursor, SearchQuery, selectMatches, setSearchQuery } from "@codemirror/search";
    import { editorV } from "../../Editor.svelte";

    let toggleReplace = false;

    let findQuery = "";
    let replaceQuery = "";
    let matchCase = false;
    let matchWord = false;
    let PreserveCase = false;
    let regex = false;

    let view = $editorV;

    afterUpdate(() => {
        let query = new SearchQuery({
            "caseSensitive": matchCase,
            "regexp": regex,
            "search": findQuery,
            "wholeWord": matchWord,
            "replace": replaceQuery
        })
        findTotalMatches();
        view.dispatch({ effects: setSearchQuery.of(query) });
        selectMatches($editorV)
    })

    let totalMatches = 0;
    function moveToNext() {
        if (totalMatches === 0) return;
        findNext($editorV);
    }
    function tryReplace() {
        if (totalMatches === 0) return;
        replaceNext($editorV)
        findTotalMatches();
    }

    function findTotalMatches() {
        const cursor = new SearchCursor($editorV.state.doc, findQuery);
        let n = 0;
        while (!cursor.done) {
            cursor.next();
            n += 1;
        }
        totalMatches = n - 1;
    }
</script>

<div class="search-panel">
    <div class="search">
        <div class="find">
            <Input placeholder="Find" _class="input" bind:value={findQuery} autofocus />
            <small id="result-count">Total matches: {totalMatches}</small>
            <div class="divider"></div>
            <div class="toggles">
                <span class="toggle" class:active={toggleReplace} role="button" tabindex="0" on:keydown use:tooltip title="Toggle Replace Field" data-tooltip-top-offset="110" on:click={() => toggleReplace = !toggleReplace}>
                    <Replace />
                </span>
                <span class="toggle" role="button" tabindex="0" on:keydown use:tooltip title="Previous Occurance" data-tooltip-top-offset="110" on:click={() => findPrevious($editorV)}>
                    <UpArrow />
                </span>
                <span class="toggle" role="button" tabindex="0" on:keydown use:tooltip title="Next Occurance" data-tooltip-top-offset="110" on:click={moveToNext}>
                    <DownArrow />
                </span>
                <span class="toggle" class:active={matchCase} role="button" tabindex="0" on:keydown use:tooltip title="Match Case" data-tooltip-top-offset="110" on:click={() => matchCase = !matchCase}>
                    <Matchcase />
                </span>
                <span class="toggle" class:active={matchWord} role="button" tabindex="0" on:keydown use:tooltip title="Match Word" data-tooltip-top-offset="110" on:click={() => matchWord = !matchWord}>
                    <Matchword />
                </span>
                <span class="toggle" class:active={regex} role="button" tabindex="0" on:keydown use:tooltip title="Regex" data-tooltip-top-offset="110" on:click={() => regex = !regex}>
                    <Regex />
                </span>
            </div>
        </div>
        {#if toggleReplace}
            <div class="replace">
                <Input placeholder="Replace" _class="input" bind:value={replaceQuery} />
                <div class="toggles">
                    <span class="toggle" use:tooltip title="Preserve Case" data-tooltip-top-offset="145">
                        <Uppercase />
                    </span>
                    <div class="divider"></div>
                    <span class="toggle" role="button" tabindex="0" on:keydown use:tooltip title="Replace" data-tooltip-top-offset="145" on:click={tryReplace}>
                        <ReplaceOne />
                    </span>
                    <span class="toggle" role="button" tabindex="0" on:keydown use:tooltip title="Replace All" data-tooltip-top-offset="145" on:click={() => replaceAll($editorV)}>
                        <ReplaceAll />
                    </span>
                </div>
            </div>
        {/if}
    </div>
</div>

<div class="close" role="button" tabindex="0" on:keydown title="Close (Escape)" on:click={() => closeSearchPanel($editorV)}>
    <span></span>
</div>

<style lang="scss">
    .search-panel {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 10px;
        .search {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 10px;
        }
        .find, .replace {
            width: 100%;
            display: grid;
            align-items: center;
            grid-gap: 10px;
            justify-content: flex-start;
            :global(.input) {
                margin: 0;
                :global(input) {
                    padding: 2px 10px;
                }
            }
            small {
                white-space: nowrap;
            }
        }
        .find {
            grid-template-columns: minmax(70px, 1fr) max-content auto auto;
        }
        .replace {
            grid-template-columns: minmax(70px, 1fr) 269px;
        }
        .divider {
            width: 0.0625rem;
            min-width: 0.0625rem;
            height: 1rem;
        }
        .toggles {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 65%;
            .toggle {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
                z-index: 10;
                border-radius: 2px;
                width: 15px;
                height: 20px;
                cursor: pointer;
                :global(svg) {
                    width: 20px;
                    height: 20px;
                }
                &:hover {
                    background-color: var(--header-buttonHoverBackground);
                }
                &.active {
                    outline: 1px solid var(--window-borderColor);
                }
            }
        }
    }

    .close span {
        font-size: 14px;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        align-items: center;
        line-height: normal;
        &::before {
            content: "\2715";
        }
    }
    .close span:hover {
        transition: 0.1s;
        border-radius: 3px;
        background-color: var(--editor-tabBorderColor);
    }
    .close {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        position: relative;
        cursor: pointer;
        z-index: 11;
    }
</style>
