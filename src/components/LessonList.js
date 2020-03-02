import EditableList from "./EditableList";
import {weekdaySort} from "../helpers";

export default class LessonList extends EditableList {
    constructor(calendarList) {
        super(calendarList, {
            listEl: '#lesson_list',
            formEl: '#lesson_form',
            addButton: '#add_lesson',
            itemsSelector: '.lesson',
            sortRules: [
                {
                    fieldName: 'hour',
                },
                {
                    fieldName: 'weekday',
                    sortFunction: weekdaySort,
                },
            ],
            fields: [
                {
                    id: '#lesson_weekday',
                    name: 'weekday',
                    required: true,
                    resetAfterSubmitting: false,
                },
                {
                    id: '#lesson_hour',
                    name: 'hour',
                    required: true,
                    resetAfterSubmitting: true,
                    resetValue: '08:00 – 09:30',
                    noWrap: true,
                },
                {
                    id: '#lesson_week',
                    name: 'week',
                    required: true,
                    resetAfterSubmitting: true,
                    resetValue: 'wszystkie',
                },
                {
                    id: '#lesson_type',
                    name: 'type',
                    required: true,
                    resetAfterSubmitting: true,
                    resetValue: '-',
                },
                {
                    id: '#lesson_name',
                    name: 'name',
                    required: true,
                    resetAfterSubmitting: true,
                },
                {
                    id: '#lesson_room',
                    name: 'room',
                    required: true,
                    resetAfterSubmitting: true,
                },
                {
                    id: '#lesson_lecturer',
                    name: 'lecturer',
                    required: true,
                    resetAfterSubmitting: true,
                },
            ],
        })
    }
}
