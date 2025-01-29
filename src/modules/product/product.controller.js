import slugify from 'slugify';
import categoryModel from './../../../DB/model/category.model.js';
import subCategoryModel from './../../../DB/model/subCategory.model.js';
import cloudinary from './../../utils/cloudinary.js';
import productModel from '../../../DB/model/product.model.js';

export const createProduct = async (req, res, next) => {
    const { name, price, description, categoryId, discount, subcategoryId , stock} = req.body;
    const checkCategory = await categoryModel.findById(categoryId);
    if (!checkCategory)
        return res.status(404).json({ message: 'Category not found' });
    const checkSubCategory = await subCategoryModel.findOne({ _id: subcategoryId, categoryId });
    if (!checkSubCategory)
        return res.status(404).json({ message: 'Subcategory does not belong to the selected category' });

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
    res.status(201).json({ message: 'Product created successfully', product });

}

// export const getAllProducts = async (req, res, next) => {}

// export const getProductById = async (req, res, next) => {}

// export const updateProduct = async (req, res, next) => {}

// export const deleteProduct = async (req, res, next) => {}

// export const getAllProductsActive = async (req, res, next) => {}

// export const getAllProductsByCategory = async (req, res, next) => {}

// export const getAllProductsBySubCategory = async (req, res, next) => {}

// export const getProductsBySearch = async (req, res, next) => {}

// export const updateProductStock = async (req, res, next) => {}

// export const updateProductDiscount = async (req, res, next) => {}

// export const getAllProductsByPriceRange = async (req, res, next) => {}
