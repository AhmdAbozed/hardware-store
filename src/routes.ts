//The routes from each controller are merged here, then imported for app in server.ts

import express from "express";
import usersRoutes from "./controller/users.js";
import productsRoutes from "./controller/products.js";
import { brands_typesRoutes } from "./controller/brands_types.js";
import {verifyLogIn} from "./util/tokenauth.js"

const catalog = function(app: express.Application){
    app.use("/", verifyLogIn)
    usersRoutes(app);
    productsRoutes(app);
    brands_typesRoutes(app);
}

export default catalog;
