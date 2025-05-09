

import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.sendStatus(401);
      
    }

    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const auth0Id = decoded?.sub;

      const user = await User.findOne({ auth0Id });

      if (!user) {
      return res.sendStatus(401);
      
      }

      req.auth0Id = auth0Id!;
      req.userId = user._id.toString();

      next();
    } catch (error) {
      console.error("JWT Parse Middleware Error:", error);
      res.sendStatus(401);
    }
  })();
};



