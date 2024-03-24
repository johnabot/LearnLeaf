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
function formatDate(timestamp) {
    if (!timestamp) {
        return ''; // Return empty string if timestamp is undefined, null, etc.
    }

    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
    const options = { day: 'numeric', month: 'long', year: 'numeric' }; // Format options
    return date.toLocaleDateString(undefined, options); // Format the date
}

// Helper function to format Firestore Timestamp to "HH:MM AM/PM"
function formatTime(timestamp) {
    if (!timestamp) {
        return ''; // Return empty string if timestamp is undefined, null, etc.
    }

    const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
    const options = { hour: '2-digit', minute: '2-digit' }; // Format options
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
            orderBy("dueTime", "asc")
        );
    } else if (project) {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("project", "==", project),
            where("status", "!=", "Completed"),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc")
        );
    } else {
        q = query(
            collection(db, "tasks"),
            where("userId", "==", userId),
            where("status", "!=", "Completed"),
            orderBy("dueDate", "asc"),
            orderBy("dueTime", "asc")
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


export function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';  // Clear existing tasks

    tasks.forEach(task => {
        const row = tasksList.insertRow();
        row.innerHTML = `
            <td>${task.subject}</td>
            <td>${task.project}</td>
            <td>${task.assignment}</td>
            <td>
                <select class="priority-dropdown ${'priority-' + task.priority.toLowerCase()}">
                    <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                    <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                </select>
            </td>
            <td>
                <select class="status-dropdown ${'status-' + task.status.toLowerCase().replace(' ', '-')}" >
                    <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                    <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td>${task.startDate}</td>
            <td>${task.dueDate}</td>
            <td>${task.timeDue}</td>
        `;
    });
};

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

export async function fetchProjects(userId) {
    const db = getFirestore();
    console.log("Fetching projects");
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", userId), where("status", "==", "Active"), orderBy("projectDueDate","asc"), orderBy("projectName","asc"));

    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            projectId: doc.id,
            projectDueDate: formatDate(data.projectDueDate),
            nextTaskDueDate: formatDate(data.nextTaskDueDate),
            projectDueTime: formatTime(data.projectDueTime),
            nextTaskDueTime: formatTime(data.nextTaskDueTime),
        }
    });

    console.log(projects);

    return projects;
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
