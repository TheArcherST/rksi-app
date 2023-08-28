export default interface Entity extends Object {
    id: number;
    display_text?: string;
}


export enum EntityMagicRuntimeState {
    CREATED
}
