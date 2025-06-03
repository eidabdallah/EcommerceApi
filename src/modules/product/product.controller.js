import slugify from 'slugify';
import categoryModel from './../../../DB/model/category.model.js';
import subCategoryModel from './../../../DB/model/subCategory.model.js';
import cloudinary from './../../utils/cloudinary.js';
import productModel from '../../../DB/model/product.model.js';
import { pagination } from '../../utils/pagination.js';
import { AppError } from './../../utils/AppError.js';

export const createProduct = async (req, res, next) => {
    const { name, price, description, categoryId, discount, subcategoryId, stock } = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory)
        return next(new AppError('Category not found', 404));
    const checkSubCategory = await subCategoryModel.findOne({ _id: subcategoryId, categoryId });
    if (!checkSubCategory)
        return next(new AppError('Subcategory does not belong to the selected category', 404));

    const checkName = await productModel.findOne({ name });
    if (checkName)
        return next(new AppError('Product already exists', 409));

    req.body.slug = slugify(name);
    req.body.finalPrice = price - ((price * (discount || 0)) / 100);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,
        { folder: `${process.env.APPNAME}/product/${req.body.slug}/mainImage` }
    );
    req.body.mainImage = { secure_url, public_id };
    req.body.subImages = [];
    if (req.files.subImages) {
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.APPNAME}/product/${req.body.slug}/subImage` });
            req.body.subImages.push({ secure_url, public_id });
        }
    }
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const product = await productModel.create(req.body);
    return res.status(201).json({ message: 'Product created successfully', product });

}

export const getAllProducts = async (req, res, next) => {
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    let queryObj = { ...req.query };
    const excludeQuery = ['page', 'limit', 'sort', 'search', 'fields'];
    excludeQuery.map((ele) => delete queryObj[ele]);

    // filter : 
    // Converting query data into a string so that the operator ($) can also be included : 
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/gt|gte|lt|lte|eq|in|nin/g, match => `$${match}`);
    // convert to Object : 
    queryObj = JSON.parse(queryObj);

    const productQuery = productModel.find(queryObj).skip(skip).limit(limit);
    // search  :
    if (req.query.search) {
        productQuery.find({
            $or: [
                { name: { $regex: req.query.search } },
                { description: { $regex: req.query.search } },
            ]
        })
    }
    const count = await productModel.estimatedDocumentCount();
    if (req.query.fields)
        productQuery.select(req.query.fields);
    let products = await productQuery.sort(req.query.sort);
    products = products.map(product => {
        return {
            ...product.toObject(),
            subImages: product.subImages.map(subImage => subImage.secure_url),
            mainImage: product.mainImage.secure_url,
        }
    });
    return res.status(200).json({ message: 'All products retrieved successfully', count, products });
}

export const getProductById = async (req, res, next) => {
    let product = await productModel.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'userId', select: 'userName -_id' }
    });
    if (!product)
        return next(new AppError('Product not found', 404));

    product = {
        ...product.toObject(),
        subImages: product.subImages.map(subImage => subImage.secure_url),
        mainImage: product.mainImage.secure_url,
    };
    return res.status(200).json({ message: 'Product retrieved successfully', product });
}

export const deleteProduct = async (req, res, next) => {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product)
        return next(new AppError('Product not found', 404));

    await cloudinary.uploader.destroy(product.mainImage.public_id);
    if (product.subImages.length > 0) {
        for (const subImage of product.subImages) {
            await cloudinary.uploader.destroy(subImage.public_id);
        }
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
}

export const updateProduct = async (req, res, next) => {
    const { name, price, description, discount, categoryId, subcategoryId, stock } = req.body;

    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory) return next(new AppError('Category not found', 404));

    const checkSubCategory = subcategoryId ? await subCategoryModel.findOne({ _id: subcategoryId, categoryId }) : null;
    if (!checkSubCategory) return next(new AppError('Subcategory does not belong to the selected category', 404));

    const product = await productModel.findById(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));

    product.categoryId = categoryId;
    product.subcategoryId = subcategoryId;

    if (name) {
        name = name.trim();
        if (product.name.toLowerCase() !== name.toLowerCase() && await productModel.findOne({ name }))
            return next(new AppError('Product Name already exists', 409));
        product.name = name;
        product.slug = slugify(name);
    }

    if (price) product.price = price;
    if (discount) product.discount = discount;
    product.finalPrice = product.price - ((product.price * (product.discount || 0)) / 100);

    if (description) product.description = description;
    if (stock) product.stock = stock;

    if (req.files.mainImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path,
            { folder: `${process.env.APPNAME}/product/${product.slug}/mainImage` }
        );
        if (secure_url && public_id) {
            await cloudinary.uploader.destroy(product.mainImage.public_id);
            product.mainImage = { secure_url, public_id };
        }
    }

    if (req.files.subImages) {
        await Promise.all(product.subImages.map(subImage => cloudinary.uploader.destroy(subImage.public_id)));

        product.subImages = await Promise.all(req.files.subImages.map(async (file) => {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.APPNAME}/product/${product.slug}/subImage` }
            );
            return { secure_url, public_id };
        }));
    }

    product.updatedBy = req.user._id;
    await product.save();

    return res.status(200).json({ message: 'Product updated successfully', product });
}

export const getProductsByCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const { skip, limit } = pagination(req.query.page, req.query.limit);
    let queryObj = { ...req.query };
    const excludeQuery = ['page', 'limit', 'sort', 'search', 'fields'];
    excludeQuery.map((ele) => delete queryObj[ele]);

    // filter : 
    // Converting query data into a string so that the operator ($) can also be included : 
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/gt|gte|lt|lte|eq|in|nin/g, match => `$${match}`);
    // convert to Object : 
    queryObj = JSON.parse(queryObj);

    const productQuery = productModel.find({ categoryId, ...queryObj }).skip(skip).limit(limit);
    // search  :
    if (req.query.search) {
        productQuery.find({
            $or: [
                { name: { $regex: req.query.search } },
            ]
        })
    }
    const count = await productModel.countDocuments({ categoryId });
    if (req.query.fields)
        productQuery.select(req.query.fields);
    let products = await productQuery.sort(req.query.sort);
    products = products.map(product => {
        return {
            ...product.toObject(),
            subImages: product.subImages.map(subImage => subImage.secure_url),
            mainImage: product.mainImage.secure_url,
        }
    });
    return res.status(200).json({ message: 'All products retrieved successfully', count, products });

};
