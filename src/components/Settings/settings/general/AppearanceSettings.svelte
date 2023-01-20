<script>
    import NumberInput from "../../../../components/Input/NumberInput.svelte";
    import Dropdown from "../../../../components/Input/Dropdown.svelte";
    import { systemfonts, setFont, autosave } from "../../../../config/config";
    import CheckmarkInput from "../../../../components/Input/CheckmarkInput.svelte";
    import { getThemes } from "../../../../config/themehandler";

    let themes = getThemes();
    let fonts = [
        {id: 0, name: "No fonts found"},
    ]
    if ($systemfonts) {
        fonts = $systemfonts;
    }

    function handleFontSelect(e) {
        setFont(e.detail.selection);
    }
    function toggleAutosave() {
        if ($autosave) {
            autosave.set(false);
        }
        else {
            autosave.set(true);
        }
    }
</script>
<Dropdown label="Window Theme" items={themes}></Dropdown>
<NumberInput label="Editor - Font Size"></NumberInput>
<Dropdown on:select={handleFontSelect} label="Editor - Font Family" items={fonts}></Dropdown>
<CheckmarkInput checked={$autosave} on:change={toggleAutosave} labelText="Editor - Autosave:" title="Toggle autosave for files"></CheckmarkInput>