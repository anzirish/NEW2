import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongoose connected!!');
  } catch (error) {
    console.log('Mongoose connection error', error.message);
    process.exit(1);
  }
};