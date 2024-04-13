import {AutoComplete} from "primereact/autocomplete";
import {useState} from "react";

import Entity from "../../interfaces/entity";
import * as React from "react";


function getArraysDiff(arr1: any[], arr2: any[]) {
    return arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
}


interface CellMultiselectProps<T> {
    entitiesArray: T[];
    addEntity: (entity: T) => any;
    removeEntity: (entity: T) => any;
    resolveEntitiesMention: (mention: string) => (Promise<T[]>);
}


export default function CellMultiselect<T extends Entity>(props: CellMultiselectProps<T>) {
    const [suggestions, setSuggestions] = useState<T[]>([]);
    return (
        <AutoComplete
            field={"display_text"}
            multiple
            forceSelection
            value={(props.entitiesArray.length !== 0) ? props.entitiesArray : null}
            completeMethod={
                (e) => {
                    props.resolveEntitiesMention(e.query)
                        .then(entities => {
                            setSuggestions(entities)
                        })
                }
            }
            suggestions={suggestions}
            onChange={(e) => {
                let diff = getArraysDiff(props.entitiesArray, e.value);
                if (diff) {
                    const entity = diff[0];
                    if (props.entitiesArray.length > e.value.length) {
                        return props.removeEntity(entity);
                    } else {
                        return props.addEntity(entity);
                    }
                }
            }
            }/>
    );
}
