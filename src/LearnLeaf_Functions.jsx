// @flow
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, where, query, orderBy, Timestamp, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { useUser } from '/src/UserState.jsx';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8rr1TEUUZ9b_PqR475mszkoC0aMoHeTE",
    authDomain: "learnleaf-organizer.firebaseapp.com",
    projectId: "learnleaf-organizer",
    storageBucket: "learnleaf-organizer.appspot.com",
    messagingSenderId: "998389863314",
    appId: "1:998389863314:web:3da40aae1598c7904c674b",
    measurementId: "G-8XX0HRFBCX"
};

//var admin = require("firebase-admin");
//var serviceAccount = require("learnleaf-organizer-firebase-adminsdk-yyyj1-b1bfa59177.json");


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore();

// Function to handle user registration
export function registerUser(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // Store the user's name in Firestore

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                password: password,
                timeFormat: '12h', // Initialize time format as 12 Hour
                dateFormat: 'MM/DD/YYYY', // Initialize date format as MM/DD/YYYY
                notifications: false, // Initialize notifications as Disabled
                notificationsFrequency: [true,false,false,false], //Array to store frequency preferences - [None, Weekly, Daily, None], Initialized as None
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // Error handling, like displaying a message to the user
            alert("Error code: " + errorCode + "\n" + errorMessage);
            throw error; // Throw the error so it can be caught where the function is called
        });
}

export function resetPassword(email) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent.
            console.log('Password reset email sent.');
        })
        .catch((error) => {
            // Handle errors here
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Error code: " + errorCode + "\n" + errorMessage);
            // Optionally, throw the error to be caught by the calling code
            throw error;
        });
}

// Function to handle user login
export async function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            // Fetch user's details from Firestore using the db instance
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                throw new Error('User does not exist');
            }
            const userName = userDoc.data().name;
            const userEmail = userDoc.data().email;
            const userPassword = userDoc.data().password;
            const userTimeFormat = userDoc.data().timeFormat;
            const userDateFormat = userDoc.data().dateFormat;
            const userNotifications = userDoc.data().notifications;
            const userNotificationFrequency = userDoc.data().notificationsFrequency;
            return { id: user.uid, name: userName, email: userEmail, password: userPassword, timeFormat: userTimeFormat, dateFormat: userDateFormat, notifcations: userNotifications, notificationFrequency: userNotificationFrequency };
        })
        .catch((error) => {
            // Error handling
            console.error("Login error", error);
            throw error; // Propagate the error
        });
}

export async function updateUserDetails(userId, userDetails) {
    const userDocRef = doc(db, "users", userId);

    try {
        await updateDoc(userDocRef, userDetails);
        console.log("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

// logout out of the webpage
export async function logoutUser() {
    const successlogout = "You are logged out successfully!";
    const failedlogout = "Sorry, there was an error logging out:";
    return signOut(auth) // this removes the user's access and clears their login status.
        .then(() => {
            console.log(successlogout);
        })
        .catch((error) => {
            console.error(failedlogout, error);
            throw error;
        });
}

export async function deleteUser(userId) {
    const batch = writeBatch(db);

    // Function to delete all documents in a collection where `userId` matches
    const deleteCollectionByUserId = async (collectionName) => {
        const q = query(collection(db, collectionName), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
    };

    // Delete tasks, subjects, and projects
    await deleteCollectionByUserId("tasks");
    await deleteCollectionByUserId("subjects");
    await deleteCollectionByUserId("projects");

    // Delete the user document
    const userDocRef = doc(db, "users", userId);
    batch.delete(userDocRef);

    // Commit the batch
    await batch.commit();

    // Delete the Firebase Authentication user
    const user = auth.currentUser;
    if (user && user.uid === userId) {
        await deleteFirebaseUser(user);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchTasks();
});

// Helper function to format Firestore Timestamp to "day month, year"
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
  
    // Format the date to 'YYYY-MM-DD'
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // JS months are 0-indexed
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Return the formatted date string
}

export function formatDateDisplay(input) {
    const { user } = useUser();
    const dateFormat = user.dateFormat;

    let date = input instanceof Date ? input : input.toDate ? input.toDate() : new Date(input);
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = (date.getDate() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();

    if (dateFormat === 'DD/MM/YYYY') {
        return `${day}/${month}/${year}`;
    }
    else {
        return `${month}/${day}/${year}`;
    }
}

export function formatTimeDisplay(input) {
    const { user } = useUser();
    const timeFormat = user.timeFormat;

    if (!input || typeof input !== 'string') return 'N/A'; // Handle null, undefined, or non-string input

    // Split the input string by the colon to get hours and minutes
    const [strHours, strMinutes] = input.split(':');

    // Parse the hours and minutes into numbers
    let hours = parseInt(strHours, 10);
    let minutes = parseInt(strMinutes, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Validate the hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) {
        console.error('Invalid time string:', input); // Log the invalid input
        return 'Invalid Time'; // The input was not a valid time string
    }

    if (timeFormat === '12h') {
        // Convert hours from 24-hour to 12-hour format for AM/PM notation
        hours = hours % 12;
        hours = hours || 12; // the hour '0' should be '12'
    }

    // Format hours and minutes with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the formatted time string depending on the format
    return timeFormat === '12h' ? `${formattedHours}:${formattedMinutes} ${ampm}` : `${formattedHours}:${formattedMinutes}`;
}

// Helper function to format Firestore Timestamp to "HH:MM AM/PM"
function formatTime(input) {
    if (!input) {
        return ''; // Return empty string if input is undefined, null, etc.
    }

    let time;
    if (input instanceof Date) {
        // Input is already a JavaScript Date object
        time = input;
    } else if (input.toDate && typeof input.toDate === 'function') {
        // Input is a Firestore Timestamp object
        time = input.toDate();
    } else if (typeof input === 'string' || typeof input === 'number') {
        // Input is a string or a number (timestamp), attempt to parse it
        time = new Date(input);
    } else {
        // Unsupported type, return empty string
        console.error('Unsupported time type:', input);
        return '';
    }
  
    // Format the time to 'HH:MM'
    let hours = time.getHours().toString().padStart(2, '0');
    let minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Return the formatted time string
}

export async function fetchTasks(userId, subject = null, project = null) {
    const db = getFirestore();
    let q;

    // Construct the query based on the presence of subject or project
    if (subject) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("subject", "==", subject),
            where("status", "!=", "Completed")
        );
    } else if (project) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("project", "==", project),
            where("status", "!=", "Completed")
        );
    } else {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("status", "!=", "Completed")
        );
    }

    const subjectColors = {};
    const subjects = await fetchSubjects(userId);
    subjects.forEach(subj => {
        subjectColors[subj.subjectName] = subj.subjectColor;
    });

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const color = subjectColors[data.subject] || 'defaultColor';
        return {
            ...data,
            taskId: doc.id,
            startDate: formatDate(data.startDate),
            dueDate: formatDate(data.dueDate),
            dueTime: formatTime(data.dueTime),
            subjectColor: color,
        };
    });

    // Sort tasks, placing those without a due date at the end
    tasks.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');

        // Compare by dueDate first
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If due dates are the same, compare due times
        // Ensure dueTime is not null; default to "23:59" if null to put them at the end of the day
        const timeA = a.dueTime ? a.dueTime : '23:59';
        const timeB = b.dueTime ? b.dueTime : '23:59';

        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        // Finally, compare assignments
        return a.assignment.localeCompare(b.assignment);
    });

    return tasks;
}

export async function fetchAllTasks(userId, subject = null, project = null) {
    const db = getFirestore();
    let q;

    if (subject) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("subject", "==", subject),
        );
    } else if (project) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("project", "==", project),
        );
    } else {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
        );
    }

    const querySnapshot = await getDocs(q);
    const tasksAll = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            taskId: doc.id,
            startDate: formatDate(data.startDate),
            dueDate: formatDate(data.dueDate),
            dueTime: formatTime(data.dueTime),
        };
    });

    tasksAll.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');

        // Compare by dueDate first
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If due dates are the same, compare due times
        // Ensure dueTime is not null; default to "23:59" if null to put them at the end of the day
        const timeA = a.dueTime ? a.dueTime : '23:59';
        const timeB = b.dueTime ? b.dueTime : '23:59';

        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        // Finally, compare assignments
        return a.assignment.localeCompare(b.assignment);
    });

    return tasksAll;
}

export async function fetchArchivedTasks(userId) {
    const db = getFirestore();
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef,
        where("userId", "==", userId),
        where("status", "==", "Completed"));

    const querySnapshot = await getDocs(q);
    const archivedTasks = [];
    querySnapshot.forEach((doc) => {
        archivedTasks.push({ id: doc.id, ...doc.data() });
    });

    // Sort tasks, placing those without a due date at the end
    archivedTasks.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');

        // Compare by dueDate first
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If due dates are the same, compare due times
        // Ensure dueTime is not null; default to "23:59" if null to put them at the end of the day
        const timeA = a.dueTime ? a.dueTime : '23:59';
        const timeB = b.dueTime ? b.dueTime : '23:59';

        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        // Finally, compare assignments
        return a.assignment.localeCompare(b.assignment);
    });

    return archivedTasks;
}

// Function to create a new task
export async function addTask(taskDetails) {
    const { userId, subject, project, assignment, priority, status, startDateInput, dueDateInput, dueTimeInput } = taskDetails;

    // Initialize taskData with fields that are always present
    const taskData = {
        userId,
        subject,
        project,
        assignment,
        priority,
        status,
    };

    // Conditionally add dates and times if provided
    if (startDateInput) {
        taskData.startDate = Timestamp.fromDate(new Date(startDateInput + "T00:00:00"));
    }

    if (dueDateInput) {
        taskData.dueDate = Timestamp.fromDate(new Date(dueDateInput + "T00:00:00"));
    }

    if (dueTimeInput) {
        const dateTimeString = dueDateInput + "T" + dueTimeInput + ":00";
        taskData.dueTime = Timestamp.fromDate(new Date(dateTimeString));
    }

    // Assuming tasks are stored in a 'tasks' collection
    try {
        await setDoc(doc(db, "tasks", `${userId}_${Date.now()}`), taskData);
        console.log("Task added successfully");
    } catch (error) {
        console.error("Error adding task:", error);
    }
};

export async function editTask(taskDetails) {
    const { taskId, userId, subject, project, assignment, priority, status, startDateInput, dueDateInput, dueTimeInput } = taskDetails;
    const db = getFirestore(); // Initialize Firestore

    // Initialize taskData with fields that are always present
    const taskData = {
        userId,
        subject,
        project,
        assignment,
        priority,
        status,
    };

    // Conditionally add dates and times if provided
    if (startDateInput) {
        taskData.startDate = Timestamp.fromDate(new Date(startDateInput + "T00:00:00"));
    }

    if (dueDateInput) {
        taskData.dueDate = Timestamp.fromDate(new Date(dueDateInput + "T00:00:00"));
    }

    if (dueTimeInput) {
        const dateTimeString = dueDateInput + "T" + dueTimeInput + ":00";
        taskData.dueTime = Timestamp.fromDate(new Date(dateTimeString));
    }

    // Create a reference to the task document
    const taskDocRef = doc(db, "tasks", taskId);

    // Use updateDoc to update the task document
    try {
        await updateDoc(taskDocRef, taskData);
        console.log("Task updated successfully");
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

export async function deleteTask(taskId) {
    const db = getFirestore(); // Initialize Firestore
    const taskDocRef = doc(db, "tasks", taskId); // Create a reference to the task document

    try {
        await deleteDoc(taskDocRef); // Delete the document
        console.log("Task deleted successfully");
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

export async function fetchSubjects(userId) {
    const db = getFirestore();
    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef,
        where("userId", "==", userId),
        where("status", "==", "Active"),
        orderBy("subjectName", "asc"));

    const querySnapshot = await getDocs(q);
    const subjects = [];
    querySnapshot.forEach((doc) => {
        subjects.push({ id: doc.id, ...doc.data() });
    });

    return subjects;
}

export async function addSubject({ userId, subjectName, semester, subjectColor }) {
    const db = getFirestore(); // Initialize Firestore
    const subjectData = {
        userId,
        subjectName,
        semester,
        status: 'Active', // Assuming new subjects are active by default
        subjectColor,
    };

    console.log("Attmepting to add: ", subjectData);

    try {
        // Assuming 'subjects' is the name of your collection
        await setDoc(doc(db, "subjects", `${userId}_${Date.now()}`), subjectData);
        console.log("Subject added successfully");
    } catch (error) {
        console.error("Error adding subject:", error);
    }
}

export async function editSubject(subjectDetails) {
    const { subjectId, userId, subjectName, semester, subjectColor, status } = subjectDetails;

    if (!subjectId) {
        throw new Error("subjectId is undefined, cannot update subject");
    }

    const db = getFirestore(); // Initialize Firestore

    // Initialize subjectData with fields that are always present
    const subjectData = {
        userId,
        subjectName,
        semester,
        subjectColor,
        status,
    };

    // Create a reference to the task document
    const subjectDocRef = doc(db, "subjects", subjectId);

    // Use updateDoc to update the task document
    try {
        await updateDoc(subjectDocRef, subjectData);
        console.log("Subject updated successfully");
    } catch (error) {
        console.error("Error updating subject:", error);
    }
};

export async function archiveSubject(subjectId) {
    const db = getFirestore(); // Initialize Firestore
    const subjectRef = doc(db, "subjects", subjectId);

    try {
        // Update the status field of the subject to 'Archived'
        await updateDoc(subjectRef, {
            status: 'Archived'
        });
        console.log("Subject archived successfully");
    } catch (error) {
        console.error("Error archiving subject:", error);
    }
}

export async function fetchArchivedSubjects(userId) {
    const db = getFirestore();
    const subjectsRef = collection(db, "subjects");
    const q = query(subjectsRef, where("userId", "==", userId), where("status", "==", "Archived"), orderBy("subjectName", "asc"));

    const querySnapshot = await getDocs(q);
    const archivedSubjects = [];
    querySnapshot.forEach((doc) => {
        archivedSubjects.push({ id: doc.id, ...doc.data() });
    });

    return archivedSubjects;
}

export async function reactivateSubject(subjectId) {
    const db = getFirestore(); // Initialize Firestore
    const subjectRef = doc(db, "subjects", subjectId);

    try {
        // Update the status field of the subject to 'Active'
        await updateDoc(subjectRef, {
            status: 'Active'
        });
        console.log("Subject reactivated successfully");
    } catch (error) {
        console.error("Error reactivating subject:", error);
    }
}

// Function to delete a subject
export async function deleteSubject(subjectId) {
    const db = getFirestore(); // Initialize Firestore
    const subjectDocRef = doc(db, "subjects", subjectId); // Create a reference to the task document

    try {
        await deleteDoc(subjectDocRef); // Delete the document
        console.log("Subject deleted successfully");
    } catch (error) {
        console.error("Error deleting subject:", error);
    }
}


export async function fetchProjects(userId, projectId = null) {
    const db = getFirestore();
    const projectsRef = collection(db, "projects");
    let q;

    if (projectId) {
        q = query(projectsRef,
            where("userId", "==", userId),
            where("__name__", "==", projectId));
    }
    else {
        q = query(projectsRef,
            where("userId", "==", userId),
            where("status", "==", "Active"));
    }

    const querySnapshot = await getDocs(q);
    const projectsPromises = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const tasksAll = await fetchAllTasks(userId, null, data.projectName); // Fetches all tasks assigned to a project - used for collecting data for pie chart
        const tasksShow = await fetchTasks(userId, null, data.projectName); // Fetches active tasks assigned to a project - used to find next task due

        // Count the statuses
        const statusCounts = tasksAll.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        // Find the next upcoming task
        const sortedTasks = tasksShow.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const nextTask = sortedTasks[0]; // The task with the closest due date, regardless of its relation to today


        return {
            ...data,
            projectId: doc.id,
            projectDueDate: formatDate(data.projectDueDate),
            projectDueTime: formatTime(data.projectDueTime),
            nextTaskName: nextTask?.assignment, // Direct use if already formatted
            nextTaskDueDate: nextTask?.dueDate, // Direct use if already formatted
            nextTaskDueTime: nextTask?.dueTime, // Direct use if already formatted
            statusCounts: {
                Completed: statusCounts['Completed'] || 0,
                InProgress: statusCounts['In Progress'] || 0,
                NotStarted: statusCounts['Not Started'] || 0,
            }
        };
    });

    const projectsWithDetails = await Promise.all(projectsPromises);

    // Sort projects by due date, placing those without a due date at the end
    projectsWithDetails.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = a.projectDueDate ? new Date(a.projectDueDate) : new Date('9999-12-31');
        const dateB = b.projectDueDate ? new Date(b.projectDueDate) : new Date('9999-12-31');

        // Compare by dueDate first
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If due dates are the same, compare due times
        // Ensure dueTime is not null; default to "23:59" if null to put them at the end of the day
        const timeA = a.projectDueTime ? a.projectDueTime : '23:59';
        const timeB = b.projectDueTime ? b.projectDueTime : '23:59';

        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        // If due dates are the same, then sort by project name
        return a.projectName.localeCompare(b.projectName);
    });

    return projectsWithDetails;
}


export async function addProject({ userId, projectDueDateInput, projectDueTimeInput, projectName, subject }) {
    const db = getFirestore(); // Initialize Firestore

    const projectData = {
        userId,
        projectName,
        subject,
        status: 'Active', // Assuming new subjects are active by default
    };

    // Conditionally add dates and times if provided
    if (projectDueDateInput) {
        projectData.projectDueDate = Timestamp.fromDate(new Date(projectDueDateInput + "T00:00:00"));
    }

    if (projectDueTimeInput) {
        const dateTimeString = projectDueDateInput + "T" + projectDueTimeInput + ":00";
        projectData.projectDueTime = Timestamp.fromDate(new Date(dateTimeString));
    }

    try {
        // Assuming 'projects' is the name of your collection
        await setDoc(doc(db, "projects", `${userId}_${Date.now()}`), projectData);
        console.log("Project added successfully");
    } catch (error) {
        console.error("Error adding subject:", error);
    }
}

export async function editProject(projectDetails) {
    const { projectId, userId, projectName, projectDueDateInput, projectDueTimeInput, status, subject } = projectDetails;

    const db = getFirestore(); // Initialize Firestore

    if (!projectId) {
        throw new Error("projectId is undefined, cannot update project");
    }

    // Initialize projectData with fields that are always present
    const projectData = {
        userId,
        projectName,
        status,
        subject,
    };

    // Conditionally add dates and times if provided
    if (projectDueDateInput) {
        projectData.projectDueDate = Timestamp.fromDate(new Date(projectDueDateInput + "T00:00:00"));
    }

    if (projectDueTimeInput) {
        const dateTimeString = projectDueDateInput + "T" + projectDueTimeInput + ":00";
        projectData.projectDueTime = Timestamp.fromDate(new Date(dateTimeString));
    }

    // Create a reference to the project document
    const projectDocRef = doc(db, "projects", projectId);

    // Use updateDoc to update the project document
    try {
        await updateDoc(projectDocRef, projectData);
        console.log("Project updated successfully");
    } catch (error) {
        console.error("Error updating project:", error);
    }
};

export async function archiveProject(projectId) {
    const db = getFirestore(); // Initialize Firestore
    const projectRef = doc(db, "projects", projectId);

    try {
        // Update the status field of the project to 'Archived'
        await updateDoc(projectRef, {
            status: 'Archived'
        });
        console.log("Project archived successfully");
    } catch (error) {
        console.error("Error archiving project:", error);
    }
}

export async function fetchArchivedProjects(userId) {
    const db = getFirestore();
    const projectsRef = collection(db, "projects");

    // Query to fetch only archived projects for the given user ID
    const q = query(projectsRef,
        where("userId", "==", userId),
        where("status", "==", "Archived"));

    const querySnapshot = await getDocs(q);
    const projectsWithDetails = querySnapshot.docs.map(doc => {
        const data = doc.data();

        return {
            ...data,
            projectId: doc.id,
            projectDueDate: formatDate(data.projectDueDate),
        };
    });

    // Sort projects by due date, placing those without a due date at the end
    projectsWithDetails.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = a.projectDueDate ? new Date(a.projectDueDate) : new Date('9999-12-31');
        const dateB = b.projectDueDate ? new Date(b.projectDueDate) : new Date('9999-12-31');

        // Compare by dueDate first
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If due dates are the same, compare due times
        // Ensure dueTime is not null; default to "23:59" if null to put them at the end of the day
        const timeA = a.projectDueTime ? a.projectDueTime : '23:59';
        const timeB = b.projectDueTime ? b.projectDueTime : '23:59';

        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;

        return a.projectName.localeCompare(b.projectName);
    });

    return projectsWithDetails;
}

export async function reactivateProject(projectId) {
    const db = getFirestore(); // Initialize Firestore
    const projectRef = doc(db, "projects", projectId);

    try {
        // Update the status field of the project to 'Active'
        await updateDoc(projectRef, {
            status: 'Active'
        });
        console.log("Project reactivated successfully");
    } catch (error) {
        console.error("Error reactivating project:", error);
    }
}

export async function deleteProject(projectId) {
    const db = getFirestore(); // Initialize Firestore
    const projectDocRef = doc(db, "projects", projectId); // Create a reference to the project document

    try {
        await deleteDoc(projectDocRef); // Delete the document
        console.log("Project deleted successfully");
    } catch (error) {
        console.error("Error deleting project:", error);
    }
}

// Event listeners for form submissions and button clicks
// Example: document.getElementById('register-form').addEventListener('submit', registerUser);
// Monitor auth state
onAuthStateChanged(auth, (userID) => {
    if (userID) {
        // User is signed in
        // Update UI or redirect
        // ...
    } else {
        // User is signed out
        // Update UI
        // ...
    }
});
