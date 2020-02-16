# planeo
An online tool that makes adding your schedule to Google Calendar faster and easier.

You can test it [here](https://srflp.github.io/planeo/).

Simply fill out the form, submit it and enjoy the schedule in Google Calendar 📅.

_Read this in other languages: [Polski](README.pl.md)_


## About the project

The main goal of this project is to help students in integrating their schedule with Google Calendar.

### Why?

Such personalized tool as planeo makes the process much more intuitive, because it perfectly suits the needs.

Adding the timetable manually is highly time-consuming. If you've never tried it, I'm sure, the easiest option is planeo.

Google Calendar is an incredible multi-purpose tool, but it is event-oriented. It's easy to add single events or simple recurring events, but when it comes to complex recurring events, for example such occurring in a timespan beetween two dates, it's doable but not enjoyable.

### What does it exactly do?

After you fill out the form and submit it, the data you typed in is preprocessed.

// TODO

## Technical details
The entire project was written in plain JavaScript, without the use of any JS frameworks.

### Dependencies
#### Development side
- [babel](https://github.com/babel/babel) - it transpiles modern JS to JS that is able to run in the most browsers
- [webpack](https://github.com/webpack/webpack) - combined with babel it bundles the source code into single bundle.js file

#### Production side
- [Bootstrap](https://github.com/twbs/bootstrap) - UI (CSS only)
- [flatpickr](https://github.com/flatpickr/flatpickr) - datepickers
- [loadjs](https://github.com/muicss/loadjs) - for loading Google API directly from JavaScript

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