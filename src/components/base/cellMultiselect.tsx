import {AutoComplete} from "primereact/autocomplete";
import {useState} from "react";

import Entity from "../../interfaces/entity";
import {en} from "chrono-node";


function getArraysDiff(arr1: any[], arr2: any[]) {
    return arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
}


export default function CellMultiselect<T extends Entity>(
    {
        entitiesArray,
        addEntity,
        removeEntity,
        resolveEntitiesMention,
        ...props
    } : {
        entitiesArray: T[];
        addEntity: (entity: T) => any;
        removeEntity: (entity: T) => any;
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
                let diff = getArraysDiff(entitiesArray, e.value);
                if (diff) {
                    const entity = diff[0];
                    if (entitiesArray.length > e.value.length) {
                        return removeEntity(entity);
                    } else {
                        return addEntity(entity);
                    }
                }
            }
            }
            {...props}/>
    );
}
