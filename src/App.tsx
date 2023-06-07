import { useState } from "react";
import Select, { SelectOption } from "./Select";

const options = [
    { label: "One", value: 1 },
    { label: "Two", value: 2 },
    { label: "Three", value: 3 },
    { label: "Four", value: 4 },
    { label: "Five", value: 5 },
];

function App() {
    const [value1, setValue1] = useState<SelectOption[]>([options[0]]);
    const [value2, setValue2] = useState<SelectOption | undefined>(options[0]);
    return (
        <>
            <Select
                multiple
                options={options}
                value={value1}
                onChange={(o) => setValue1(o)}
            />
            <Select
                options={options}
                value={value2}
                onChange={(o) => setValue2(o)}
            />
        </>
    );
}

export default App;
