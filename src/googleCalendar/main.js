import addCalendar from "./addCalendar";
import addEvent from "./addEvent";
import CalendarEvent from "./CalendarEvent";
import {weekdays, addDays} from "../helpers";
import flatpickr from "flatpickr";

export default async function addAndFillInCalendar(data, statusBox) {
    try {
        let pendingPromises = [];
        statusBox.setOperationStatus("Trwa dodawanie kalendarza...");
        const calendarId = await addCalendar(data.calendarName);

        statusBox.setOperationStatus("Trwa dodawanie istotnych terminów...");
        const dates = [...data.firstHalf.split(' – '), ...data.secondHalf.split(' – ')];
        const eventNames = [
            'Początek semestru',
            'Koniec I. połowy semestru',
            'Początek II. połowy semestru',
            'Koniec semestru',
        ];
        for (let i = 0; i < 4; i++) {
            const event = new CalendarEvent({
                name: eventNames[i],
                startDate: flatpickr.parseDate(dates[i], 'd.m.Y'),
                endDate: flatpickr.parseDate(dates[i], 'd.m.Y'),
                allDay: true,
            });
            pendingPromises.push(addEvent(calendarId, event));
        }
        await Promise.all(pendingPromises);
        pendingPromises = [];

        statusBox.setOperationStatus("Trwa dodawanie zajęć...");
        const semesterStartDate = flatpickr.parseDate(data.firstHalf.split(' – ')[0], "d.m.Y");
        const weekdayToDate = getFirstWeekDates(semesterStartDate, data.holidays);
        for (let lesson of data.lessons) {
            const lessonHour = lesson.hour.split(' – ');
            const event = new CalendarEvent({
                name: `${lesson.name} ${lesson.type === '-' ? '' : `(${lesson.type})`}`,
                startDate: weekdayToDate[lesson.weekday],
                endDate: weekdayToDate[lesson.weekday],
                startHour: lessonHour[0],
                endHour: lessonHour[1],
                description: lesson.lecturer,
                location: lesson.room,
            });

            pendingPromises.push(addEvent(calendarId, event));
        }
        await Promise.all(pendingPromises);
        // pendingPromises = [];

        statusBox.setOperationStatus(`Kalendarz „${data.calendarName}” został dodany`, false);
    } catch (error) {
        console.error(error);
        statusBox.setOperationStatus(`Wystąpił błąd. Przekaż go administratorowi:\n${error}`, false);
    }
}

function getFirstWeekDates(startDate, holidays) {
    const dateWeekday = (startDate.getDay() + 6) % 7; // 0 === 'monday'
    const weekdayToDate = {};
    const holidayDates = getParsedHolidayDates(holidays);
    weekdays.forEach((weekday, i) => {
        let consideredDate = addDays(startDate, (7 - dateWeekday + i) % 7);

        while(isDateInRange(consideredDate, holidayDates)) {
            consideredDate = addDays(consideredDate,7);
        }

        weekdayToDate[weekday] = consideredDate;
    });
    return weekdayToDate;
}

function getParsedHolidayDates(holidays) {
    const parsedDates = [];
    holidays.forEach(holiday => {
        const holidayDate = holiday.date.split(' – ').map(date => flatpickr.parseDate(date, "d.m.Y"));
        parsedDates.push(holidayDate);
    });
    return parsedDates;
}

// dates -> array of arrays containing 1 date or range (2 dates)
function isDateInRange(checkedDate, dates) {
    for (let date of dates) {
        if (date.length === 1) {
            if (checkedDate.getTime() === date[0].getTime()) {
                return true;
            }
        } else { // date.length === 2
            if (checkedDate >= date[0] && checkedDate <= date[1]) {
                return true;
            }
        }
    }
    return false;
}