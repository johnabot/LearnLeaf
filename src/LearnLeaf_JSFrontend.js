import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Function to handle user registration
export function registerUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
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

// Function to handle user login
export function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            alert("Successful login!");
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Error code: " + errorCode + "\n" + errorMessage);

            // Error handling
            throw error; // Throw the error so it can be caught where the function is called
        });
}


document.addEventListener('DOMContentLoaded', function () {
    fetchTasks();
});

function fetchTasks() {
    // Replace with the actual API endpoint
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            displayTasks(tasks);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';  // Clear existing tasks

    tasks.forEach(task => {
        const row = tasksList.insertRow();
        row.innerHTML = `
            <td>${task.subject}</td>
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
            <td>${task.time}</td>
        `;
    });
};


// Function to create a new task
function createTask() {
    // Get task details from form inputs
    const taskSubject = document.getElementById('task-subject').value;
    const taskAssignment = document.getElementById('task-assignment').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskStatus = document.getElementById('task-status').value;
    const taskStartDate = document.getElementById('task-start-date').value;
    const taskDueDate = document.getElementById('task-due-date').value;
    const taskDueTime = document.getElementById('task-due-time').value;

    // Create a task object
    const taskData = {
        subject: taskSubject,
        assignment: taskAssignment,
        priority: taskPriority,
        status: taskStatus,
        startDate: taskStartDate,
        dueDate: taskDueDate,
        dueTime: taskDueTime
    };

    // Send a POST request to the server
    fetch('/api/tasks')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('Received non-JSON response');
        }
        return response.json();
    })
    .then(tasks => {
        displayTasks(tasks);
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });

}


// Function to update a task
function editTask(taskId) {
    // Get updated task details from form inputs or inline editing fields
    const taskSubject = document.getElementById(`task-subject-${taskId}`).value;
    const taskAssignment = document.getElementById(`task-assignment-${taskId}`).value;
    const taskPriority = document.getElementById(`task-priority-${taskId}`).value;
    const taskStatus = document.getElementById(`task-status-${taskId}`).value;
    const taskStartDate = document.getElementById(`task-start-date-${taskId}`).value;
    const taskDueDate = document.getElementById(`task-due-date-${taskId}`).value;
    const taskDueTime = document.getElementById(`task-due-time-${taskId}`).value;

    // Create a task object with the updated details
    const taskData = {
        subject: taskSubject,
        assignment: taskAssignment,
        priority: taskPriority,
        status: taskStatus,
        startDate: taskStartDate,
        dueDate: taskDueDate,
        dueTime: taskDueTime
    };

    // Send a PUT request to the server to update the task
    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // Include authentication token if needed
        },
        body: JSON.stringify(taskData)
    })
        .then(response => response.json())
        .then(data => {
            // Handle response data
            console.log('Task updated:', data);
            // Optionally refresh the task list or provide user feedback
        })
        .catch(error => {
            console.error('Error updating task:', error);
        });
}


// Function to delete a task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Include authentication token if needed
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Task deleted:', data);
                // Optionally, remove the task from the list in the UI
                document.getElementById(`task-row-${taskId}`).remove();
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    }
}


// Event listeners for form submissions and button clicks
// Example: document.getElementById('register-form').addEventListener('submit', registerUser);
// Monitor auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        // Update UI or redirect
        // ...
    } else {
        // User is signed out
        // Update UI
        // ...
    }
});
// Additional functions for project management and other features can be added here

// Additional utility functions for handling DOM manipulations, API calls, etc., can be added here
