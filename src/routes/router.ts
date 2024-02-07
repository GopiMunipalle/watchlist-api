import userController from "../controller/userController";
import express from "express";
import middleware from "../middleware/middleware";
const router = express.Router();

router.post("/singIn", userController.singIn);
router.post("/login", userController.login);
router.get("/get", userController.moviesList);
router.post("/createWatchlist", middleware, userController.createWatchList);
router.post("/addMovieToList/:id", middleware, userController.addMovie);
router.get("/getAllMovies", userController.getAllMovies);
router.get(
  "/getMoviesWithUser/:id",
  middleware,
  userController.getMoviesWithUser
);
router.get("/getwatchlist", middleware, userController.getWishlists);

export default router;
