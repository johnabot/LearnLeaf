// @flow
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, where, query, orderBy, Timestamp, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
                email: email
            });
            // Additional user info or redirection can be handled here
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
            // Assuming the user's document contains a name field
            const userName = userDoc.data().name;
            const userEmail = user.email; // Directly from auth user object
            return { id: user.uid, name: userName, email: userEmail };
        })
        .catch((error) => {
            // Error handling
            console.error("Login error", error);
            throw error; // Propagate the error
        });
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

    const options = { day: 'numeric', month: 'long', year: 'numeric' }; // Format options
    return date.toLocaleDateString(undefined, options); // Format the date
}


// Helper function to format Firestore Timestamp to "HH:MM AM/PM"
function formatTime(input) {
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
        console.error('Unsupported time type:', input);
        return '';
    }

    const options = { hour: '2-digit', minute: '2-digit', hour12: true }; // Use hour12: true for AM/PM format
    return date.toLocaleTimeString(undefined, options); // Format the time according to user's browser settings
}


export async function fetchTasks(userId, subject = null, project = null) {
    const db = getFirestore();
    let q;

    if (subject) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("subject", "==", subject),
            where("status", "!=", "Completed"),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc"),
            orderBy("assignment","asc")
        );
    } else if (project) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("project", "==", project),
            where("status", "!=", "Completed"),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc"),
            orderBy("assignment", "asc")
        );
    } else {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("status", "!=", "Completed"),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc"),
            orderBy("assignment", "asc")
        );
    }

    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            taskId: doc.id,
            startDate: formatDate(data.startDate),
            dueDate: formatDate(data.dueDate),
            dueTime: formatTime(data.dueTime),
        };
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
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc"),
            orderBy("assignment", "asc")
        );
    } else if (project) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("project", "==", project),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc"),
            orderBy("assignment", "asc")
        );
    } else {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc"),
            orderBy("assignment", "asc")
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

    return tasksAll;
}

// Function to create a new task
export async function addTask(taskDetails) {
    const { userId, subject, project, assignment, priority, status, startDateInput, dueDateInput, dueTimeInput } = taskDetails;

    // Convert dueDate and dueTime to Timestamps
    const dueDate = Timestamp.fromDate(new Date(dueDateInput + "T00:00:00"));
    const dateTimeString = dueDateInput + "T" + dueTimeInput + ":00";
    const dueTime = Timestamp.fromDate(new Date(dateTimeString));

    // Initialize taskData with fields that are always present
    const taskData = {
        userId,
        subject,
        project,
        assignment,
        priority,
        status,
        dueDate,
        dueTime,
    };

    // Conditionally add startDate if provided
    if (startDateInput) {
        taskData.startDate = Timestamp.fromDate(new Date(startDateInput + "T00:00:00"));
    }

    // Assuming tasks are stored in a 'tasks' collection
    try {
        await setDoc(doc(db, "tasks", `${userId}_${Date.now()}`), taskData); // Consider using Firestore auto-generated IDs instead
        console.log("Task added successfully");
    } catch (error) {
        console.error("Error adding task:", error);
    }
};

export async function editTask(taskDetails) {
    const { taskId, userId, subject, project, assignment, priority, status, startDateInput, dueDateInput, dueTimeInput } = taskDetails;
    const db = getFirestore(); // Initialize Firestore

    // Convert dueDate and dueTime to Timestamps
    const dueDate = Timestamp.fromDate(new Date(dueDateInput + "T00:00:00"));
    const dateTimeString = dueDateInput + "T" + dueTimeInput + ":00";
    const dueTime = Timestamp.fromDate(new Date(dateTimeString));

    // Initialize taskData with fields that are always present
    const taskData = {
        userId,
        subject,
        project,
        assignment,
        priority,
        status,
        dueDate,
        dueTime,
    };

    // Conditionally add startDate if provided
    if (startDateInput) {
        taskData.startDate = Timestamp.fromDate(new Date(startDateInput + "T00:00:00"));
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



// Function to delete a task
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
    const q = query(subjectsRef, where("userId", "==", userId), where("status", "==", "Active"), orderBy("subjectName","asc"));

    const querySnapshot = await getDocs(q);
    const subjects = [];
    querySnapshot.forEach((doc) => {
        subjects.push({ id: doc.id, ...doc.data() });
    });

    return subjects;
}

export async function addSubject({ userId, subjectName, semester }) {
    const db = getFirestore(); // Initialize Firestore
    const subjectData = {
        userId,
        subjectName,
        semester,
        status: 'Active', // Assuming new subjects are active by default
    };

    try {
        // Assuming 'subjects' is the name of your collection
        await setDoc(doc(db, "subjects", `${userId}_${subjectName}`), subjectData);
        console.log("Subject added successfully");
    } catch (error) {
        console.error("Error adding subject:", error);
    }
}

export async function archiveSubject(subjectId) {
    const db = getFirestore();
    const subjectRef = doc(db, "subjects", subjectId);
    const archivedSubjectRef = doc(collection(db, "archivedSubjects"));

    try {
        const subjectDoc = await getDoc(subjectRef);
        if (subjectDoc.exists()) {
            // Create a new document in the archivedSubjects collection with the same data
            await setDoc(archivedSubjectRef, { ...subjectDoc.data(), archivedDate: Timestamp.now() });

            // Delete the original document
            await deleteDoc(subjectRef);

            console.log("Subject archived successfully");
        }
    } catch (error) {
        console.error("Error archiving subject:", error);
    }
}

export async function fetchProjects(userId) {
    const db = getFirestore();
    console.log("Fetching projects for user:", userId);
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", userId), where("status", "==", "Active"), orderBy("projectDueDate", "asc"), orderBy("projectName", "asc"));

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
    console.log(projectsWithDetails);

    return projectsWithDetails;
}


export async function addProject({ userId, projectDueDateInput, projectDueTimeInput, projectName, subject }) {
    const db = getFirestore(); // Initialize Firestore

    const projectDueDate = Timestamp.fromDate(new Date(projectDueDateInput + "T00:00:00"));
    const dateTimeString = projectDueDateInput + "T" + projectDueTimeInput + ":00";
    const projectDueTime = Timestamp.fromDate(new Date(dateTimeString));

    const projectData = {
        userId,
        projectDueDate,
        projectDueTime,
        projectName,
        subject,
        status: 'Active', // Assuming new subjects are active by default
    };

    try {
        // Assuming 'projects' is the name of your collection
        await setDoc(doc(db, "projects", `${userId}_${projectName}`), projectData);
        console.log("Project added successfully");
    } catch (error) {
        console.error("Error adding subject:", error);
    }
}

export async function archiveProject(projectId) {
    const db = getFirestore();
    const projectRef = doc(db, "projects", projectId);
    const archivedProjectRef = doc(collection(db, "archivedProjects"));

    try {
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
            // Create a new document in the archivedProjects collection with the same data
            await setDoc(archivedProjectRef, { ...projectDoc.data(), archivedDate: Timestamp.now() });

            // Delete the original document
            await deleteDoc(projectRef);

            console.log("Project archived successfully");
        }
    } catch (error) {
        console.error("Error archiving project:", error);
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
