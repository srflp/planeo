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
The project was entirely written in plain JavaScript, without the use of any JS frameworks.

### Dependencies
#### Development side
- [babel](https://github.com/babel/babel) - it transpiles modern JS to JS that is able to run in the most browsers
- [webpack](https://github.com/webpack/webpack) - combined with babel it bundles the source code into single bundle.js file

#### Production side
- [Bootstrap](https://github.com/twbs/bootstrap) - UI (CSS only)
- [flatpickr](https://github.com/flatpickr/flatpickr) - datepickers
- [loadjs](https://github.com/muicss/loadjs) - for loading Google API directly from JavaScript