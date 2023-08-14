const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");
const express = require("express");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const app = express();
const cors = require("cors");
app.use(cors({ origin: true }));


const db = admin.firestore();

// ROUTES
app.get("/hello", (req, res) => {
  return res.status(200).send("Hello World!");
});

// CREATE
app.post("/api/create", async (req, res) => {
  try {
    await db.collection("posts").doc("/" + req.body.id + "/")
      .create({
        postId: req.body.id,
        imageUrl: req.body.imageUrl,
        userId: req.body.userId,
      });
    return res.status(201).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

// READ
app.get("/api/read", async (req, res) => {
  try {
    const query = db.collection("posts");
    const querySnapshot = await query.get();
    const posts = [];
    querySnapshot.forEach(
      (doc) => {
        posts.push({
          id: doc.id,
          data: doc.data(),
        });
      },
    );
    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

app.get("/api/read/:id", async (req, res) => {
  try {
    const snapshot = await db.collection("posts").doc(req.params.id).get();
    const post = snapshot.data();
    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

// UPDATE

// DELETE

// export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
