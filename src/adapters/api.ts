import {ResolveMention, ResolveMentionResponse} from "../interfaces/api/resolveMention";
import {EditScheduleDTO, EditScheduleResponseDTO} from "../interfaces/api/editSchedule";
import SaneDate from "../infrastructure/saneDate";
import {TokenDTO, TokenResponseDTO} from "../interfaces/api/token";
import storage from "../infrastructure/storage";
import {GetAuditoriumsDTO, GetAuditoriumsResponseDTO} from "../interfaces/api/getAuditoriums";
import {RegisterDTO, RegisterResponseDTO} from "../interfaces/api/register";
import {CreateUTMDTO, CreateUTMResponseDTO} from "../interfaces/api/createUTM";
import {WriteUTMDTO, WriteUTMResponseDTO} from "../interfaces/api/writeUTM";
import {ReadScheduleDTO, ReadScheduleResponseDTO} from "../interfaces/api/readSchedule";
import {ResolveReference, ResolveReferenceResponse} from "../interfaces/api/resolveReference";


interface APIErrorI extends Error {
    status: number;
}


export class APIError extends Error implements APIErrorI {
    status: number;

    constructor(status: number) {
        super();
        this.status = status;
    }
}


export class APIErrorInvalidRequest extends APIError {
    constructor(status: undefined | number = undefined) {
        super(status ?? 400);
    }
}


export class APIAuthorizationError extends APIErrorInvalidRequest {
    constructor() {
        super(401);
    }
}


export class MentionSyntaxError extends APIErrorInvalidRequest {

}


export class InvalidUsernameOrPassword extends APIErrorInvalidRequest {

}


class APIAdapter {
    static getHeaders(contentType: string): Headers {
        let result = new Headers();
        result.append("Content-Type", contentType)

        const token = storage.getAccessToken();
        if (token !== null) {
            result.append("Authorization", `Bearer ${token}`)
        }

        return result;
    }

    static baseUrl = process.env.REACT_APP_API_BASE_URL;

    constructor() {
    }

    protected getAPIErrorObj(response: Response): APIErrorI {
        const status = response.status;
        const milestoneDigit = Math.floor(response.status / 100);

        if (milestoneDigit == 4) {
            if (status == 401) {
                return new APIAuthorizationError();
            } else {
                return new APIErrorInvalidRequest(status);
            }
        } else {
            return new APIError(status);
        }
    }

    protected async processRequest(
        { method, path, body, json, params, contentType="application/json" } : {
            method: 'GET' | 'POST' | 'PUT',
            path: string, body?: BodyInit | null,
            json?: object | string | null,
            params?: URLSearchParams,
            contentType?: string,
        }): Promise<any> {
        if (params !== undefined && params !== null) {
            path = path + '?' + new URLSearchParams(params);
        }
        if (json !== undefined && json !== null) {
            body = typeof json === 'string' ? json : JSON.stringify(json);
        }
        let requestInit: object = {method, headers: APIAdapter.getHeaders(contentType)};
        if (body !== undefined && body !== null) {
            requestInit = {body, ...requestInit}
        }
        let url = new URL(path, APIAdapter.baseUrl);
        const response = await fetch(url, requestInit,);
        if (Math.floor(response.status / 100) != 2) {
            const err = this.getAPIErrorObj(response);
            if (err instanceof APIAuthorizationError) {
                window.location.replace('/');
            }
            throw err;
        }
        return await response.json();
    }

    async getAuditoriums(payload: GetAuditoriumsDTO): Promise<GetAuditoriumsResponseDTO> {
        let params = new URLSearchParams();
        for (let i of payload.building_numbers || []) {
            params.append('building_numbers', String(i));
        }
        return await this.processRequest({
            method: 'GET',
            path: '/v1/auditoriums/get',
            params: params,
        });
    }

    async readSchedule(data: ReadScheduleDTO): Promise<ReadScheduleResponseDTO> {
        let payload = {};
        if (data.schedule_section) {
            payload = {
                period_start: data.schedule_section.starts_at,
                period_end: data.schedule_section.ends_at,
                ...payload
            };
        } else if (data.period_start instanceof Date && data.period_end instanceof Date) {
            payload = {
                period_start: new SaneDate(data.period_start).toStringAsPeriod(),
                period_end: new SaneDate(data.period_end).toStringAsPeriod(),
                ...payload
            };
        } else if (data.date instanceof Date) {
            const period_start = new SaneDate(data.date);
            const period_end = period_start.getTomorrow();
            payload = {
                period_start: period_start.toStringAsPeriod(),
                period_end: period_end.toStringAsPeriod(),
                ...payload
            };
        }
        if (data.building_numbers?.length) {
            payload = {
                building_numbers: data.building_numbers,
                ...payload
            };
        }
        if (data.group) {
            payload = {
                group: data.group,
                ...payload
            }
        }
        if (data.teacher) {
            payload = {
                teacher: data.teacher,
                ...payload
            }
        }
        return await this.processRequest({
            method: 'POST',
            path: '/v1/schedule/read',
            json: payload,
        });
    }

    async resolveReference(payload: ResolveReference): Promise<ResolveReferenceResponse> {
        try {
            return await this.processRequest({
                method: 'POST',
                path: '/v1/references/resolve',
                json: payload,
            });
        } catch (e) {
            if (!(e instanceof APIError))  {
                throw e;
            }
            throw e;
        }
    }

    async resolveMention(payload: ResolveMention) : Promise<ResolveMentionResponse> {
        try {
            return await this.processRequest({
                method: 'POST',
                path: '/v1/mentions/resolve',
                json: payload,
            });
        } catch (e) {
            if (!(e instanceof APIError))  {
                throw e;
            }
            if (e.status === 400) {
                throw new MentionSyntaxError();
            } else {
                throw e;
            }
        }
    }

    async editSchedule(payload: EditScheduleDTO): Promise<EditScheduleResponseDTO> {
        return await this.processRequest({
            method: 'POST',
            path: '/v1/schedule/edit',
            json: payload,
        });
    }

    async register(payload: RegisterDTO): Promise<RegisterResponseDTO> {
        return this.processRequest({
            method: 'POST',
            path: '/v1/register',
            json: payload,
        });
    }

    async token(payload: TokenDTO): Promise<TokenResponseDTO> {
        try {
            return await this.processRequest({
                method: 'POST',
                path: '/v1/token',
                body: new URLSearchParams({
                    "username": payload.username,
                    "password": payload.password,
                    "scope": "edit_schedule read_schedule approve_identification_request",
                }),
                contentType: "application/x-www-form-urlencoded",
            });
        } catch (e) {
            if (!(e instanceof APIError)) {
                throw e;
            }
            throw new InvalidUsernameOrPassword();
        }
    }

    async createUTM(payload: CreateUTMDTO): Promise<CreateUTMResponseDTO> {
        return await this.processRequest({
            method: 'POST',
            path: '/v1/utm',
            json: payload,
        });
    }

    async writeUTM(payload: WriteUTMDTO): Promise<WriteUTMResponseDTO> {
        return await this.processRequest({
            method: 'PUT',
            path: '/v1/utm',
            json: payload,
        });
    }
}


export default APIAdapter;
