import {ResolveMention, ResolveMentionResponse} from "../interfaces/api/resolveMention";
import {EditScheduleDTO, EditScheduleResponseDTO} from "../interfaces/api/editSchedule";
import SaneDate from "../infrastructure/saneDate";
import {TokenDTO, TokenResponseDTO} from "../interfaces/api/token";
import storage from "../infrastructure/storage";
import {GetAuditoriumsDTO, GetAuditoriumsResponseDTO} from "../interfaces/api/getAuditoriums";
import ScheduleDTO from "../interfaces/schedule";
import ScheduleSectionDTO from "../interfaces/scheduleSection";
import {RegisterDTO, RegisterResponseDTO} from "../interfaces/api/register";

export class APIError extends Error {
    status: number;

    constructor(status: number) {
        super();
        this.status = status;
    }
}


export class MentionSyntaxError extends APIError {

}

export class InvalidUsernameOrPassword extends APIError {

}


class APIAdapter {
    static getHeaders(): any {
        let result: Object = {
            "Content-Type": "application/json",
        }
        const token = storage.getAccessToken();
        if (token !== null) {
            result = {Authorization: "Bearer " + token, ...result};
        }
        return result;
    }

    static baseUrl = "https://tomioka.ru:6078";

    constructor() {
    }

    getAuditoriums(buildingNumbers?: number[]): Promise<GetAuditoriumsResponseDTO> {
        let params = new URLSearchParams();
        if (buildingNumbers !== undefined) {
            for (let i of buildingNumbers) {
                params.append('building_numbers', String(i));
            }
        }
        return fetch(
            APIAdapter.baseUrl + '/v1/auditoriums/get?' + new URLSearchParams(params),
            { method: 'GET', headers: APIAdapter.getHeaders() }
        ).then(r => r.json());
    }

    readSchedule(
        date?: Date,
        buildingNumbers?: number[],
        scheduleSection?: ScheduleSectionDTO | null
        ): Promise<ScheduleDTO> {
        let params = new URLSearchParams();
        if (date !== undefined) {
            if (scheduleSection) {
                params.set('period_start', scheduleSection.starts_at);
                params.set('period_end', scheduleSection.ends_at);
            } else {
                const period_start = new SaneDate(date);
                const period_end = period_start.getTomorrow();
                params.set('period_start', period_start.toStringAsPeriod());
                params.set('period_end', period_end.toStringAsPeriod());
            }

        }
        if (buildingNumbers !== undefined) {
            for (let i of buildingNumbers) {
                params.append('building_numbers', String(i));
            }
        }
        return fetch(
            APIAdapter.baseUrl + '/v1/schedule/read?' + new URLSearchParams(params),
            { method: 'GET', headers: APIAdapter.getHeaders() }
        ).then(r => r.json());
    }

    resolveMention(payload: ResolveMention) : Promise<ResolveMentionResponse> {
        return fetch(
            APIAdapter.baseUrl + '/v1/mentions/resolve',
            { method: 'POST', headers: APIAdapter.getHeaders(), body: JSON.stringify(payload) }
        ).then( r => {
            if (r.status === 400) {
                throw MentionSyntaxError;
            } else {
                return r.json()
            }
        });
    }

    editSchedule(payload: EditScheduleDTO): Promise<EditScheduleResponseDTO> {
        return fetch(
            APIAdapter.baseUrl + '/v1/schedule/edit',
            { method: 'POST', headers: APIAdapter.getHeaders(), body: JSON.stringify(payload) }
        ).then( r => {
            if (Math.floor(r.status / 100) !== 2) {
                throw new APIError(r.status);
            } else {
                return r.json();
            }
        });
    }

    register(payload: RegisterDTO): Promise<RegisterResponseDTO> {
        return fetch(
            APIAdapter.baseUrl + '/v1/register',
            { method: 'POST', headers: APIAdapter.getHeaders(), body: JSON.stringify(payload) }
        ).then( r => {
            if (Math.floor(r.status / 100) !== 2) {
                throw new APIError(r.status);
            } else {
                return r.json();
            }
        })
    }

    token(payload: TokenDTO): Promise<TokenResponseDTO> {
        return fetch(
            APIAdapter.baseUrl + '/v1/token',
            { method: 'POST',
                headers: Object.assign({}, APIAdapter.getHeaders(), {'Content-Type': 'application/x-www-form-urlencoded'}),
                body: new URLSearchParams(
                    {
                        "username": payload.username,
                        "password": payload.password,
                        "scope": "edit_schedule read_schedule approve_identification_request"
                    })
            }
        ).then(r => {
            if (r.status === 200) {
                return r.json()
            } else {
                throw new InvalidUsernameOrPassword(r.status);
            }
        }).then(data => {
            storage.setAccessToken(data.access_token);
            return data;
        })
    }
}


export default APIAdapter;
