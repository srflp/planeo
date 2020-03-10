export function initialize(form) {
    const filePicker = document.querySelector('#upload_box');
    const uploadTextEl = document.querySelector('#upload_text');
    const jsonInputEl = document.querySelector('#json_input');
    const defaultText = uploadTextEl.innerText;

    function temporarilyChangeUploadText(time, text) {
        uploadTextEl.innerText = text;
        window.setTimeout(() => {
            uploadTextEl.innerText = defaultText;
        }, time);
    }

    'drag dragstart dragend dragover dragenter dragleave drop'.split(' ').map(eventName => {
        filePicker.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    'dragover dragenter'.split(' ').map(eventName => {
        filePicker.addEventListener(eventName, (e) => {
            filePicker.classList.remove('bg-white');
            filePicker.classList.add('bg-light');
            uploadTextEl.innerText = 'Łapię!'
        });
    });

    'dragleave dragend drop'.split(' ').map(eventName => {
        filePicker.addEventListener(eventName, (e) => {
            filePicker.classList.remove('bg-light');
            filePicker.classList.add('bg-white');
            uploadTextEl.innerText = defaultText;
        });
    });

    filePicker.addEventListener('change', e => {
        const file = jsonInputEl.files[0];
        processJson(file);
    });

    filePicker.addEventListener('drop', e => {
        const droppedFile = e.dataTransfer.files[0];
        processJson(droppedFile);
    });

    function processJson(file) {
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.addEventListener('load', e => {
                const {result} = e.target;
                const formObj = JSON.parse(result);
                form.load(formObj);
                temporarilyChangeUploadText(4000, 'Plik wczytany pomyślnie!');
            });
            reader.addEventListener('error', (e) => {
                temporarilyChangeUploadText(4000, 'Błąd w odczycie pliku. Plik jest uszkodzony');
            });
        } else {
            temporarilyChangeUploadText(4000, 'Błąd! Przyjmowane są tylko pliki .json, wygenerowane wcześniej przez planeo');
        }
    }

    jsonInputEl.addEventListener('click', e => e.stopPropagation());
    filePicker.addEventListener('click', () => {
        jsonInputEl.click();
    });
}

export default {initialize}