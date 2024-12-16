/*
This file is not documented using comments yet.
formidable is used to parse imgs from backblaze.
*/

import express from "express"
import { Request, Response } from 'express'
import { productsStore, product } from '../models/products.js';
import {addbrand_type} from '../controller/brands_types.js';
import dotenv from 'dotenv'
import { verifyAuthToken } from "../util/tokenauth.js"
import blazeApi from "../util/backblaze.js"
import fs from "fs"
import formidable from "formidable"
import https, { get } from "https"
import path from "path";

dotenv.config()

const { adminTokenSecret, blazeKeyId, blazeKey, HOST_PORT } = process.env

const store = new productsStore();

const uploadImg = async function (filepath: string, size: number, url_token: any, fileId:string) {
    const url = new URL(url_token.uploadUrl)
    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            Authorization: url_token.authorizationToken,
            "X-Bz-File-Name": fileId+".png",
            "Content-Type": "image/png",
            "Content-Length": fs.readFileSync(filepath).byteLength,
            "X-Bz-Content-Sha1": "do_not_verify"
            
        }
    }

    return new Promise((resolve, reject) => {
        let uploadresult:any;
        const blazeUploading = https.request(options, (res) => {

            console.log("about to get blaze urls")
            res.on('data', (chunk) => {

                uploadresult = JSON.parse(chunk);

            })
            res.on('end', () => {console.log("img upload result: "+JSON.stringify(uploadresult)), resolve(uploadresult); });


        })
        blazeUploading.on('error', (err) => {
            reject(err);
        });
        blazeUploading.write(fs.readFileSync(filepath))
        //blazeUploading.write("hello")
        console.log(filepath)
        blazeUploading.end()
    })
}
const saveImg = async function (filepath: string, fileId:string){
    console.log('filepath is', filepath);
    //@ts-ignore
    await fs.readFileSync('/home', fs.readFileSync(filepath))
}
const addProductGet = async function (req: Request, res: Response) {

    const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;
    res.render("management.pug", {host: host})

}

const addProductPost = async function (req: Request, res: Response) {
    
    console.log("the body " + JSON.stringify(req.body));
    //@ts-ignore
    const form = new formidable.IncomingForm({ uploadDir: path.resolve()+'/resources/images/', filename: (name, ext, part, form) => {
        return part.originalFilename; // Will be joined with options.uploadDir.
    }});

    let submission: product;
    let result;
    
    form.parse(req, async (err, fields, files) => {
        console.log(fields.filename, 'uploaded file name')
        //@ts-ignore // string|string[] isnt assignable to string
        submission = { name: fields.name, type: fields.type, brand: fields.brand, filename: fields.filename, price: Number(fields.price), description: fields.description }

        result = await store.create(submission)

        if (result) {
            
            //@ts-ignore same error as on 75
            const brandresult = await addbrand_type(fields.brand, fields.type)

            console.log(brandresult)
            //@ts-ignore gives error: filepath doesnt exist on img
            /*
            const blazeUrls = await blazeApi(blazeKeyId!, blazeKey!);
            console.log("blaze stuff in controller: " + JSON.stringify(blazeUrls))
            //@ts-ignore, gives error: filepath doesnt exist on img
            uploadImg(files.img.filepath, files.img.size, blazeUrls, result.id)
            */
        }

        if (err) {
            console.log("Error parsing the files: " + err);
        }

    });

    //below comment for ref only, has no use
    //fs.writeFileSync("C:/Users/DELL/Desktop/hello.png",URL.createObjectURL(req.body.file))
    res.end("recieved");

}

const getProduct = async function (req: Request, res: Response) {

    if(isNaN(Number(req.params.id))){
        res.send("Invalid id.")
        return;
    }

    const product = await store.read(req.params.id);
    

    if (product.id) {
        console.log('getting product')
        const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;
        res.render("product_info.pug", {host: host,name: product.name, type: product.type, brand: product.brand, description: product.description, price: product.price, file_name: product.filename })

    }

    else{
        res.send("Error: 404. Not found")
    }

}

const getCatalog = async function (req: Request, res: Response) {
    console.log("PROTOCOL: "+req.protocol)
    const host = req.protocol + "://" +req.hostname+":"+HOST_PORT;
    res.render("product_catalog.pug", {host: host})

}

const getCatalogProducts = async function (req: Request, res: Response) {

    const result = await store.findcatalogProducts(req.params.type, req.params.brand);
    res.send(result);

}

const productsRoutes = (app: express.Application) => {

    app.get("/addProduct", verifyAuthToken(adminTokenSecret as string),addProductGet);
    app.post("/addProduct", verifyAuthToken(adminTokenSecret as string), addProductPost);
    app.get("/product/:id", getProduct);
    app.get("/products/:type-:brand", getCatalogProducts)
    app.get("/", getCatalog)

}

export default productsRoutes;