import flatpickr from "flatpickr";
import {Polish as flatpickrPolish} from "flatpickr/dist/l10n/pl";

export let list = [];

export function initialize() {
    flatpickr.localize(flatpickrPolish);
    const calendarConfig = {
        'dateFormat': 'd.m.Y',
        'disableMobile': true,
        // 'locale': 'pl',
        locale: {
            rangeSeparator: ' – '
        },
        'mode': 'range'
    };
    this.list = [...flatpickr('.flatpickr', calendarConfig)];
}

export function destroy() {
    this.list.forEach((datePicker) => datePicker.destroy());
    this.list = [];
}

export default {list, initialize, destroy};