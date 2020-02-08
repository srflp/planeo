import loadjs from 'loadjs';
import {onLogin} from './core.js';
import DatePickers from "./components/DatePickers";

loadjs(['https://apis.google.com/js/api.js'], 'gapi');

export default class GoogleAPI {
    constructor() {
        this.CLIENT_ID = '997956893318-7g11rla0crl931rvp5pjrueif95bqti7.apps.googleusercontent.com';
        this.API_KEY = 'AIzaSyC3CBOdFilmGcrAl3ntuOJnWFXQsv_X0zw';
        this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
        this.SCOPES = "https://www.googleapis.com/auth/calendar";

        this.authorizeButton = document.querySelector('#authorize_button');
        this.signOutButton = document.querySelector('#signout_button');
        this.loggedInAs = document.querySelector('#logged_in_as');
        this.userInfo = document.querySelector('#user_info');
        this.mainForm = document.querySelector('#main_form');
        this.allFormInputs = document.querySelectorAll('form input,form button,form select');
    }

    init() {
        gapi.load('client:auth2', this.initClient.bind(this));
    }

    initClient() {
        gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES
        }).then((() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.onLoginLogout.bind(this));

            this.onLoginLogout(gapi.auth2.getAuthInstance().isSignedIn.get());
            this.authorizeButton.addEventListener('click', (e) => {
                e.preventDefault();
                gapi.auth2.getAuthInstance().signIn();
            });
            this.signOutButton.addEventListener('click', (e) => {
                e.preventDefault();
                gapi.auth2.getAuthInstance().signOut();
            });
        }).bind(this), (error) => {
            console.error(error);
        });
    }

    onLoginLogout(isSignedIn) {
        if (isSignedIn) {
            this.authorizeButton.classList.add('d-none');
            const basicProfile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
            this.loggedInAs.innerText = `Jesteś zalogowany/a na konto Google jako ${basicProfile.getName()} (${basicProfile.getEmail()})`;
            this.userInfo.classList.add('d-flex');
            this.userInfo.classList.remove('d-none');

            [...this.allFormInputs].forEach((el) => {
                el.removeAttribute('disabled');
            });
            onLogin();
        } else {
            [...this.allFormInputs].forEach((el) => {
                el.setAttribute('disabled', 'disabled');
            });
            DatePickers.destroy();
            this.userInfo.classList.add('d-none');
            this.userInfo.classList.remove('d-flex');
            this.authorizeButton.classList.remove('d-none');
            this.loggedInAs.innerText = '';
        }
    }
}
