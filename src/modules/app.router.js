import { connectDB } from '../../DB/connection.js';
import categoriesRouter from './category/category.router.js';
import subcategoriesRouter from './subCategory/subCategory.router.js';
import productRouter from './product/product.router.js';
import authRouter from './auth/auth.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import couponRouter from './coupon/coupon.router.js';

import cors from 'cors';
export const initApp = (app,express) => {
    connectDB();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => {
        return res.status(200).json({message : 'Welcome to the E-commerce'});
    });
    app.use('/auth' , authRouter)
    app.use('/categories' , categoriesRouter);
    app.use('/subCategories' , subcategoriesRouter);
    app.use('/products' , productRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/coupon', couponRouter);


    app.use('*',(req,res) => {
        return res.status(404).json({message : 'Page Not found'});
    });

}