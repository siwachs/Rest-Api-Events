import express from "express";
import dotEnv from "dotenv";
import { fileUpload } from "./Middleware/fileUpload.js";
import path from "path";
import eventRoutes from "./Routes/eventRoutes.js";

//ErrorHandlers
import { errorHandler, notFound } from "./Middleware/errorMiddleware.js";

const app = express();
dotEnv.config();

//Body parse
app.use(express.json());

//Serve Images Statically
app.use("/uploads/images", express.static(path.join("uploads", "images")));

//CORS ERROR
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Test API
app.get("/api/islive", (req, res) => {
  res.send("Api is Working");
});

//Routes
app.use("/api/v3/app", eventRoutes);

//Upload a Image
app.post("/api/upload", fileUpload.single("image"), (req, res) => {
  const path = "http://localhost:5000/" + req.file.path;
  res.send(path);
});

//404 error
app.use(notFound);

//Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`listen on port ${PORT} in ${process.env.NODE_ENV}`)
);
