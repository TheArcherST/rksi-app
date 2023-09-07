import {AutoComplete} from "primereact/autocomplete";
import {CSSProperties, useState} from "react";

import Entity from "../../interfaces/entity";
import {en} from "chrono-node";


interface CellSelectProps<T> {
    entity: T | null;
    setEntity: ((entity: T) => any);
    resolveEntitiesMention: (mention: string) => (Promise<T[]>);
    style?: CSSProperties | undefined;
}


export default function CellSelect<T extends Entity>(props: CellSelectProps<T>) {
    const [suggestions, setSuggestions] = useState<T[]>([]);
    const [tempValue, setTempValue] = useState<string | null>(null);
    return (
        <AutoComplete
            field={"display_text"}
            forceSelection
            value={tempValue !== null ? tempValue : (props.entity || "")}
            completeMethod={
                (e) => {
                    props.resolveEntitiesMention(e.query)
                        .then(entities => {
                            setSuggestions(entities)
                        })
                }
            }
            style={props.style}
            suggestions={suggestions}
            onAbort={() => {
                setTempValue(null);
            }}
            onSubmit={(e) => {
                setTempValue(null);
            }}
            onChange={(e) => {
                if (e.value === null) {
                    setTempValue(null);
                } else if (!(e.value instanceof Object)) {
                    setTempValue(e.value);
                } else {
                    props.setEntity(e.value);
                    setTempValue(null);
                }
            }}/>
    );
}
