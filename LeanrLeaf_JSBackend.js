//LearnLeaf Iteration 2 Backend

const functions = require('firebase-functions'); // Functions for HTTP
const express = require('express'); // Express.js framework
const admin = require('firebase-admin'); // Firebase Admin SDK
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// we dont need to specify the service account key file. Firebase Functions handles this automatically
admin.initializeApp();

// User registration will have email and password
// async allows for making HTTP request
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await admin.auth().createUser({
      email: email,
      password: password
    });
    res.status(200).json({ message: 'User registered successfully' });
  } 
});

// HTTP POST: Finalize data to the server
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    res.status(200).json({ message: 'User logged in successfully', user: user });
  } 
});

// HTTP POST: Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = await admin.firestore().collection('tasks').add(req.body);
    res.status(200).json({ message: 'Task created successfully', taskId: newTask.id });
  } 
});

// HTTP PUT: Edit an existing server
app.put('/tasks/:id', async (req, res) => {
  try {
    await admin.firestore().collection('tasks').doc(req.params.id).update(req.body);
    res.status(200).json({ message: 'Task updated successfully' });
  } 
});

// HTTP DELETE: trashing any server by a specific URI
app.delete('/tasks/:id', async (req, res) => {
  try {
    await admin.firestore().collection('tasks').doc(req.params.id).delete();
    res.status(200).json({ message: 'Task deleted successfully' });
  } 
});

// Export the combined API as a Cloud Function
exports.api = functions.https.onRequest(app);


/*
Code before 3/18/2024
_______________________

// Imports
const functions = require('firebase-functions'); // Functions for HTTP
const express = require('express'); // Express.js framework
const app = express();

// User registration will have email and password
// async allows for making HTTP request
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
    const userCredential = await admin.auth().createUser({
      email: email,
      password: password
    })});

// HTTP POST: Finalize data to the server
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
    const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
  });

app.post('/tasks', async (req, res) => {
    const newTask = await admin.firestore().collection('tasks').add(req.body);
  });

// HTTP PUT: Edit an existing server
app.put('/tasks/:id', async (req, res) => {
    await admin.firestore().collection('tasks').doc(req.params.id).update(req.body);
  });

// HTTP DELETE: trashing any server by a specific URI
app.delete('/tasks/:id', async (req, res) => {
    await admin.firestore().collection('tasks').doc(req.params.id).delete();
});

exports.api = functions.https.onRequest(app);
*/