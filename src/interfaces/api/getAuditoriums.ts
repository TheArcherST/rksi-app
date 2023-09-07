import AuditoriumDTO from "../auditorium";

export interface GetAuditoriumsDTO {
    building_numbers?: number[];
}


export interface GetAuditoriumsResponseDTO {
    auditoriums: AuditoriumDTO[];
}
