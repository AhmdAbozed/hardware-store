import { brands_typesStore, brand_type } from '../models/brands_types.js';
import { Request, Response } from 'express'
import express from "express"

const store = new brands_typesStore()


/*
when a new product is added, its brand and type are passed to following function.
if its brand-type combo already exists, increase quantity by one
else, add new brand-type entry with quantity 1
*/
const addbrand_type = async function (brand:string, type:string) {
    
    const brands_types = await store.index()
    
    const inputBrand = brand;
    const inputType = type;

    for (const row of brands_types) {
        if(row.brand == inputBrand && row.type == inputType){
            console.log("found brand")
            console.log(row);
            const result = store.addone(Number(row.id))
            console.log("result of adding one: "+result)
            return result;

        }
    }

    const newBrand:brand_type = {
        brand: inputBrand,
        type: inputType,
        quantity: 1
    }

    const result = store.create(newBrand)
    return result; 
}

const getbrands_types = async function (req: Request, res: Response) {
    const brands_types = await store.index()
    res.send(brands_types)

}

const brands_typesRoutes = (app: express.Application) => {

    app.get("/filters", getbrands_types);

}

export  {addbrand_type, brands_typesRoutes}