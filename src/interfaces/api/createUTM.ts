import UTMDTO from "../utm";


export interface CreateUTMDTO {
    value: string;
    expire_seconds?: number;
    read_limit?: number;

}


export interface CreateUTMResponseDTO {
    utm: UTMDTO;
}
