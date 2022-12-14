<script>
    import NumberInput from "../../../../components/Input/NumberInput.svelte";
import Dropdown from "../../../../components/Input/Dropdown.svelte";

    let themes = [
        {id: 0, name: "Light"},
        {id: 1, name: "Dark"},
    ]
    let fonts = [
        {id: 0, name: "Roboto"},
        {id: 1, name: "Fira Code"},
    ]
</script>
<Dropdown label="Theme" items={themes}></Dropdown>
<NumberInput label="Font Size"></NumberInput>