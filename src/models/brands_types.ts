
import client from '../database.js'


export type brand_type = {
    id?:number
    brand: string;
    type: string;
    quantity: number;
    
}

export class brands_typesStore {
    
    async create(brand_type: brand_type): Promise<brand_type> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO brands_types (brand, type, quantity) VALUES ($1, $2, $3) RETURNING *';
            const results = await conn.query(sql, [brand_type.brand, brand_type.type, brand_type.quantity]);
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    //increase number of products of a certain brand/type by one, runs when a new product is added.
    async addone(id: number): Promise<brand_type> {
        try {
            const conn = await client.connect();
            const sql = 'UPDATE brands_types SET quantity = quantity + 1 WHERE id=($1)';
            const results = await conn.query(sql, [id]);
            console.log("brand read Gottem: "+results)
            conn.release();
            //@ts-ignore
            return results.rows[0];
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }

    async index(): Promise<brand_type[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM brands_types';
            const results = await conn.query(sql);
            console.log("brand index Gottem: "+results)
            conn.release();
            //@ts-ignore
            return results.rows;
        }
        catch (err) {
            throw new Error(`${err}`)
        }
    }
}