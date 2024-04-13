import Entity from "../interfaces/entity";
import {LessonTemplateDTO} from "../domain/updateSchedule/base";


export function removeEntityFromCollection<T extends Entity>(arr: T[], value: T) {
    let presentedValue: T = value;
    let index = arr.indexOf(presentedValue);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}


export function refreshEntityInCollection<T extends Entity>(collection: T[], item: T) {
    removeEntityFromCollection<T>(collection, item);
    collection.push(item);
}


export function deepEqualDTOs(
    first: LessonTemplateDTO,
    second: LessonTemplateDTO,
) {
    return JSON.stringify(first) === JSON.stringify(second);
}
