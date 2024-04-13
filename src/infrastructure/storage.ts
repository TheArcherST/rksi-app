import GroupDTO from "../interfaces/group";
import PersonDTO from "../interfaces/person";

export class Storage {

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

    getScheduleGroup(): GroupDTO | null {
        const data = localStorage.getItem('schedule:group');
        let result: GroupDTO | null;
        if (data !== null) {
            result = JSON.parse(data);
        } else {
            result = null;
        }
        return result;
    }

    setScheduleGroup(value: GroupDTO) {
        localStorage.setItem('schedule:group', JSON.stringify(value));
    }

    getScheduleTeacher(): PersonDTO | null {
        const data = localStorage.getItem('schedule:teacher');
        let result: PersonDTO | null;
        if (data !== null) {
            result = JSON.parse(data);
        } else {
            result = null;
        }
        return result;
    }

    setScheduleTeacher(value: PersonDTO) {
        localStorage.setItem('schedule:teacher', JSON.stringify(value));
    }
}


const storage = new Storage();

export default storage;
