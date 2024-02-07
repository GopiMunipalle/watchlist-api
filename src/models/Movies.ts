import mongoose from "mongoose";

type movieType = {
  id: Number;
  title: String;
  year: Number;
  genre: Object;
  rating: Number;
  director: String;
  actors: Object;
  plot: String;
  poster: String;
  trailer: String;
  runtime: Number;
  awards: String;
  country: String;
  language: String;
  boxOffice: String;
  production: String;
  website: String;
};

const moviesShcema = new mongoose.Schema<movieType>({
  title: {
    type: String,
  },
  year: {
    type: Number,
  },
  poster: {
    type: String,
  },
  director: {
    type: String,
  },
  language: {
    type: String,
  },
});

const Movies = mongoose.model("Movies", moviesShcema);

export default Movies;
