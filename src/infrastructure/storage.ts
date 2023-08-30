import {es} from "chrono-node";

export class Storage {
    constructor() {
    }

    setAccessToken(token: string): void {
        localStorage.setItem('access_token', token);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    setBuildingNumbers(numbers: number[]) {
        localStorage.setItem('building_numbers', JSON.stringify(numbers));
    }

    getBuildingNumbers(): number[] | null {
        const data = localStorage.getItem('building_numbers');
        if (data !== null) {
            let result = JSON.parse(data);
            if (result instanceof Array) {
                return result;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}


const storage = new Storage();

export default storage;
