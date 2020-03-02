import EditableList from "./EditableList";
import {flatpickrDateSort} from "../helpers";

export default class HolidayList extends EditableList {
    constructor(calendarList) {
        super(calendarList, {
            listEl: '#holiday_list',
            formEl: '#holiday_form',
            addButton: '#add_holiday',
            itemsSelector: '.holiday',
            sortRules: [
                {
                    fieldName: 'date',
                    sortFunction: flatpickrDateSort,
                },
            ],
            fields: [
                {
                    id: '#holiday_date',
                    name: 'date',
                    required: true,
                    resetAfterSubmitting: true,
                    datepicker: true,
                },
                {
                    id: '#holiday_name',
                    name: 'name',
                    required: true,
                    resetAfterSubmitting: true,
                },
            ],
        });
    }
}