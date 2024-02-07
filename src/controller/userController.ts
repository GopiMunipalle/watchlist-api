import { User } from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Movies from "../models/Movies";
import { RequestWithUser } from "../middleware/customType";

const singIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const getUser = await User.findOne({ email });
    if (getUser) {
      res.status(400).send({ error: "User Already Exists" });
    } else {
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(200).send({ message: "User Successfully Registerd" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const checkUserEmail = await User.findOne({ email });

    if (!checkUserEmail) {
      //invalid email
      res.status(404).send({ error: "Invalid User name" });
    } else {
      //check password
      const isValidatePassword = await bcrypt.compare(
        password,
        checkUserEmail.password
      );

      if (isValidatePassword) {
        //create jwt
        const payload = { email: email };
        const jwtToken = await Jwt.sign(payload, "secret_key", {
          expiresIn: "30d",
        });
        res.status(200).send({ jwtToken: jwtToken });
      } else {
        //invalid password
        res.status(401).send({ error: "Invalid Password" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const moviesList = async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://freetestapi.com/api/v1/movies");
    const data = await response.json();
    for (let movie of data) {
      console.log(movie);
      const { title, year, poster, director, language } = movie;
      const newMovieListData = new Movies({
        title,
        year,
        poster,
        director,
        language,
      });

      await newMovieListData.save();
    }
    res.status(200).send({ message: "data Successfully inserted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const createWatchList = async (req: RequestWithUser, res: Response) => {
  try {
    const { name, description } = req.body;
    const userEmail = req.email;

    if (!name || !description) {
      return res.status(400).send({ error: "Invalid Data" });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const existingWatchlist = user.watchlist.find(
      (watchlist) => watchlist.name === name
    );

    if (existingWatchlist) {
      return res.status(400).send({ error: "Watchlist Already Exists" });
    }

    const newWatchlist = {
      name: name as string,
      description: description as string,
      movies: [],
    };

    user.watchlist.push(newWatchlist);
    await user.save();

    return res.status(200).send({ message: "Watchlist added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const addMovie = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userEmail = req.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      res.status(404).send({ error: "User not found" });
      return;
    }
    const watchlist = user.watchlist.find(
      (watchlist) => watchlist.name === name
    );

    if (!watchlist) {
      res.status(400).send({ error: "Watchlist not found" });
      return;
    }

    const movie = await Movies.findOne({ _id: id });

    if (!movie) {
      res.status(400).send({ error: "Movie not found" });
      return;
    }
    // const index = await user.watchlist.findIndex((watchlist) => {
    //   return watchlist.name === name;
    // });
    if (watchlist.movies.includes(id)) {
      return res.status(401).send({ error: "Movie Already Exists" });
    }

    let userdoc = await User.updateOne(
      { email: userEmail, "watchlist.name": name },
      {
        $push: {
          "watchlist.$.movies": id,
        },
      }
    );
    await user.save();

    res.status(200).send({ message: "Movie added to watchlist successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAllMovies = async (req: RequestWithUser, res: Response) => {
  try {
    const getAllMoviesQuery = await Movies.find();
    res.status(200).send(getAllMoviesQuery);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getMoviesWithUser = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const userEmail = req.email;
    const user = await User.findOne({ email: userEmail });

    if (user) {
      const watchlistMovieIds = user.watchlist
        .flatMap((watchlist) => watchlist.movies)
        .filter((movieId) => movieId === id);

      const moviesDetails = await Movies.find({
        _id: { $in: watchlistMovieIds },
      });

      console.log(moviesDetails);
      res.status(200).json(moviesDetails);
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWishlists = async (req: RequestWithUser, res: Response) => {
  try {
    const email = req.email;

    const userWishlist = await User.findOne(
      { email: email },
      { watchlist: true }
    );
    res.status(200).send(userWishlist);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  singIn,
  login,
  moviesList,
  createWatchList,
  addMovie,
  getAllMovies,
  getMoviesWithUser,
  getWishlists,
};
