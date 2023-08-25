import {ResolveMention, ResolveMentionResponse} from "../interfaces/resolveMention";

export class APIError extends Error {

}


export class MentionSyntaxError extends APIError {

}


class APIAdapter {
    headers;

    constructor() {
        this.headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsb2dpbjpzdHJpbmciLCJleHAiOjE2OTM" +
                "yOTQxOTEsInNjb3BlcyI6WyJlZGl0X3NjaGVkdWxlIiwicmVhZF9zY2hlZHVsZSIsImFwcHJvdmVfaWRlbnRpZmljYXRpb25fcmV" +
                "xdWVzdCJdfQ.pPQ79UjYfq7uH266s-kQ4ABLMaykm2OO7nsvg-QT-gI"
        }
    }

    readSchedule() {
        return fetch(
            'https://tomioka.ru:6078/v1/schedule/lessons/read',
            { method: 'GET', headers: this.headers }
        ).then( r => r.json() )
    }

    resolveMention(payload: ResolveMention) : Promise<ResolveMentionResponse> {
        return fetch(
            'https://tomioka.ru:6078/v1/mentions/resolve',
            { method: 'POST', headers: this.headers, body: JSON.stringify(payload) }
        ).then( r => {
            if (r.status === 400) {
                throw MentionSyntaxError;
            } else {
                return r.json()
            }
        } )
    }
}


export default APIAdapter;
