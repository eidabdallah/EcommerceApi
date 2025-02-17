import slugify from 'slugify';
import categoryModel from './../../../DB/model/category.model.js';
import subCategoryModel from './../../../DB/model/subCategory.model.js';
import cloudinary from './../../utils/cloudinary.js';
import productModel from '../../../DB/model/product.model.js';
import { pagination } from '../../utils/pagination.js';
import { request } from 'express';

export const createProduct = async (req, res, next) => {
    const { name, price, description, categoryId, discount, subcategoryId, stock } = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory)
        return res.status(404).json({ message: 'Category not found' });
    const checkSubCategory = await subCategoryModel.findOne({ _id: subcategoryId, categoryId });
    if (!checkSubCategory)
        return res.status(404).json({ message: 'Subcategory does not belong to the selected category' });

    const checkName = await productModel.findOne({ name });
    if (checkName)
        return res.status(409).json({ message: 'Product already exists' });



    req.body.slug = slugify(name);
    req.body.finalPrice = price - ((price * (discount || 0)) / 100);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,
        { folder: `${process.env.APPNAME}/product/${name}/mainImage` }
    );
    req.body.mainImage = { secure_url, public_id };
    req.body.subImages = [];
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { folder: `${process.env.APPNAME}/product/${name}/subImage` });
        req.body.subImages.push({ secure_url, public_id });
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const product = await productModel.create(req.body);
    return res.status(201).json({ message: 'Product created successfully', product });

}

export const getAllProducts = async (req, res, next) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    let queryObj = {...req.query};
    const excludeQuery = ['page', 'limit' , 'sort'];
    excludeQuery.map((ele) => delete queryObj[ele]);

    // filter : 
    // Converting query data into a string so that the operator ($) can also be included : 
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/gt|gte|lt|lte|eq|in|nin/g, match => `$${match}`);
    // convert to Object : 
    queryObj = JSON.parse(queryObj);
    const productQuery = productModel.find(queryObj).skip(skip).limit(limit);
    const count = await productModel.estimatedDocumentCount();
    const products = await productQuery.sort(req.query.sort); 
    return res.status(200).json({ message: 'All products retrieved successfully', count ,  products });
}

export const getProductById = async (req, res, next) => {
    const product = await productModel.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'userId', select: 'userName -_id' }
    });
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product retrieved successfully', product });
}

