const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const db = admin.firestore(); // Initialize Firestore outside the function scope to use in sendEmail

sgMail.setApiKey(functions.config().sendgrid.key);

function formatDate(input) {
    if (!input) {
        return ''; // Return empty string if input is undefined, null, etc.
    }

    let date;
    if (input instanceof Date) {
        // Input is already a JavaScript Date object
        date = input;
    } else if (input.toDate && typeof input.toDate === 'function') {
        // Input is a Firestore Timestamp object
        date = input.toDate();
    } else if (typeof input === 'string' || typeof input === 'number') {
        // Input is a string or a number (timestamp), attempt to parse it
        date = new Date(input);
    } else {
        // Unsupported type, return empty string
        console.error('Unsupported date type:', input);
        return '';
    }

    return date;
}

const handleEmails = async (type) => {
    // Get today's date at midnight in the Central Time Zone
    const today = new Date();

    const oneDayMS = 24 * 60 * 60 * 1000; // milliseconds in one day

    functions.logger.info("Starting handleEmails function", { type, today: today.toString() });

    const usersSnapshot = await db.collection('users').where('notifications', '==', true).get();
    functions.logger.info("Users fetched for notifications", { numberOfUsers: usersSnapshot.size });

    usersSnapshot.forEach(async userDoc => {
        const user = userDoc.data();
        functions.logger.info("Processing user", { userId: userDoc.id, notifications: user.notifications, email: user.email });

        if (!user.email || !user.notificationsFrequency) {
            functions.logger.info("Skipping user due to missing email or notification preferences", { userId: userDoc.id });
            return;
        }

        const tasksSnapshot = await db.collection('tasks')
            .where('userId', '==', userDoc.id)
            .where('status', '!=', 'Completed')
            .get();

        let emailTasks = [];

        tasksSnapshot.forEach(taskDoc => {
            const task = taskDoc.data();
            const dueDate = formatDate(task.dueDate);
            const diffDays = (dueDate - today) / oneDayMS;

            functions.logger.debug("Evaluating task for notification type", { type, task: task.assignment, dueDate, diffDays });

            if ((type === 'daily' && user.notificationsFrequency[2] && Math.abs(diffDays) <= 1) ||
                (type === 'weekly' && user.notificationsFrequency[1] && diffDays <= 7 && diffDays >= -1) ||
                (type === 'urgent' && user.notificationsFrequency[3] && diffDays <= 0)) {
                emailTasks.push(task);
                functions.logger.debug("Task added to email batch", { type, task: task.assignment });
            }
        });

        if (emailTasks.length > 0) {
            await sendEmail(user.email, emailTasks, type);
            functions.logger.info("Emails sent for type", { type, numberOfEmailsSent: emailTasks.length });
        } else {
            functions.logger.info("No tasks matched the criteria for sending emails", { type, userId: userDoc.id });
        }
    });
};

const sendEmail = async (email, tasks, type) => {
    const messageBody = tasks.map(task => `Task: ${task.assignment}\n\tDue: ${formatDate(task.dueDate).toLocaleDateString()}\n\n`).join('\n');
    const msg = {
        subject: `Your ${type} Tasks Reminder`,
        to: email,
        from: 'learnleaforganizer@gmail.com', // Verified SendGrid sender
        templateId: 'd-09f88e35060d476ba8ea14133c788db7', // SendGrid template ID
        dynamic_template_data: {
            subject: `Your ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Tasks Reminder`,
            text: messageBody
        }
    };

    try {
        await sgMail.send(msg);
        functions.logger.info("Email sent", { email, type });
    } catch (error) {
        functions.logger.error("Error sending email", { error: error.toString() });
    }
};


exports.sendDailyAndUrgentEmails = functions.pubsub.schedule('0 8 * * *') // Everyday at 8 AM
    .timeZone('America/Chicago')
    .onRun(async (context) => {
        functions.logger.info("Triggered sendDailyAndUrgentEmails function");
        await handleEmails('daily');
        await handleEmails('urgent');
    });

exports.sendWeeklyEmails = functions.pubsub.schedule('0 8 * * 1') // Every Monday at 8 AM
    .timeZone('America/Chicago')
    .onRun(async (context) => {
        functions.logger.info("Triggered sendWeeklyEmails function");
        await handleEmails('weekly');
    });
