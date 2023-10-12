import UTMDTO from "../utm";

export interface WriteUTMDTO {
    utm_id: string;
    value: string | null;
}


export interface WriteUTMResponseDTO {
    utm: UTMDTO;
}
