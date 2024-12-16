import { body, validationResult } from 'express-validator';
import express from "express"
import e, { Request, Response } from 'express'
import { usersStore, user } from '../models/users.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import {verifyAuthToken, redirectToHome, createToken} from "../util/tokenauth.js"
import bodyParser from "body-parser";
import path from "path"

dotenv.config()

const { tokenSecret, adminUsername, adminPassword, HOST_PORT} = process.env

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const store = new usersStore();

const userHome = function (req: Request, res: Response) {
    
    const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;
    res.render("homeLayout.pug", {host: host})

}

const signUpGet = function (req: Request, res: Response) {
    
    const __dirname = path.resolve()
    res.locals.basedir =  path.join(__dirname, 'views/guest');
    
    const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;
    res.render("signUp.pug", {host: host})

}

//See express-validator docs for, docs.
const signUpPost = [

    body('username').isLength({ min: 4, max: 30 }).withMessage("Username must be atleast 4 characters")
        .isAlphanumeric().withMessage("No special characters allowed."),

    body('email').isEmail().withMessage("Email invalid"),

    body('password').isLength({ min: 4, max: 30 }).withMessage("Password needs to be atleast 4 characters"),

    async function (req: Request, res: Response) {

        const errorArr = validationResult(req).array()

        if (errorArr[0]) {
            res.send(errorArr);
            console.log("ErrorArr: " + errorArr)
            console.log(validationResult(req))
            return;
        }

        const submission: user = {username: req.body.username, password: req.body.password, email: req.body.email  }
        
        const validation = await store.validateSignUp(submission)
        console.log("recieved validation: "+validation)
        if (validation[0]){
            res.send(validation);
            return;
        }
        const result = await store.signup(submission)

        createToken(res, result)
        
        res.send(errorArr)

        console.log("result/End Of Sign Up Function: "+result)
    }]

const signInGet = function (req: Request, res: Response) {
    
    const __dirname = path.resolve()
    res.locals.basedir =  path.join(__dirname, 'views/guest');
    
    const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;
    res.render("signIn.pug", {host: host})

}

const signInPost = async function (req: Request, res: Response) {
    console.log(adminUsername, adminPassword, req.body.username == adminUsername && req.body.password == adminPassword);

    if(req.body.username == adminUsername && req.body.password == adminPassword){
        console.log("admin logging in");

        createToken(res, "Adminstrator", "admin") 
        console.log("Back to users from token creation");

        res.send([1])
        return;
    }

    const submission: user = {username: req.body.username, password: req.body.password, email: ""}
    
    console.log("submission"+ submission.username + submission.password)
    
    const result = await store.signin(submission)

    if(result[0]){
        createToken(res, result[0])
    }
    res.send(result)

}

const signOut = function(req: Request, res: Response){
    if(req.cookies.admin){
        console.log("first cookie deletion")
        res.cookie('admin', "placeholder", {
            
            expires: new Date(2000), // time until expiration
            secure: false, // set to true if you're using https
            httpOnly: true,
        });
            
    }
    if(req.cookies.user){
        console.log("second cookie deletion")
        res.cookie('user', "placeholder", {
            expires: new Date(2000), // time until expiration
            secure: false, // set to true if you're using https
            httpOnly: true,
        });
        console.log("signing out")
    
    }
    
    const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;  
    res.render("signIn.pug", {host: host})
}

const usersRoutes = (app: express.Application) => {
    app.get("/user/signin",redirectToHome, signInGet)
    app.post("/user/signin",urlencodedParser, signInPost)
    app.get("/user/signup",redirectToHome, signUpGet)
    app.post("/user/signup",urlencodedParser, signUpPost)
    app.post("/user/signout", signOut)
    app.get("/home", verifyAuthToken(tokenSecret as string), userHome)

}

export default usersRoutes;