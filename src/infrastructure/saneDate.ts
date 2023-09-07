function dateNumberToString(n: number) {
    return ((n <= 9) ? '0' : '') + n
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

    toStringAsPeriod(h: number = 0, m: number = 0, s: number = 0) {
        const [h_s, m_s, s_s] = [
            dateNumberToString(h),
            dateNumberToString(m),
            dateNumberToString(s)
        ];
        return this.toString() + `T${h_s}:${m_s}:${s_s}`
    }

    getTomorrow(): SaneDate {
        let date = new Date(this.insaneDate.getTime());
        date.setDate(date.getDate() + 1);
        return new SaneDate(date);
    }
}
