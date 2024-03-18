import express , { Request , Response } from 'express';
import { condb, queryAsync } from '../../utils/condb';
import { MysqlError } from 'mysql';
import { Movie } from '../../model/movie';


const  router = express.Router();


// get all movies 
router.get('/' ,  async (req:Request , res: Response) => {
    try {

        const { search } = req.query;
        const datasets: any[] = [];

        let moviesQuery = `SELECT * FROM hw5_movies`;
        const params: any[] = [];
    
        if (search) {
            moviesQuery += ` WHERE m_name LIKE ?`;
            params.push(`%${search}%`);
        }
    
        const movies: Movie[] = await queryAsync(moviesQuery, params);
        
        if (movies.length === 0) {
            return res.send("No movies found!");
        }
    
        for (const movie of movies) {
            const creatorsQuery = `
                SELECT hw5_creators.c_id, hw5_persons.*
                FROM hw5_creators
                LEFT JOIN hw5_persons ON hw5_creators.p_id = hw5_persons.p_id
                WHERE hw5_creators.m_id = ?
            `;
            const creators = await queryAsync(creatorsQuery , [movie.m_id]);

            const starsQuery = `
                SELECT hw5_stars.s_id, hw5_persons.*
                FROM hw5_stars
                LEFT JOIN hw5_persons ON hw5_stars.p_id = hw5_persons.p_id
                WHERE hw5_stars.m_id = ?
            `;
            
            const stars = await queryAsync(starsQuery , [movie.m_id]);
    
            datasets.push({
                ...movie,
                creators,
                stars
            });
        }
    
        return res.json(datasets);

    } catch (err) {
        return res.status(500).send('Something went wrong!');
    }
});

// create a movie
router.post('/' , async (req:Request , res: Response) => {
    try{
        const { m_name , m_rate_tv , m_duration_time , m_categories , m_poster } : Movie = req.body;
        // Check if all required properties are present
        if (!m_name || !m_rate_tv  || !m_duration_time || !m_categories || !m_poster) {
            return res.status(400).send('Missing required data');
        }

        // Insert data into the database using MySQL format
        const sql = `INSERT INTO hw5_movies(m_name,m_rate_tv, m_duration_time, m_categories, m_poster) VALUES (?, ?, ?, ?, ?)`;
        const values = [m_name, m_rate_tv, m_duration_time, m_categories, m_poster];
        await condb.query(sql, values, (err: any, result: any) => {
            if (err){
                console.log(err);
                throw err;
            }
           return res.json({
                msg: "Insert movie success!"
            });
        });

    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// update a moive
router.put('/:m_id' , async (req:Request , res: Response) => {
    try{
        const { m_id } = req.params;
        if (!m_id) return res.status(400).send("Required m_id");

        const movie = await queryAsync(
            "SELECT * FROM hw5_movies WHERE m_id = ?",
            [m_id]
        );

        if(movie.length === 0) {
            return res.status(404).send("Movie not found");
        }

        const update: Movie = {...movie[0] , ...req.body} 

        const sql = `UPDATE hw5_movies SET m_rate_tv = ?, m_duration_time = ?, m_categories = ?, m_poster = ?, m_name = ? where m_id = ?`;
        const values = [update.m_rate_tv, update.m_duration_time, update.m_categories, update.m_poster, update.m_name , m_id];

        await condb.query(sql, values, (err: MysqlError | null, result: any) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error updating person");
            }
            return res.json({
                msg: "Update movie success!",
                affectedRows: result.affectedRows
            });
        });
        
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// get a movie by id
router.get('/:m_id' , async (req:Request , res: Response) => {
    try{
        const { m_id } = req.params;
        if (!m_id) return res.status(400).send("Required m_id");


        let moviesQuery = `SELECT * FROM hw5_movies where m_id = ?`;
        const datasets: any[] = [];
        const params: any[] = [m_id];
        const movies: Movie[] = await queryAsync(moviesQuery, params);
        
        if (movies.length === 0) {
            return res.send("No movies found!");
        }
    
        for (const movie of movies) {
            const creatorsQuery = `
                SELECT hw5_creators.c_id, hw5_persons.*
                FROM hw5_creators
                LEFT JOIN hw5_persons ON hw5_creators.p_id = hw5_persons.p_id
                WHERE hw5_creators.m_id = ?
            `;
            const creators = await queryAsync(creatorsQuery , [movie.m_id]);

            const starsQuery = `
            SELECT hw5_stars.s_id, hw5_persons.*
            FROM hw5_stars
            LEFT JOIN hw5_persons ON hw5_stars.p_id = hw5_persons.p_id
            WHERE hw5_stars.m_id = ?
            `;
            const stars = await queryAsync(starsQuery , [movie.m_id]);
    
            datasets.push({
                ...movie,
                creators,
                stars
            });
        }
    
        return res.json(datasets);
    
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

// delete a movie by id
router.delete('/:m_id' , async (req:Request , res: Response) => {
    try{
        const { m_id } = req.params;
        if (!m_id) return res.status(400).send("Required m_id");
        let sql = `DELETE FROM hw5_movies where m_id = ?`;
        await condb.query(sql ,[m_id],(err : any , result: any) => {
            if(err) throw err;
            return res.json({
                msg: "Delete movie success",
                affectedRows: result.affectedRows
            });
        })
    }catch(err){
        return res.status(500).send('Something went wrong!')
    }
})

export default router;