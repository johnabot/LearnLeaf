import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, where, query, orderBy, Timestamp, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyA8rr1TEUUZ9b_PqR475mszkoC0aMoHeTE",
  authDomain: "learnleaf-organizer.firebaseapp.com",
  projectId: "learnleaf-organizer",
  storageBucket: "learnleaf-organizer.appspot.com",
  messagingSenderId: "998389863314",
  appId: "1:998389863314:web:3da40aae1598c7904c674b",
  measurementId: "G-8XX0HRFBCX"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore();
export function registerUser(email, password, name) {
  return createUserWithEmailAndPassword(auth, email, password).then(async userCredential => {
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email
    });
  }).catch(error => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error code: " + errorCode + "\n" + errorMessage);
    throw error;
  });
}
export function resetPassword(email) {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email).then(() => {
    console.log('Password reset email sent.');
  }).catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Error code: " + errorCode + "\n" + errorMessage);
    throw error;
  });
}
export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(async userCredential => {
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error('User does not exist');
    }
    const userName = userDoc.data().name;
    const userEmail = user.email;
    return {
      id: user.uid,
      name: userName,
      email: userEmail
    };
  }).catch(error => {
    console.error("Login error", error);
    throw error;
  });
}
document.addEventListener('DOMContentLoaded', function () {
  fetchTasks();
});
function formatDate(timestamp) {
  if (!timestamp) {
    return '';
  }
  const date = timestamp.toDate();
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return date.toLocaleDateString(undefined, options);
}
function formatTime(timestamp) {
  if (!timestamp) {
    return '';
  }
  const date = timestamp.toDate();
  const options = {
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleTimeString(undefined, options);
}
export async function fetchTasks(userId, subject = null, project = null) {
  const db = getFirestore();
  let q;
  if (subject) {
    q = query(collection(db, "tasks"), where("userId", "==", userId), where("subject", "==", subject), where("status", "!=", "Completed"), orderBy("dueDate", "asc"), orderBy("dueTime", "asc"));
  } else if (project) {
    q = query(collection(db, "tasks"), where("userId", "==", userId), where("project", "==", project), where("status", "!=", "Completed"), orderBy("dueDate", "asc"), orderBy("dueTime", "asc"));
  } else {
    q = query(collection(db, "tasks"), where("userId", "==", userId), where("status", "!=", "Completed"), orderBy("dueDate", "asc"), orderBy("dueTime", "asc"));
  }
  const querySnapshot = await getDocs(q);
  const tasks = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      taskId: doc.id,
      startDate: formatDate(data.startDate),
      dueDate: formatDate(data.dueDate),
      dueTime: formatTime(data.dueTime)
    };
  });
  return tasks;
}
export function displayTasks(tasks) {
  const tasksList = document.getElementById('tasks-list');
  tasksList.innerHTML = '';
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
}
;
export async function addTask(taskDetails) {
  const {
    userId,
    subject,
    project,
    assignment,
    priority,
    status,
    startDateInput,
    dueDateInput,
    dueTimeInput
  } = taskDetails;
  const dueDate = Timestamp.fromDate(new Date(dueDateInput + "T00:00:00"));
  const dateTimeString = dueDateInput + "T" + dueTimeInput + ":00";
  const dueTime = Timestamp.fromDate(new Date(dateTimeString));
  const taskData = {
    userId,
    subject,
    project,
    assignment,
    priority,
    status,
    dueDate,
    dueTime
  };
  if (startDateInput) {
    taskData.startDate = Timestamp.fromDate(new Date(startDateInput + "T00:00:00"));
  }
  try {
    await setDoc(doc(db, "tasks", `${userId}_${Date.now()}`), taskData);
    console.log("Task added successfully");
  } catch (error) {
    console.error("Error adding task:", error);
  }
}
;
export async function editTask(taskDetails) {
  const {
    taskId,
    userId,
    subject,
    project,
    assignment,
    priority,
    status,
    startDateInput,
    dueDateInput,
    dueTimeInput
  } = taskDetails;
  const db = getFirestore();
  const dueDate = Timestamp.fromDate(new Date(dueDateInput + "T00:00:00"));
  const dateTimeString = dueDateInput + "T" + dueTimeInput + ":00";
  const dueTime = Timestamp.fromDate(new Date(dateTimeString));
  const taskData = {
    userId,
    subject,
    project,
    assignment,
    priority,
    status,
    dueDate,
    dueTime
  };
  if (startDateInput) {
    taskData.startDate = Timestamp.fromDate(new Date(startDateInput + "T00:00:00"));
  }
  const taskDocRef = doc(db, "tasks", taskId);
  try {
    await updateDoc(taskDocRef, taskData);
    console.log("Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
;
export async function deleteTask(taskId) {
  const db = getFirestore();
  const taskDocRef = doc(db, "tasks", taskId);
  try {
    await deleteDoc(taskDocRef);
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}
export async function fetchSubjects(userId) {
  const db = getFirestore();
  const subjectsRef = collection(db, "subjects");
  const q = query(subjectsRef, where("userId", "==", userId), where("status", "==", "Active"), orderBy("subjectName", "asc"));
  const querySnapshot = await getDocs(q);
  const subjects = [];
  querySnapshot.forEach(doc => {
    subjects.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return subjects;
}
export async function addSubject({
  userId,
  subjectName,
  semester
}) {
  const db = getFirestore();
  const subjectData = {
    userId,
    subjectName,
    semester,
    status: 'Active'
  };
  try {
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
  console.log("Fetching projects");
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, where("userId", "==", userId), where("status", "==", "Active"), orderBy("projectDueDate", "asc"), orderBy("projectName", "asc"));
  const querySnapshot = await getDocs(q);
  const projects = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      projectId: doc.id,
      projectDueDate: formatDate(data.projectDueDate),
      nextTaskDueDate: formatDate(data.nextTaskDueDate),
      projectDueTime: formatTime(data.projectDueTime),
      nextTaskDueTime: formatTime(data.nextTaskDueTime)
    };
  });
  console.log(projects);
  return projects;
}
export async function addProject({
  userId,
  projectDueDateInput,
  projectDueTimeInput,
  projectName,
  subject
}) {
  const db = getFirestore();
  const projectDueDate = Timestamp.fromDate(new Date(projectDueDateInput + "T00:00:00"));
  const dateTimeString = projectDueDateInput + "T" + projectDueTimeInput + ":00";
  const projectDueTime = Timestamp.fromDate(new Date(dateTimeString));
  const projectData = {
    userId,
    projectDueDate,
    projectDueTime,
    projectName,
    subject,
    status: 'Active'
  };
  try {
    await setDoc(doc(db, "projects", `${userId}_${projectName}`), projectData);
    console.log("Project added successfully");
  } catch (error) {
    console.error("Error adding subject:", error);
  }
}
onAuthStateChanged(auth, userID => {
  if (userID) {} else {}
});

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