import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export default class CalendarEvent {
    constructor(event) {
        this.summary = event.name;
        this.allDay = event.allDay; // boolean
        this.startDate = event.startDate.format('YYYY-MM-DD'); // expects Date object
        if (this.allDay) {
            this.endDate = event.endDate.add(1, 'day').format('YYYY-MM-DD'); // correction of Google Calendar bug
        } else {
            this.endDate = event.endDate.format('YYYY-MM-DD');
            this.startDateTime = dayjs(this.startDate + ' ' + event.startHour, 'YYYY-MM-DD HH:mm').toISOString();
            this.endDateTime = dayjs(this.endDate + ' ' + event.endHour, 'YYYY-MM-DD HH:mm').toISOString();
        }
        if (event.recurrence) {
            this.recurrence = [
                [
                    'RRULE:FREQ=WEEKLY',
                    'UNTIL=' + event.recurrence.endDate.add(1, 'day').format('YYYYMMDDTHHmmss[Z]'),
                    'INTERVAL=' + event.recurrence.interval,
                    'WKST=MO', // the week start date
                    'BYDAY=' + event.recurrence.days.map(this.weekdayToRruleShortcut).join(','),
                ].join(';'),
                ...this.generateExDates(event.recurrence.exDates, event.startHour),
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

    generateExDates(dates, startHour) {
        const exRules = [];
        if (dates) {
            dates.forEach((date => {
                if (date.length === 1) {
                    date[1] = date[0];
                }
                while(date[0].isSameOrBefore(date[1])) {
                    exRules.push(`EXDATE;TZID=Europe/Warsaw:${date[0].format(`YYYYMMDDT${startHour.split(':').join('')}00`)}`);
                    date[0] = date[0].add(1, 'day');
                }
            }));
        }
        return exRules;
    }
}