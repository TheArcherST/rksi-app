import {AutoComplete} from "primereact/autocomplete";
import {useState} from "react";

import Entity from "../../interfaces/entity";
import {en} from "chrono-node";



export default function CellSelect<T extends Entity>(
    {
        entity,
        setEntity,
        resolveEntitiesMention,
        ...props
    } : {
        entity: T;
        setEntity: ((entity: T) => any);
        resolveEntitiesMention: (mention: string) => (Promise<T[]>);
    },
) {
    const [suggestions, setSuggestions] = useState<T[]>([]);
    const [tempValue, setTempValue] = useState<string | null>(null);
    return (
        <AutoComplete
            field={"display_text"}
            forceSelection
            value={tempValue !== null ? tempValue : entity}
            completeMethod={
                (e) => {
                    resolveEntitiesMention(e.query)
                        .then(entities => {
                            setSuggestions(entities)
                        })
                }
            }
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
                    setEntity(e.value);
                    setTempValue(null);
                }
            }}
            {...props}/>
    );
}
