import flatpickr from "flatpickr";
import {htmlToElement} from "../helpers";

export default class EditableList {
    constructor(calendarList, config) {
        this.calendarList = calendarList;
        this.list = [];
        this.id = 0;
        this.listEl = document.querySelector(config.listEl);
        this.formEl = document.querySelector(config.formEl);
        this.addButton = document.querySelector(config.addButton);
        this.itemsSelector = config.itemsSelector;
        this.itemsClassname = config.itemsSelector.substring(1);
        this.fields = config.fields;
        this.sortBy = config.sortBy || '';
        this.fields.forEach((field) => {
            field.el = document.querySelector(field.id);
        });
        this.initAddButtonListener();
        this.enableSubmittingWithEnter();
    }

    get data() {
        return this.list;
    }

    initAddButtonListener() {
        this.addButton.addEventListener('click', (e) => {
            e.preventDefault();
            const areFieldsReady = this.fields.every((field) => !field.required || (field.required && field.el.value.length > 0));

            if (areFieldsReady) {
                this.add();
                this.fields[0].el.focus();
            }
        });
    }

    enableSubmittingWithEnter() {
        this.formEl.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                this.addButton.click();
            }
        });
    }

    add() {
        const itemObj = {
            id: this.id,
        };
        this.fields.forEach((field) => itemObj[field.name] = field.el.value);
        this.list.push(itemObj);
        this.id += 1;
        this.sortList();
        this.clearInputs();
        this.rerenderTable();
    }

    sortList() {
        if (this.sortBy === 'date') {
            this.list.sort((a, b) => {
                return flatpickr.parseDate(a.date.split(' – ')[0], "d.m.Y") - flatpickr.parseDate(b.date.split(' – ')[0], "d.m.Y");
            })
        }
    }

    clearInputs() {
        this.fields.forEach((field) => {
            if (field.resetAfterSubmitting) {
                if (field.datepicker) {
                    this.calendarList.find((cal) => cal.input === field.el).clear();
                } else {
                    field.el.value = field.resetValue || '';
                }
            }
        });
    }

    rerenderTable() {
        this.clearTable();
        if (this.list.length === 0) {
            this.insertPlaceholderRow();
        } else {
            this.populateTable();
        }
    }

    clearTable() {
        document.querySelectorAll(this.itemsSelector).forEach((element) => {
            this.listEl.removeChild(element);
        });
    }

    insertPlaceholderRow() {
        const tableRow = htmlToElement(`
            <tr class="${this.itemsClassname}">
                ${'<td>(puste)</td>\n'.repeat(this.fields.length)}
                <td></td>
            </tr>   
        `);
        this.listEl.appendChild(tableRow);
    }

    populateTable() {
        this.list.forEach((item) => {
            let itemFields = '';
            this.fields.forEach((field) => {
                itemFields += `<td${field.noWrap ? ' class="text-nowrap"' : ''}>${item[field.name]}</td>\n`;
            });
            const tableRow = htmlToElement(`
                <tr class="${this.itemsClassname}">
                    ${itemFields}
                    <td class="text-nowrap">
                        <a href="" id="edit" data-id="${item.id}" class="text-secondary">edytuj</a>
                        <a href="" id="remove" data-id="${item.id}" class="text-secondary">usuń</a>
                    </td>
                </tr>
            `);
            this.addRemoveEditButtonListeners(tableRow);
            this.listEl.appendChild(tableRow);
        });
    }

    addRemoveEditButtonListeners(tableRow) {
        const editButton = tableRow.querySelector('#edit');
        const removeButton = tableRow.querySelector('#remove');
        editButton.addEventListener('click', (e) => {
            e.preventDefault();
            const itemId = editButton.getAttribute('data-id');
            this.edit(itemId);
        });
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            const itemId = removeButton.getAttribute('data-id');
            this.remove(itemId);
        });
    }

    edit(id) {
        const removedEl = this.remove(id);
        this.fields.forEach((field) => {
            if (field.datepicker) {
                this.calendarList.find((cal) => cal.input === field.el).setDate(removedEl[field.name]);
            } else {
                field.el.value = removedEl[field.name];
            }
        });
    }

    remove(id) {
        const indexToRemove = this.list.findIndex((el) => el.id === parseInt(id));
        const removedEl = this.list.splice(indexToRemove, 1)[0];
        this.rerenderTable();
        return removedEl;
    }

    restoreFromList(list) {
        if (list.length > 0) {
            this.list = list;
            this.id = list.reduce((local_max, el) => Math.max(local_max, parseInt(el.id)), 0) + 1;
            this.rerenderTable();
        }
    }
}