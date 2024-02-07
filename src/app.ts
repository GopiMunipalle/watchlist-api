import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
const app = express();
import connectDb from "./db";
import router from "./routes/router";
config();

const PORT: string = process.env.PORT || "5005";
app.use(bodyParser.json());
app.use('/movies',router)

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });
