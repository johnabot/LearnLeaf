import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import parseISO from 'date-fns/parseISO';
import { useUser } from '/src/UserState.jsx';
import { fetchTasks } from '/src/LearnLeaf_Functions.jsx';
import { AddTaskForm } from '/src/Components/TaskView/AddTaskForm.jsx';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPage.css'
import '/src/Components/FormUI.css';

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

const CustomAgendaEvent = ({ event }) => {
    return (
        <div>
            <strong>{event.title}</strong> {/* Display event title only */}
            {/* Optionally add more details here */}
        </div>
    );
};


const CalendarUI = ({events, refreshTasks}) => {
    const [open, setOpen] = useState(false);
    const [openAddTask, setOpenAddTask] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setOpen(true);
    };

    const handleSelectSlot = (slotInfo) => {
        const formattedDate = format(slotInfo.start, 'yyyy-MM-dd'); // Formats the date
        setSelectedDate(formattedDate); // Assumes slot selection gives start date
        setOpenAddTask(true); // Open the Add Task Form
    };

    const handleCloseAddTask = () => {
        setOpenAddTask(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ height: 500, paddingTop: '20px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                components={{
                    agenda: {
                        event: CustomAgendaEvent, // Use custom event component for agenda
                    }
                }}
                views={['month', 'week', 'day', 'agenda']}
                step={1440} // Sets the time slot size to one day
                timeslots={1} // Only one time slot per day
                style={{ height: 700 }}
                onSelectEvent={handleEventClick}
                selectable={true}
                onSelectSlot={handleSelectSlot}
            />
            {selectedEvent && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle style={{ color: "#8E5B9F" }}>Task Details</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <b>{selectedEvent.task.assignment}</b>
                            <br />
                            {selectedEvent.task.subject && <><br />Subject: {selectedEvent.task.subject}</>}
                            <br/>
                            Due Date: {selectedEvent.task.dueDate ? format(new Date(selectedEvent.task.dueDate + 'T23:59:59'), 'PPP') : ''}
                            {selectedEvent.task.dueTime && <><br />Due Time: {selectedEvent.task.dueTime}</>}
                            {selectedEvent.task.project && <><br />Project: {selectedEvent.task.project}</>}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
            {openAddTask && (
                <AddTaskForm
                    isOpen={openAddTask}
                    onClose={handleCloseAddTask}
                    refreshTasks={refreshTasks}
                    initialDueDate={selectedDate}
                />
            )}
        </div>
    );
};


export default CalendarUI;
