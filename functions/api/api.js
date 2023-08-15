const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");
const express = require("express");
const serverless = require('serverless-http');
const router = express.Router();

if (admin.apps.length === 0) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const api = express();
const cors = require("cors");
api.use(express.json());
api.use(cors({ origin: true }));
api.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

// ROUTES
router.get("/hello", (req, res) => {
  return res.json({ message: "HELLO SHUBHAM" });
});

// CREATE
router.post("/create", async (req, res) => {
  try {
    post = {
      postId: req.body.postId,
      imageUrl: req.body.imageUrl,
      userId: req.body.userId,
    };
    await db.collection("posts").doc("/" + req.body.postId + "/").create(post);
    return res.status(201).send(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// READ
router.get("/read", async (req, res) => {
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

router.get("/read/:id", async (req, res) => {
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

api.use('/.netlify/functions/api', router);
module.exports.handler = serverless(api);
