# planeo
An online tool that makes adding your schedule to Google Calendar faster and easier.

You can test it [here](https://srflp.github.io/planeo/).

Simply fill out the form, submit it and enjoy the schedule in your Google Calendar 📅.

Currently the form is adjusted to suit the needs of students attending the Faculty of Computing and Telecommunications of the Poznan University of Technology.

_Read this in other languages: [Polski](README.pl.md)_


## About the project

The main goal of this project is to help students in transferring their schedule into Google Calendar.

### Why not adding the schedule manually?

planeo makes the process much more intuitive, because it's tailored to do just one thing - adding a schedule.

Adding the timetable to Google Calendar manually is highly time-consuming.

### What does it exactly do?

After you fill out the form and submit it, the data you typed in is preprocessed and submitted to Google Calendar API in special form.

## Technical details
The entire project was written in plain JavaScript, without the use of any massive JS frameworks.

### Dependencies
#### Development side
- [babel](https://github.com/babel/babel) - it transpiles ES6 JS to ES5 that is able to run in the most browsers
- [webpack](https://github.com/webpack/webpack) - launches babel and bundles the source code into single bundle.js file

#### Production side
- [Bootstrap](https://github.com/twbs/bootstrap) - UI (CSS only)
- [flatpickr](https://github.com/flatpickr/flatpickr) - datepickers
- [loadjs](https://github.com/muicss/loadjs) - for loading Google API Client Library directly with JavaScript
- [dayjs](https://github.com/iamkun/dayjs) - lightweight library to manage complex date manipulation

## Installation
If you want to run it on your own computer/server:
1. clone the repo
2. run `npm install` in the project directory
3. cd into `dist` folder and run an http server, e.g.
    ```
    $ python3 -m http.server 8000
    ```
4. Run webpack with:
    ```
    npx webpack
    ```
    It will watch for changes in files and update bundle.js file automatically.
    
### Miscellaneous
Additionally, you can expose your local webserver to the public using ngrok (for instance to test the app on a phone):
```
./ngrok http localhost:8000
```
Updating gh-pages:
```
git subtree push --prefix dist origin gh-pages
```