import flatpickr from "flatpickr";

export function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
export function downloadObjectAsJson(exportObj, exportName){
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export function flatpickrDateSort(a, b) {
    const dateA = flatpickr.parseDate(a.date.split(' – ')[0], "d.m.Y");
    const dateB = flatpickr.parseDate(b.date.split(' – ')[0], "d.m.Y");
    return dateA - dateB;
}