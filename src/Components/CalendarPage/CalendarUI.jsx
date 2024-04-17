import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer by specifying the Date-Fns localizers and format functions
const locales = {
    'en-US': enUS
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Example events
const eventsList = [
    {
        start: new Date(),
        end: new Date(Date.now() + 3600000), // One hour later
        title: "Sample Event",
    }
];

const CalendarUI = () => {

    return (
        <div style={{ height: 500, paddingTop: '20px'  }}>
            <Calendar
                localizer={localizer}
                events={eventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div >
    );
};

export default CalendarUI;
