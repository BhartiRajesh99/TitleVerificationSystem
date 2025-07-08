import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    if (process.env.NODE_ENV === "development") {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } else {
      console.log("MongoDB connected succefully");
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

export default app;