import {AutoComplete} from "primereact/autocomplete";
import {useState} from "react";

import Entity from "../../interfaces/entity";



export default function CellMultiselect<T extends Entity>(
    {
        entitiesArray,
        setEntitiesArray,
        resolveEntitiesMention,
        ...props
    } : {
        entitiesArray: T[];
        setEntitiesArray: ((entities: T[]) => any);
        resolveEntitiesMention: (mention: string) => (Promise<T[]>);
    },
) {
    const [suggestions, setSuggestions] = useState<T[]>([]);

    return (
        <AutoComplete
            field={"display_text"}
            multiple
            forceSelection
            value={entitiesArray}
            completeMethod={
                (e) => {
                    resolveEntitiesMention(e.query)
                        .then(entities => {
                            setSuggestions(entities)
                        })
                }
            }
            suggestions={suggestions}
            onChange={(e) => {
                let _elementsList = [...e.value];
                setEntitiesArray(_elementsList);
            }
            }
            {...props}/>
    );
}
