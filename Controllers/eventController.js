import { connectToCluster } from "../Utils/connectToDb.js";
import { ObjectId } from "mongodb";

export async function createEventDocument(req, res) {
  const uri = process.env.MONGO_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("application");
    const collection = db.collection("events");
    const docu = await collection.insertOne({
      ...req.body,
      timestamp: new Date(),
    });
    res.status(201).json(docu.insertedId);
  } finally {
    await mongoClient.close();
  }
}

export async function deleteEventById(req, res) {
  const uri = process.env.MONGO_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("application");
    const collection = db.collection("events");
    const id = req.params.id.toString();
    const o_id = new ObjectId(id);
    await collection.deleteOne({ _id: o_id });
    res.status(200).json("Document Deleted");
  } finally {
    await mongoClient.close();
  }
}

export async function editEventById(req, res) {
  const uri = process.env.MONGO_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("application");
    const collection = db.collection("events");
    const id = req.params.id.toString();
    const o_id = new ObjectId(id);
    console.log(req.body);
    const updatedDocu = await collection.updateOne(
      { _id: o_id },
      { $set: req.body }
    );
    const docu = await collection.findOne({ _id: o_id });
    res.status(200).json(docu);
  } finally {
    await mongoClient.close();
  }
}

export async function getEventByIdOrAll(req, res) {
  const uri = process.env.MONGO_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("application");
    const collection = db.collection("events");
    let id = req.query.id;
    if (id) {
      id = req.query.id.toString();
      const o_id = new ObjectId(id);
      const docu = await collection.findOne({ _id: o_id });
      res.status(200).json(docu);
    } else {
      const pageSize = Number(req.query.limit);
      const pageNo = Number(req.query.page);
      const totalDocuments = await collection.countDocuments({});
      const _sort = { timestamp: -1 };
      const events = await collection
        .find({})
        .limit(pageSize)
        .skip(pageSize * (pageNo - 1))
        .sort(_sort)
        .toArray();

      res.json({
        events,
        pageNo,
        pages: Math.ceil(totalDocuments / pageSize),
      });
    }
  } finally {
    await mongoClient.close();
  }
}
