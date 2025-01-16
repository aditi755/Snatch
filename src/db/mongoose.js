// import mongoose from 'mongoose';

// const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URI);
//     console.log("Connected to MongoDB successfully");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// };

// export default connectDb;


import * as mongoose from 'mongoose';

const connectDb = async () => {
  console.log("MongoDB URI:", process.env.DB_URI);

  try {
   
    // Avoid creating a new connection if already connected
    if (mongoose?.connection?.readyState === 1) {
      console.log("Database already connected.");
      return;
    }

    // Establish connection
    await mongoose.connect(process.env.DB_URI);

    console.log("Database connection successful!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection failed.");
  }
};

export default connectDb;
