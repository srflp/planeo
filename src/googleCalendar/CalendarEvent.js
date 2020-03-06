import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export default class CalendarEvent {
    constructor(event) {
        this.summary = event.name;
        this.startDate = event.startDate.format('YYYY-MM-DD'); // expects Date object
        this.endDate = event.endDate.format('YYYY-MM-DD');
        this.allDay = event.allDay; // boolean
        if (!this.allDay) {
            this.startDateTime = dayjs(this.startDate + ' ' + event.startHour, 'YYYY-MM-DD HH:mm').toISOString();
            this.endDateTime = dayjs(this.endDate + ' ' + event.endHour, 'YYYY-MM-DD HH:mm').toISOString();
        }
        if (event.recurrence) {
            this.recurrence = [
                [
                    'RRULE:FREQ=WEEKLY',
                    'UNTIL=' + event.recurrence.endDate.format('YYYYMMDDTHHmmss[Z]'),
                    'INTERVAL=' + event.recurrence.interval,
                    'WKST=MO', // the week start date
                    'BYDAY=' + event.recurrence.days.map(this.weekdayToRruleShortcut).join(','),
                ].join(';'),
            ];
        }

        this.location = event.location;
        this.description = event.description;
    }

    get getObject() {
        let event = {
            summary: this.summary,
            location: this.location,
            description: this.description,
            start: {
                'timeZone': 'Europe/Warsaw'
            },
            end: {
                'timeZone': 'Europe/Warsaw'
            },
        };
        if (this.allDay) {
            event.start.date = this.startDate;
            event.end.date = this.endDate;
            event.transparency = 'transparent'; // equivalent to setting 'Show me as available' in calendar
        } else {
            event.start.dateTime = this.startDateTime;
            event.end.dateTime = this.endDateTime;
        }
        if (this.recurrence) {
            event.recurrence = this.recurrence;
        }
        return event;
    }

    weekdayToRruleShortcut(weekday) {
        return {
            'poniedziałek': 'MO',
            'wtorek': 'TU',
            'środa': 'WE',
            'czwartek': 'TH',
            'piątek': 'FR',
            'sobota': 'SA',
            'niedziela': 'SU',
        }[weekday];
    }
}