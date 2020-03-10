export default class StatusBox {
    setOperationStatus(status, loading = true) {
        const statusBox = document.querySelector('#status_box');
        const statusSpinner = document.querySelector('#status_spinner');
        const statusBoxContent = document.querySelector('#status_box_content');
        if (loading) {
            statusSpinner.classList.remove('d-none');
        } else {
            statusSpinner.classList.add('d-none');
        }
        statusBox.classList.remove('d-none');
        statusBoxContent.innerText = status;
    }
}