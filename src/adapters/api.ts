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
    headers;
    baseUrl;

    constructor() {
        this.headers = {
            "Content-Type": "application/json",
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsb2dpbjpzdHJpbmciLCJleHAiOjE2OTM4NTM1MDksInNjb3BlcyI6WyJlZGl0X3NjaGVkdWxlIiwicmVhZF9zY2hlZHVsZSIsImFwcHJvdmVfaWRlbnRpZmljYXRpb25fcmVxdWVzdCJdfQ.ERa3SZlperOzX2wHkmIofOcsqC--lJw6xR9LHCchTc0'        };
        this.baseUrl = "https://tomioka.ru:6078";
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
            this.baseUrl + '/v1/schedule/read?' + new URLSearchParams(params),
            { method: 'GET', headers: this.headers }
        ).then(r => r.json());
    }

    resolveMention(payload: ResolveMention) : Promise<ResolveMentionResponse> {
        return fetch(
            this.baseUrl + '/v1/mentions/resolve',
            { method: 'POST', headers: this.headers, body: JSON.stringify(payload) }
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
            this.baseUrl + '/v1/schedule/edit',
            { method: 'POST', headers: this.headers, body: JSON.stringify(payload) }
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
            this.baseUrl + '/v1/token',
            { method: 'POST',
                headers: Object.assign(this.headers, {'Content-Type': 'application/x-www-form-urlencoded'}),
                body: new URLSearchParams(
                    {
                        "username": payload.username,
                        "password": payload.password,
                    })
            }
        ).then(r => {
            if (r.status === 200) {
                return r.json()
            } else {
                throw new InvalidUsernameOrPassword(r.status);
            }
        }).then(data => {
            this.headers.Authorization = `${data.token_type} ${data.access_token}`
            return data;
        })
    }
}


export default APIAdapter;
