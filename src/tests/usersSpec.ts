/*

only signing in and signing up have tests.
*/

import { user, usersStore } from "../models/users.js"
import supertest from "supertest";
import { app } from "../server.js";
import bcrypt from "bcrypt"
import dotenv from 'dotenv'

dotenv.config()

const { pepper } = process.env;


const request = supertest(app);

const store = new usersStore();

const testuser: user = {
    id: 0,
    username: "testinguser",
    password: "testingpass",
    email: "testingemail@gmail.com"
}

describe("users Model", () => {
    it("test signin GET endpoint", async () => {
        const response = await request.get("/user/signin");
        expect(response.status).toBe(200);
    });
    
    it("test signup GET endpoint", async () => {
        const response = await request.get("/user/signup");
        expect(response.status).toBe(200);
    });

    it('signup method should add user to DB', async () => {
        const result = await store.signup(testuser);
        if (bcrypt.compareSync(testuser.password + pepper, result.password)) {
            result.password = "testingpass"
        };
        expect(result).toEqual({
            id: 1,
            username: "testinguser",
            password: "testingpass",
            email: "testingemail@gmail.com"
        });

    });

    it('signin method should signin', async () => {
        const result = await store.signin(testuser);
        console.log(testuser.password + pepper)
        if (result[0]) {
            if (bcrypt.compareSync(testuser.password + pepper, result[0].password)) {
                result[0].password = "testingpass"
            };
        }
        expect(result[0]).toEqual({
            id: 1,
            username: "testinguser",
            password: "testingpass",
            email: "testingemail@gmail.com"
        });

    });



});