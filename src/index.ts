import express , {Request , Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { routes } from './routers';
const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.json());

app.get('/' , (req: Request , res : Response) => {
    res.send("Hello World");
})

app.use('/movies' , routes.movieRouter)
app.use('/stars' , routes.starRouter)
app.use('/persons' , routes.personRouter)
app.use('/creators' , routes.creatorRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT  , () => {
    console.log(`Server is runing on port ${process.env.ENDPOINT}:${PORT}`)
})