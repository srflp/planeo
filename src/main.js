import loadjs from 'loadjs';
import GoogleAPI from "./authorization";
import HolidayList from "./components/HolidayList";
import LessonList from "./components/LessonList";
import FileUpload from "./components/FileUpload";
import DatePickers from "./components/DatePickers";
import {downloadObjectAsJson} from "./helpers";

loadjs.ready('gapi', function () {
    const googleApi = new GoogleAPI();
    googleApi.init();
    // console.log(gapi);
});

// GLOBAL VARIABLES
let calendarId = '';

// MAIN
export function onLogin() {
    // gapi.client.calendar.colors.get().then((res) => {
    //     console.log(res)
    // })
    new Form();
}


class StatusBox {
    setOperationStatus(status, loading = true) {
        const statusBox = document.querySelector('#status_box');
        const statusSpinner = document.querySelector('#status_spinner');
        const statusBoxContent = document.querySelector('#status_box_content');
        if (loading) {
            statusSpinner.classList.remove('d-none');
        } else {
            statusSpinner.classList.add('d-none');
        }
        statusBox.classList.add('d-flex');
        statusBox.classList.remove('d-none');
        statusBoxContent.innerText = status;
    }
}


// CLASSES
class Form {
    constructor() {
        this.form = document.querySelector('#main_form');
        this.calendarName = document.querySelector('#calendar_name');
        this.firstWeekIs = document.querySelectorAll('input[name="first_week_is"]');
        this.firstHalf = document.querySelector('#first_half');
        this.secondHalf = document.querySelector('#second_half');
        // this.calendarList = this.initializeCalendars();
        FileUpload.initialize(this);
        DatePickers.initialize();
        this.disableEnter();
        this.holidayList = new HolidayList(DatePickers.list);
        this.lessonList = new LessonList(DatePickers.list);
        this.statusBox = new StatusBox();
        this.addAddCalendarButtonEventListener();
        this.addSaveButtonEventListener();
        this.addLoadButtonEventListener();
        this.addExportToJsonEventListener();
    }


    disableEnter() {
        this.form.addEventListener('keydown', (e) => {
            return e.key === "Enter" ? e.preventDefault() : undefined;
        });
    }

    addAddCalendarButtonEventListener() {
        const addCalendarButton = document.querySelector('#add_calendar');
        addCalendarButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.getData();
            // this.addCalendar(calendarName.value);
        });
    }

    addSaveButtonEventListener() {
        const saveButton = document.querySelector('#save');
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();

            const appState = localStorage.getItem('appState');
            let consent = true;
            if (appState !== null && appState.lessons !== undefined) {
                consent = confirm(`Czy napewno chcesz nadpisać zapis, który zawiera m. in. ${appState.lessons.length} dodanych zajęć?\n
                    Kliknij OK żeby kontynuować.`);
            }
            if (consent) {
                localStorage.setItem('appState', JSON.stringify(this.getData()));
                const previousText = saveButton.innerText;
                saveButton.innerText = 'Zapisano!';
                window.setTimeout(() => {
                    saveButton.innerText = previousText;
                }, 1000);
            }
        });
    }

    addLoadButtonEventListener() {
        const loadButton = document.querySelector('#load');
        loadButton.addEventListener('click', (e) => {
            e.preventDefault();
            const appState = localStorage.getItem('appState');
            if (appState !== null) {
                const appStateObj = JSON.parse(appState);
                this.load(appStateObj);
                loadButton.innerText = 'Wczytano!';
                window.setTimeout(() => {
                    loadButton.innerText = 'Wczytaj';
                }, 1000);
            } else {
                loadButton.innerText = 'Brak dostępnego zapisu!';
                window.setTimeout(() => {
                    loadButton.innerText = 'Wczytaj';
                }, 1000);
            }
        });
    }

    load(formObj) {
        this.calendarName.value = formObj.calendarName;
        this.firstWeekIs.value = formObj.firstWeekIs;
        if (formObj.firstWeekIs === 'parzysty') {
            document.querySelector('#even_week').checked = true;
        } else {
            document.querySelector('#odd_week').checked = true;
        }
        this.firstHalf.value = formObj.firstHalf;
        this.secondHalf.value = formObj.secondHalf;
        this.holidayList.restoreFromList(formObj.holidays);
        this.lessonList.restoreFromList(formObj.lessons);
    }

    addExportToJsonEventListener() {
        const exportButton = document.querySelector('#export_to_json');
        exportButton.addEventListener('click', (e) => {
            e.preventDefault();
            const data = this.getData();
            downloadObjectAsJson(data, data.calendarName || 'nienazwany');
        })
    }

    getData() {
        return {
            calendarName: this.calendarName.value,
            firstWeekIs: [...this.firstWeekIs].filter((el) => el.checked)[0].value,
            firstHalf: this.firstHalf.value,
            secondHalf: this.secondHalf.value,
            holidays: this.holidayList.data,
            lessons: this.lessonList.data,
        };
    }

    addCalendar(name) {
        setOperationStatus("Trwa dodawanie kalendarza...");
        gapi.client.calendar.calendars.insert({
            "summary": name
        }).then((response) => {
            calendarId = response.result.id;
            setOperationStatus(`Kalendarz „${name}” został dodany`, false);
        }, (error) => {
            console.log(`Error: ${error.result.error.message} (HTTP code: ${error.result.error.code})`);
        })
    }
}








