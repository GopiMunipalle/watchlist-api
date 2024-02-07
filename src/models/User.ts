import mongoose from "mongoose";

type UserType = {
  email: string;
  password: string;
  watchlist:{name:string,description:string,movies:string[]}[]; 
};

const userSchema = new mongoose.Schema<UserType>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchlist: {
    type: [], 
    required: false,
  },
});

 

const User = mongoose.model<UserType>("User", userSchema);

export { User };
