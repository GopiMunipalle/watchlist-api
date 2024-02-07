import { Request } from "express";

interface RequestWithUser extends Request {
  email?: string;
  _id?: string;
}

export { RequestWithUser };
