import addCalendar from "./addCalendar";
import addEvent from "./addEvent";
import CalendarEvent from "./CalendarEvent";
import {weekdays} from "../helpers";

// dayjs init
import dayjs from "dayjs";
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import weekdayPlugin from 'dayjs/plugin/weekday';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import 'dayjs/locale/pl'
dayjs.extend(customParseFormatPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(isBetweenPlugin);
dayjs.locale('pl');

export default async function addAndFillInCalendar(data, statusBox) {
    try {

        statusBox.setOperationStatus("Trwa dodawanie kalendarza...");
        const calendarId = await addCalendar(data.calendarName);

        const semesterDates = [...data.firstHalf.split(' – '), ...data.secondHalf.split(' – ')].map(date => dayjs(date, 'DD.MM.YYYY'));
        const semesterStartDate = semesterDates[0];
        const semesterEndDate = semesterDates[3];

        statusBox.setOperationStatus("Trwa dodawanie informacji o semestrach...");
        await addSemesterBounds(calendarId, semesterDates);

        statusBox.setOperationStatus("Trwa dodawanie informacji o parzystości tygodni...");
        await addOddEvenWeekInfo(calendarId, data, semesterStartDate, semesterEndDate);

        statusBox.setOperationStatus("Trwa dodawanie zajęć...");
        await addLessons(calendarId, data, semesterStartDate, semesterEndDate);

        // TODO addHolidays

        // TODO removeLessonsOnHolidays

        statusBox.setOperationStatus(`Kalendarz „${data.calendarName}” został dodany`, false);
    } catch (error) {
        console.error(error);
        statusBox.setOperationStatus(`Wystąpił błąd. Przekaż go administratorowi:\n${error}`, false);
    }
}

async function addSemesterBounds(calendarId, semesterDates) {
    const pendingPromises = [];
    const eventNames = [
        'Początek semestru',
        'Koniec I. połowy semestru',
        'Początek II. połowy semestru',
        'Koniec semestru',
    ];
    for (let i = 0; i < 4; i++) {
        const event = new CalendarEvent({
            name: eventNames[i],
            startDate: semesterDates[i],
            endDate: semesterDates[i],
            allDay: true,
        });
        pendingPromises.push(addEvent(calendarId, event));
    }
    await Promise.all(pendingPromises);
}

async function addOddEvenWeekInfo(calendarId, data, semesterStartDate, semesterEndDate) {
    const firstMondayDate = semesterStartDate.weekday(0);
    const lastMondayDate = semesterEndDate.weekday(0);
    const eventObject = {
        name: 'Tydzień ' + (data.firstWeekIs === 'parzyste' ? 'parzysty' : 'nieparzysty'),
        startDate: firstMondayDate,
        endDate: firstMondayDate,
        allDay: true,
        recurrence: {
            endDate: lastMondayDate,
            days: ['poniedziałek'],
            interval: 2,
        },
    };
    await addEvent(calendarId, new CalendarEvent(eventObject));

    eventObject.name = 'Tydzień ' + (data.firstWeekIs === 'parzyste' ? 'nieparzysty' : 'parzysty');
    eventObject.startDate = firstMondayDate.add(7, 'day');
    eventObject.endDate = firstMondayDate.add(7, 'day');
    await addEvent(calendarId, new CalendarEvent(eventObject));
}

async function addLessons(calendarId, data, semesterStartDate, semesterEndDate) {
    let pendingPromises = [];
    const weekdayToDate = getFirstWeekDates(semesterStartDate, data.holidays, data.firstWeekIs);
    for (let lesson of data.lessons) {
        const lessonHour = lesson.hour.split(' – ');

        let firstAvailableDate = weekdayToDate[lesson.weekday];
        const weekParityOfDate = getWeekParity(semesterStartDate, data.firstWeekIs, firstAvailableDate);
        let interval = 1;
        if (lesson.week !== 'wszystkie') {
            interval = 2;
            if (lesson.week !== weekParityOfDate) {
                firstAvailableDate = firstAvailableDate.add(7, 'day');
            }
        }
        const lessonTypeStr = lesson.type === '-' ? '' : ` (${lesson.type})`;
        const parityStr =  lesson.week === 'parzyste' ? ' (parz.)' : (lesson.week === 'nieparzyste' ? ' (nieparz.)' : '');
        const event = new CalendarEvent({
            name: lesson.name + lessonTypeStr + parityStr,
            startDate: firstAvailableDate,
            endDate: firstAvailableDate,
            startHour: lessonHour[0],
            endHour: lessonHour[1],
            description: lesson.lecturer,
            location: lesson.room,
            recurrence: {
                endDate: semesterEndDate,
                days: [lesson.weekday],
                interval: interval,
            }
        });

        pendingPromises.push(addEvent(calendarId, event));
    }
    await Promise.all(pendingPromises);
}

function getFirstWeekDates(startDate, holidays, firstWeekIs) {
    // startDate = day 0
    const dateWeekday = startDate.weekday();
    const weekdayToDate = {};
    const holidayDates = getParsedHolidayDates(holidays);
    weekdays.forEach((weekday, i) => {
        let consideredDate = startDate.add((7 - dateWeekday + i) % 7, 'day');
        while(isDateInRange(consideredDate, holidayDates)) {
            consideredDate = consideredDate.add(7, 'day')
        }
        weekdayToDate[weekday] = consideredDate;
    });
    return weekdayToDate;
}

function getWeekParity(semesterStartDate, firstWeekIs, date) {
    const fullWeeksOfDifference = Math.floor(date.diff(semesterStartDate.weekday(0), 'day') / 7);
    if (fullWeeksOfDifference % 2 === 0) {
        return firstWeekIs;
    } else {
        return firstWeekIs === 'parzyste' ? 'nieparzyste' : 'parzyste';
    }
}

function getParsedHolidayDates(holidays) {
    const parsedDates = [];
    holidays.forEach(holiday => {
        const holidayDate = holiday.date.split(' – ').map(date => dayjs(date, 'DD.MM.YYYY'));
        parsedDates.push(holidayDate);
    });
    return parsedDates;
}

// dates = array of arrays containing 1 date or range (2 dates)
function isDateInRange(dateToCheck, dates) {
    for (let date of dates) {
        if (date.length === 1) {
            if (dateToCheck.isSame(date[0], 'day')) {
                return true;
            }
        } else { // date.length === 2
            if (dateToCheck.isBetween(date[0], date[1], 'day', '[]')) {
                return true;
            }
        }
    }
    return false;
}


