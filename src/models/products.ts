
import client from '../database.js'


export type product = {
    id?: Number;
    type:string;
    name: string;
    brand: string;
    description: string;
    price: Number;
    filename: string

}

export class productsStore {
    async index(): Promise<product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';
            const results = await conn.query(sql);
            conn.release();
            //@ts-ignore
            return results.rows;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async create(product: product): Promise<product> {
        try {

            const conn = await client.connect();
            const sql = 'INSERT INTO products (name, type, brand, description, price, filename) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const results = await conn.query(sql, [product.name, product.type, product.brand, product.description, product.price, product.filename]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async read(id: string): Promise<product> {
        try {
            
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const results = await conn.query(sql, [id]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async findcatalogProducts(type: string, brand: string): Promise<product[]> {
        try {

            /*
            I wanted to return products of any type when type = "type" and of any brand when brand="brand"
            but type="type" only returns all when it is single quote, while parameters ($1) only work with double quotes
            so single quote or double quote are used according to input  
            */
            let typeCheck;
            let brandCheck;
            if(type == "type") typeCheck = 'type = "type" AND $1 = $1';
            else typeCheck = "type = ($1)";

            if(brand == "brand") brandCheck = 'brand = "brand" AND $2 = $2';
            else brandCheck = "brand = ($2)";
            
            const conn = await client.connect();
            const sql = `SELECT * FROM products WHERE ${typeCheck} AND ${brandCheck}`;
            const results = await conn.query(sql, [type, brand]);
            conn.release();
            //@ts-ignore
            return results.rows;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async delete(id: string): Promise<product> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const results = await conn.query(sql, [Number(id)]);
            conn.release();
            //@ts-ignore
            return results;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }
}
