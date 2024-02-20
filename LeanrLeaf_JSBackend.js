//LearnLeaf Iteration 1 Backend

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