import { Request, Response } from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import path from "path"

dotenv.config()

const { tokenSecret, adminTokenSecret } = process.env;

//If permission = "admin", admin token is added to response along with user token.
const createToken = (res: Response, data: any, permission?: string) => {
  const options = {
    expires: new Date(Date.now() + 10 * 60 * 1000), //10 minutes
    secure: false,
    httpOnly: true, //To prevent client-side access to cookies
  }
  if (permission == "admin") {
    const adminToken = jwt.sign({ data: data }, adminTokenSecret as string)
    res.cookie('admin', adminToken, options)
  }

  const token = jwt.sign({ data: data }, tokenSecret as string)

  console.log("about to send cookies")
  res.cookie('user', token, options);
  console.log("sent all cookies")
  return;
}

//checks request for use token, to determine whether to render user or guest layout
const verifyLogIn = (req: Request, res: Response, next: any) => {
  const __dirname = path.resolve();
  try {
    if (req.cookies.user) {
      const token: string = req.cookies.user;
      const decoded = jwt.verify(token, tokenSecret as string)
      
    /*
    I needed to have different layout for users and guests according to token, 
    but "extends layout" cannot be a variable,
    so I instead change directory folder to refer to a different file with the same name, thus not changing "extends layout".
    This is the proper way according to pug devs.
    */
      res.locals.basedir = path.join(__dirname, 'views/user');
      next()
    } else throw ("error");
  } catch (error) {
    console.log("Token Auth Failed")    
    res.locals.basedir = path.join(__dirname, 'views/guest');
    next()

  }
}

//Currently only verifies admin token, as no page is limited to users yet
const verifyAuthToken = (secret: string) => {
  return (req: Request, res: Response, next: any) => {

    const __dirname = path.resolve();

    try {
      if (req.cookies.admin) {
        const token: string = req.cookies.admin;
        const decoded = jwt.verify(token, secret)
        next()
      }
      else throw ("error");
    }
    catch (error) {
      res.send("<p>Invalid Authentication Token.</p>")
    }
  }
}

//If a request has user token, redirect to product catalog instead. Used for signin requests.
const redirectToHome = (req: Request, res: Response, next: () => void) => {
  try {
    if (req.cookies.user) {
      const token: string = req.cookies.user;
      const decoded = jwt.verify(token, tokenSecret as string)
      res.redirect("/")
    } else throw ("error");
  } catch (error) {
    next()
  }
}

export {
  verifyLogIn,
  createToken,
  verifyAuthToken,
  redirectToHome
}