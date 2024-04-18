import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import { useUser } from '/src/UserState.jsx';
import { fetchTasks } from '/src/LearnLeaf_Functions.jsx';
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

const CalendarUI = () => {
    console.log("CalendarUI component is rendering");

    const [events, setEvents] = useState([]);
    const { user, updateUser } = useUser();


    useEffect(() => {
        const fetchAndFormatTasks = async () => {
            if (user && user.id) { // Make sure user is defined and has an id
                console.log("Fetching tasks for user:", user.id);
                const tasks = await fetchTasks(user.id); // Fetch tasks for the logged in user
                const tasksWithDueDates = tasks.filter(task => task.dueDate); // Only include tasks that have a dueDate
                const formattedTasks = tasksWithDueDates.map(task => ({
                    start: new Date(task.dueDate + 'T23:59:59Z'), // Ensure the date is parsed as UTC midnight
                    end: new Date(task.dueDate + 'T23:59:59Z'), // Set the end of the event to the end of the day in UTC
                    title: task.assignment,
                }));
                setEvents(formattedTasks);
                console.log("Formatted tasks:", formattedTasks);
            }
        };
        fetchAndFormatTasks();
    }, [user?.id]);

    return (
        <div style={{ height: 500, paddingTop: '20px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 900 }}
            />
        </div>
    );
};

export default CalendarUI;