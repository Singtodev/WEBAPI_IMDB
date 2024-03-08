import  { Request , Response } from 'express';
import { condb, queryAsync } from '../../utils/condb';
import { MysqlError } from 'mysql';
import { Person } from '../../model/person';

const express = require("express");
const router = express.Router();

// get all persons 
router.get('/' ,  async (req:Request , res: Response) => {
    try{
        let sql = `SELECT * FROM hw5_persons`;
        await condb.query(sql , (err : MysqlError , result: Person[]) => {
            if(err) throw err;
            return res.json(result);
        })
        
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
});

// create a person
router.post('/', async (req: Request, res: Response) => {
    try {
        const { p_name, p_categories, p_bio, p_birth_date, p_url }: Person = req.body;

        // Check if all required properties are present
        if (!p_name || !p_categories || !p_bio || !p_birth_date || !p_url) {
            return res.status(400).send('Missing required data');
        }

        // Insert data into the database using MySQL format
        const sql = `INSERT INTO hw5_persons(p_name, p_categories, p_bio, p_birth_date, p_url) VALUES (?, ?, ?, ?, ?)`;
        const values = [p_name, p_categories, p_bio, p_birth_date, p_url];
        await condb.query(sql, values, (err: any, result: any) => {
            if (err){
                console.log(err);
                throw err;
            }
            return res.json({
                msg: "Insert person success!"
            });
        });
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Something went wrong!');
    }
});

// update a person
router.put('/:p_id' , async (req:Request , res: Response) => {
    try {

        const { p_id } = req.params;

        if (!p_id) return res.status(400).send("Required p_id");

        const person = await queryAsync(
            "SELECT * FROM hw5_persons WHERE p_id = ?",
            [p_id]
        );

        if(person.length === 0) {
            return res.status(404).send("Person not found");
        }

        const update: Person = {...person[0] , ...req.body} 
        
        // Update data in the database
        const sql = `
            UPDATE hw5_persons 
            SET p_name = ?, p_categories = ?, p_bio = ?, p_birth_date = ?, p_url = ? 
            WHERE p_id = ?`;
        const values = [update.p_name, update.p_categories, update.p_bio, update.p_birth_date, update.p_url, p_id];
        
        await condb.query(sql, values, (err: MysqlError | null, result: any) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error updating person");
            }
            return res.json({
                msg: "Update person success!",
                affectedRows: result.affectedRows
            });
        });
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Something went wrong!');
    }
})

// get a person by id
router.get('/:p_id' , async (req:Request , res: Response) => {
    try{
        const { p_id } = req.params;
        if (!p_id) return res.status(400).send("Required p_id");
        let sql = `SELECT * FROM hw5_persons where p_id = ?`;
        await condb.query(sql ,[p_id],(err : any , result: Person[]) => {
            if(err) throw err;
            return res.json(result);
        })
        
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// delete a person by id
router.delete('/:p_id' , async (req:Request , res: Response) => {
    try{
        const { p_id } = req.params;
        if (!p_id) return res.status(400).send("Required p_id");
        let sql = `DELETE FROM hw5_persons where p_id = ?`;
        await condb.query(sql ,[p_id],(err : any , result: any) => {
            if(err) throw err;
            return res.json({
                msg: "Delete person success",
                affectedRows: result.affectedRows
            });
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// searching persons by params
router.get('/search', (req:Request , res: Response) => {
    try{

    }catch(err){

    }
})

export default router;