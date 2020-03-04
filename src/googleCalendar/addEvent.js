export default async function addEvent(calendarId, event) {
    try {
        return (await gapi.client.calendar.events.insert({
            calendarId,
            resource: event.getObject
        })).result;
    }
    catch (error) {
        throw error.result ? `addEvent error: ${error.result.error.message} (HTTP code: ${error.result.error.code})` : error;
    }
}