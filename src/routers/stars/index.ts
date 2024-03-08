import express , { Request , Response } from 'express';
import { condb, queryAsync } from '../../utils/condb';
import { MysqlError } from 'mysql';
import { Star } from '../../model/star';

const  router = express.Router();


// get all stars 
router.get('/' , async (req:Request , res: Response) => {
    try{
        let sql = `SELECT DISTINCT hw5_stars.p_id,hw5_stars.s_id,hw5_persons.*
        FROM hw5_stars
        LEFT JOIN hw5_movies ON hw5_movies.m_id = hw5_stars.m_id
        LEFT JOIN hw5_persons ON hw5_persons.p_id = hw5_stars.p_id;`;
        await condb.query(sql , (err : MysqlError , result: any) => {
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

// create a star
router.post('/' , async (req:Request , res: Response) => {
    try{
        
        const { m_id , p_id } = req.body;
        // Check if all required properties are present
        if (!m_id || !p_id) {
            return res.status(400).send('Missing required data');
        }
        const sql = `INSERT INTO hw5_stars(m_id,p_id) VALUES (?, ?)`;
        await condb.query(sql, [m_id , p_id], (err: any, result: any) => {
            if (err){
                return res.status(500).json({
                    msg: "Insert star error" ,
                    code: err.code
                })
            }
           return res.json({
                msg: "Insert star success!"
            });
        });

    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// update a star
router.put('/:s_id' , async (req:Request , res: Response) => {
    const { s_id } = req.params;
    if (!s_id) return res.status(400).send("Required s_id");

    const star = await queryAsync(
        "SELECT * FROM hw5_stars WHERE s_id = ?",
        [s_id]
    );

    if(star.length === 0) {
        return res.status(404).send("Star not found");
    }

    const update: Star = {...star[0] , ...req.body} 

    const sql = `UPDATE hw5_stars SET m_id = ?, p_id = ? where s_id = ?`;

    await condb.query(sql, [update.m_id, update.p_id, s_id], (err: MysqlError | null, result: any) => {
        if (err) {
            return res.status(500).json({
                msg: "Error updating star" ,
                code: err.code
            })
        }
        return res.json({
            msg: "Update stars success!",
            affectedRows: result.affectedRows
        });
    });

})

// get a star by id
router.get('/:s_id' , async (req:Request , res: Response) => {
    try{
        const { s_id } = req.params;
        if (!s_id) return res.status(400).send("Required s_id");
        let sql = `SELECT DISTINCT hw5_stars.p_id, hw5_stars.s_id, hw5_persons.*
        FROM hw5_stars
        LEFT JOIN hw5_movies ON hw5_movies.m_id = hw5_stars.m_id
        LEFT JOIN hw5_persons ON hw5_persons.p_id = hw5_stars.p_id WHERE s_id = ?`;
        await condb.query(sql ,[s_id],(err : any , result: Star[]) => {
            if(err){
                return res.status(500).json({
                    msg: "Get star error" ,
                    code: err.code
                })
            }
            return res.json(result);
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// delete a stars by id
router.delete('/:s_id' , async (req:Request , res: Response) => {
    try{
        const { s_id } = req.params;
        if (!s_id) return res.status(400).send("Required s_id");
        let sql = `DELETE FROM hw5_stars where s_id = ?`;
        await condb.query(sql ,[s_id],(err : any , result: any) => {
            if(err) throw err;
            return res.json({
                msg: "Delete star success",
                affectedRows: result.affectedRows
            });
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})


export default router;