export default async function addCalendar(name) {
    try {
        return (await gapi.client.calendar.calendars.insert({
            summary: name
        })).result.id;
    }
    catch (error) {
        throw error.result ? `addCalendar error: ${error.result.error.message} (HTTP code: ${error.result.error.code})` : error;
    }
}