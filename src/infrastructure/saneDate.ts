function dateNumberToString(n: number) {
    return ((n < 9) ? '0' : '') + n
}


export default class SaneDate {
    insaneDate: Date;
    constructor(insaneDate: Date) {
        this.insaneDate = new Date(insaneDate.getTime());
        this.insaneDate.setHours(0, 0, 0, 0);
    }

    toString() {
        return (
            `${this.insaneDate.getFullYear()}`
            + `-${dateNumberToString(this.insaneDate.getMonth() + 1)}`
            + `-${dateNumberToString(this.insaneDate.getDate())}`
        )
    }

    toStringAsPeriod() {
        return this.toString() + 'T00:00:00'
    }

    getTomorrow(): SaneDate {
        let date = new Date(this.insaneDate.getTime());
        date.setDate(date.getDate() + 1);
        return new SaneDate(date);
    }
}
