import { connectDB } from '../../DB/connection.js';
import categoriesRouter from './category/category.router.js';
import productRouter from './product/product.router.js';
import cors from 'cors';
export const initApp = (app,express) => {
    connectDB();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => {
        return res.status(200).json({message : 'Welcome to the E-commerce'});
    });
    app.use('/categories' , categoriesRouter);
    app.use('/products' , productRouter);
    app.use('*',(req,res) => {
        return res.status(404).json({message : 'Page Not found'});
    });

}