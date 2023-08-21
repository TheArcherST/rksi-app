const scheduleReadExample = [
    {
        "id": 1,
        "time_circumstance": {
            "starts_at": "2023-08-19T14:06:11",
            "ends_at": "2023-08-19T14:06:11",
            "display_text": "08:00-09:30"
        },
        "discipline": {
            "id": 3,
            "name": "Астрономия",
            "display_text": "Астрономия"
        },
        "auditorium": {
            "id": 1,
            "building_number": 2,
            "auditorium": "21",
            "display_text": "2-21"
        },
        "teachers": [
            {
                "id": 1,
                "first_name": "Михаил",
                "second_name": "Шаповалов",
                "patronymic": "Алексеевич",
                "display_text": "Шаповалов Михаил Алексеевич",
            }
        ],
        "groups": [
            {
                "id": 2,
                "specialization_abbreviation": "ИБА",
                "course_number": 1,
                "group_number": 1,
                "display_text": "ИБА-11"
            }
        ]
    },
    {
        "id": 1,
        "time_circumstance": {
            "starts_at": "2023-08-19T14:06:11",
            "ends_at": "2023-08-19T14:06:11",
            "display_text": "08:00-09:30"
        },
        "discipline": {
            "id": 3,
            "name": "Астрономия",
            "display_text": "Астрономия"
        },
        "auditorium": {
            "id": 1,
            "building_number": 2,
            "auditorium": "21",
            "display_text": "2-21"
        },
        "teachers": [
            {
                "id": 1,
                "first_name": "Михаил",
                "second_name": "Шаповалов",
                "patronymic": "Алексеевич",
                "display_text": "Шаповалов Михаил Алексеевич",
            }
        ],
        "groups": [
            {
                "id": 2,
                "specialization_abbreviation": "ИБА",
                "course_number": 1,
                "group_number": 1,
                "display_text": "ИБА-11"
            }
        ]
    }
];


class APIAdapter {
    readSchedule() {
        return scheduleReadExample;
    }

    resolveMention() {

    }
}


export default APIAdapter;
