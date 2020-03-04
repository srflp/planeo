export default class CalendarEvent {
    constructor(event) {
        this.summary = event.name;
        this.startDate = flatpickr.formatDate(event.startDate, 'Y-m-d'); // expects Date object
        this.endDate = flatpickr.formatDate(event.endDate, 'Y-m-d');
        this.allDay = event.allDay;
        this.startHour = event.startHour || null; // expects string
        this.endHour = event.endHour || null;

        if (!this.allDay) {
            this.startDateTime = flatpickr.parseDate(this.startDate + ' ' + this.startHour, 'Y-m-d H:i').toISOString();
            this.endDateTime = flatpickr.parseDate(this.endDate + ' ' + this.endHour, 'Y-m-d H:i').toISOString();
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
        } else {
            event.start.dateTime = this.startDateTime;
            event.end.dateTime = this.endDateTime;
        }
        return event;
    }
}