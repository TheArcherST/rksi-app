import AccountDTO from "../account";

export interface RegisterDTO {
    email: string;
    password: string;
    first_name: string;
    second_name: string;
    patronymic: string;
}


export interface RegisterResponseDTO {
    account: AccountDTO;
}
