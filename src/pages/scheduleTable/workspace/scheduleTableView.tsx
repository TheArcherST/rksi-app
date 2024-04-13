import {DataTable} from "primereact/datatable";
import {Column, ColumnBodyOptions} from "primereact/column";

import APIAdapter from "../../../adapters/api";

import CellMultiselect from "../../../components/table/cellMultiselect";
import CellSelect from "../../../components/table/cellSelect";

// import LessonDTO from "../../../interfaces/lesson";
import GroupDTO from "../../../interfaces/group";
import PersonDTO from "../../../interfaces/person";
import AuditoriumDTO from "../../../interfaces/auditorium";
import DisciplineDTO from "../../../interfaces/discipline";
import ScheduleSectionDTO from "../../../interfaces/scheduleSection";

import SaneDate from "../../../infrastructure/saneDate";
import {Button} from "primereact/button";
import DetachTeacherFromLesson from "../../../domain/updateSchedule/detachTeacherFromLesson";
import ReplaceLessonScheduleSection from "../../../domain/updateSchedule/replaceLessonScheduleSection";
import ReplaceLessonDiscipline from "../../../domain/updateSchedule/replaceLessonDiscipline";
import DeleteLesson from "../../../domain/updateSchedule/deleteLesson";
import UpdateSchedule, {WrappedLessonDTO} from "../../../domain/updateSchedule/base";
import DetachGroupFromLesson from "../../../domain/updateSchedule/detachGroupFromLesson";
import ReplaceLessonAuditorium from "../../../domain/updateSchedule/replaceLessonAuditorium";
import {AttachGroupToLesson} from "../../../domain/updateSchedule/attachGroupToLesson";
import AttachTeacherToLesson from "../../../domain/updateSchedule/attachTeacherToLesson";
import ScheduleFragmentDTO from "../../../interfaces/scheduleFragment";


interface ScheduleTableViewProps {
    lessons: WrappedLessonDTO[];
    processUpdate: (update: UpdateSchedule) => any;
    currentDate: Date;
    currentScheduleFragment: ScheduleFragmentDTO | null;
}


function ScheduleTableView(props: ScheduleTableViewProps) {
    const gateway = new APIAdapter();

    function groupsFormatter(lesson: WrappedLessonDTO) {
        return (
            <CellMultiselect<GroupDTO>
                entitiesArray={lesson.currentTemplate.groups}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {group_mention: {natural_language: mention}}
                    ).then((data) => {
                        return data.groups;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
                addEntity={(entity) => {
                    props.processUpdate(
                        new AttachGroupToLesson(lesson, entity)
                    );
                }}
                removeEntity={(entity) => {
                    props.processUpdate(
                        new DetachGroupFromLesson(lesson, entity)
                    )
                }}
            />
        );
    }

    function teachersFormatter(lesson: WrappedLessonDTO) {
        return (
            <CellMultiselect<PersonDTO>
                entitiesArray={lesson.currentTemplate.teachers}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {person_mention: {natural_language: mention}}
                    ).then((data) => {
                        return data.persons;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
                addEntity={(entity) => {
                    props.processUpdate(
                        new AttachTeacherToLesson(lesson, entity)
                    )
                }}
                removeEntity={(entity) => {
                    props.processUpdate(
                        new DetachTeacherFromLesson(lesson, entity)
                    )
                }}
            />
        );
    }

    function scheduleSectionFormatter(lesson: WrappedLessonDTO) {
        return (
            <CellSelect<ScheduleSectionDTO>
                entity={lesson.currentTemplate.schedule_section}
                setEntity={(entity) => {
                    props.processUpdate(
                        new ReplaceLessonScheduleSection(lesson, entity)
                    );
                }}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {
                            schedule_section_mention: {
                                natural_language: mention,
                                context: {
                                  date: new SaneDate(props.currentDate).toString(),
                                  schedule_fragment_id: props.currentScheduleFragment?.id,
                                }
                            }
                        }
                    ).then((data) => {
                        if (data.schedule_sections) {
                            return data.schedule_sections;
                        } else {
                            return [];
                        }
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
                dropdown={false}
            />
        );
    }

    function auditoriumFormatter(lesson: WrappedLessonDTO) {
        return (
            <CellSelect<AuditoriumDTO>
                entity={lesson.currentTemplate.auditorium}
                setEntity={(entity) => {
                    props.processUpdate(
                        new ReplaceLessonAuditorium(lesson, entity)
                    );
                }}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {auditorium_mention: {natural_language: mention}}
                    ).then((data) => {
                        return data.auditoriums;
                    }).catch((err) => {
                        console.log(err);
                        return [];
                    })
                }}
                dropdown={false}
            />
        );
    }

    function disciplineFormatter(lesson: WrappedLessonDTO) {
        return (
            <CellSelect<DisciplineDTO>
                entity={lesson.currentTemplate.discipline}
                setEntity={(entity) => {
                    props.processUpdate(
                        new ReplaceLessonDiscipline(lesson, entity)
                    );
                }}
                resolveEntitiesMention={(mention) => {
                    return gateway.resolveMention(
                        {discipline_mention: {natural_language: mention}}
                    ).then((data) => {
                        return data.disciplines;
                    }).catch((err) => {
                        console.log(err);
                        return [];})
                }}
                dropdown={false}
            />
        );
    }

    function deleteButtonTemplate(lesson: WrappedLessonDTO, _options: ColumnBodyOptions) {
        return (
            lesson.isCanDelete ? <Button
                type="button"
                icon={"pi pi-trash"}
                style={{color: "red"}}
                className="p-button-sm p-button-text"
                onClick={() => {
                    props.processUpdate(
                        new DeleteLesson(lesson)
                    )
                }} />
                : null
        );
    }

    return (
        <DataTable
            value={props.lessons}
            tableStyle={{ minWidth: '50rem', }}
            showGridlines
            className={"schedule-table"}
            emptyMessage={
                <div className={"table-empty-message"}>
                    <b>Пока занятий нет</b>
                </div>
            }
            sortField={"auditorium"}
            sortOrder={-1}
        >
            <Column
                field="schedule_section"
                header="Время"
                body={scheduleSectionFormatter}
                className={"column-schedule-section"} />
            <Column
                field="auditorium"
                header="Ауд."
                sortable={true}
                body={auditoriumFormatter}
                className={"column-auditorium"}
                sortFunction={(e) => {
                    return e.data.sort(
                        (a: WrappedLessonDTO, b: WrappedLessonDTO) => {
                            const auditorium_1 = a.currentTemplate.auditorium?.auditorium;
                            const auditorium_2 = b.currentTemplate.auditorium?.auditorium;

                            if (auditorium_1 === undefined || auditorium_2 === undefined) {
                                return 0;
                            }
                            if (e.order !== 0 && e.order !== -1) {
                                return 0;
                            }
                            if (a === b) {
                                return 0;
                            } else if (auditorium_1 < auditorium_2) {
                                return e.order;
                            } else {
                                return -e.order;
                            }
                        }
                    );
                }} />
            <Column
                field="groups"
                header="Группы"
                body={groupsFormatter}
                className={"column-groups"} />
            <Column
                field="teachers"
                header="Преподаватели"
                body={teachersFormatter}
                className={"column-teachers"} />
            <Column
                field="discipline"
                header="Дисциплина"
                body={disciplineFormatter}
                className={"column-discipline"} />
            <Column
                style={{ flex: '0 0 4rem' }}
                body={deleteButtonTemplate} />
        </DataTable>
    );
}


export default ScheduleTableView;
