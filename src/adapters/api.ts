import {ResolveMention, ResolveMentionResponse} from "../interfaces/api/resolveMention";
import {EditScheduleDTO, EditScheduleResponseDTO} from "../interfaces/api/editSchedule";
import {ScheduleDTO} from "../infrastructure/table";
import SaneDate from "../infrastructure/saneDate";
import {TokenDTO, TokenResponseDTO} from "../interfaces/api/token";

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
    static headers: any = {
        "Content-Type": "application/json",
    };
    static baseUrl = "https://tomioka.ru:6078";

    constructor() {
    }

    readSchedule(date?: Date): Promise<ScheduleDTO> {
        let params = {};
        if (date !== undefined) {
            const period_start = new SaneDate(date);
            const period_end = period_start.getTomorrow();
            params = Object.assign(params, {
                period_start: period_start.toStringAsPeriod(),
                period_end: period_end.toStringAsPeriod(),
            })
        }
        return fetch(
            APIAdapter.baseUrl + '/v1/schedule/read?' + new URLSearchParams(params),
            { method: 'GET', headers: APIAdapter.headers }
        ).then(r => r.json());
    }

    resolveMention(payload: ResolveMention) : Promise<ResolveMentionResponse> {
        return fetch(
            APIAdapter.baseUrl + '/v1/mentions/resolve',
            { method: 'POST', headers: APIAdapter.headers, body: JSON.stringify(payload) }
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
            { method: 'POST', headers: APIAdapter.headers, body: JSON.stringify(payload) }
        ).then( r => {
            if (Math.floor(r.status / 100) !== 2) {
                throw new APIError(r.status);
            } else {
                return r.json();
            }
        });
    }

    token(payload: TokenDTO): Promise<TokenResponseDTO> {
        return fetch(
            APIAdapter.baseUrl + '/v1/token',
            { method: 'POST',
                headers: Object.assign(APIAdapter.headers, {'Content-Type': 'application/x-www-form-urlencoded'}),
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
            APIAdapter.headers.Authorization = `${data.token_type} ${data.access_token}`
            console.log(APIAdapter.headers);
            return data;
        })
    }
}


export default APIAdapter;
