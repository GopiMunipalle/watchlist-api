import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestWithUser } from "./customType";

const middleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    let jwtToken = null;
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken === null) {
      return res.status(404).send({ error: "JWT token not found" });
    } else {
      await jwt.verify(jwtToken, "secret_key", async (error, payload) => {
        if (error || !payload) {
          return res.status(404).send({ error: "Invalid access token" });
        } else {
          req.email = (payload as JwtPayload).email;
          next();
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default middleware;

