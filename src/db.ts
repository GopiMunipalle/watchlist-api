import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const url =
      process.env.MONGOOSE_URI !== undefined ? process.env.MONGOOSE_URI : "";
    await mongoose.connect(url);
    console.log("mongoose is connected");
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
};

export default connectDb;
