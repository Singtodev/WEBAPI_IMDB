import express , { Request , Response } from 'express';
import { condb, queryAsync } from '../../utils/condb';
import { MysqlError } from 'mysql';
import { Star } from '../../model/star';
import { Creator } from '../../model/creator';

const  router = express.Router();


// get all creators 
router.get('/' , async (req:Request , res: Response) => {
    try{
        let sql = `SELECT DISTINCT hw5_creators.p_id ,hw5_creators.c_id,hw5_persons.*
        FROM hw5_creators
        LEFT JOIN hw5_movies ON hw5_movies.m_id = hw5_creators.m_id
        LEFT JOIN hw5_persons ON hw5_persons.p_id = hw5_creators.p_id;`;
        await condb.query(sql , (err : MysqlError , result: Creator[]) => {
            if(err){
                return res.status(500).json({
                    msg: "Error get all" ,
                    code: err.code
                })
            }
            return res.json(result);
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
});

// create a creator
router.post('/' , async (req:Request , res: Response) => {
    try{
        
        const { m_id , p_id } = req.body;
        // Check if all required properties are present
        if (!m_id || !p_id) {
            return res.status(400).send('Missing required data');
        }
        const sql = `INSERT INTO hw5_creators(m_id,p_id) VALUES (?, ?)`;
        await condb.query(sql, [m_id , p_id], (err: any, result: any) => {
            if (err){
                return res.status(500).json({
                    msg: "Insert creator error" ,
                    code: err.code
                })
            }
           return res.json({
                msg: "Insert creator success!"
            });
        });

    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// update a creator
router.put('/:c_id' , async (req:Request , res: Response) => {
    const { c_id } = req.params;
    if (!c_id) return res.status(400).send("Required c_id");

    const star = await queryAsync(
        "SELECT * FROM hw5_creators WHERE c_id = ?",
        [c_id]
    );

    if(star.length === 0) {
        return res.status(404).send("Creator not found");
    }

    const update: Creator = {...star[0] , ...req.body} 

    const sql = `UPDATE hw5_creators SET m_id = ?, p_id = ? where c_id = ?`;

    await condb.query(sql, [update.m_id, update.p_id, c_id], (err: MysqlError | null, result: any) => {
        if (err) {
            return res.status(500).json({
                msg: "Error updating creator" ,
                code: err.code
            })
        }
        return res.json({
            msg: "Update creator success!",
            affectedRows: result.affectedRows
        });
    });

})

// get a creator by id
router.get('/:c_id' , async (req:Request , res: Response) => {
    try{
        const { c_id } = req.params;
        if (!c_id) return res.status(400).send("Required c_id");
        let sql = `SELECT DISTINCT hw5_creators.p_id ,hw5_creators.c_id,hw5_persons.*
        FROM hw5_creators
        LEFT JOIN hw5_movies ON hw5_movies.m_id = hw5_creators.m_id
        LEFT JOIN hw5_persons ON hw5_persons.p_id = hw5_creators.p_id WHERE c_id = ?`;
        await condb.query(sql ,[c_id],(err : any , result: Star[]) => {
            if(err){
                return res.status(500).json({
                    msg: "Get creator error" ,
                    code: err.code
                })
            }
            return res.json(result);
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// delete a creator by id
router.delete('/:c_id' , async (req:Request , res: Response) => {
    try{
        const { c_id } = req.params;
        if (!c_id) return res.status(400).send("Required c_id");
        let sql = `DELETE FROM hw5_creators where c_id = ?`;
        await condb.query(sql ,[c_id],(err : any , result: any) => {
            if(err) throw err;
            return res.json({
                msg: "Delete creator success",
                affectedRows: result.affectedRows
            });
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

export default router;