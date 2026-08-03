import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

  if (!mongoUrl) {
    console.error(
      "Error: MONGO_URL is not defined. Create a .env file and set MONGO_URL to your MongoDB connection string."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
