export default interface Entity extends Object {
    id: number;
    display_text?: string;
}


export enum EntityMagicRuntimeState {
    CREATED = 0,  // entity that was just create within UI
    TEMPLATE = -1,  // template for entity to be created
}
