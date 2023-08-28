import {ResolveMention, ResolveMentionResponse} from "../interfaces/api/resolveMention";
import {EditScheduleDTO, EditScheduleResponseDTO} from "../interfaces/api/editSchedule";
import {ScheduleDTO} from "../infrastructure/table";
import SaneDate from "../infrastructure/saneDate";

export class APIError extends Error {

}


export class MentionSyntaxError extends APIError {

}


class APIAdapter {
    headers;
    baseUrl;

    constructor() {
        this.headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsb2dpbjpzdHJpbmciLCJleHAiOjE2OTM3N" +
                "Dg0MTQsInNjb3BlcyI6WyJyZWFkX3NjaGVkdWxlIiwiZWRpdF9zY2hlZHVsZSIsImFwcHJvdmVfaWRlbnRpZmljYXRpb25fcmVxdWV" +
                "zdCJdfQ.GaqHVqLuW6po75pPZxuxXYhbJ9yNqp8RYVP1U87PSbs"
        };
        this.baseUrl = "http://0.0.0.0:8000";
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
            return r.json()
        });
    }
}


export default APIAdapter;
