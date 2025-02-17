import categoryModel from './../../../DB/model/category.model.js';
import cloudinary from './../../utils/cloudinary.js';
import slugify from 'slugify';
import { AppError } from './../../utils/AppError.js';
export const createCategory = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return next(new AppError('Category already exists', 409));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APPNAME}/category`
    });
    const category = await categoryModel.create({
        name,
        slug: slugify(name),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        updatedBy: req.user._id
    });
    return res.status(201).json({ message: 'Category created successfully', category });
}

//for admin
export const getAllCategories = async (req, res, next) => {
    const categories = await categoryModel.find({}).populate([
        { path: "createdBy", select: "userName" },
        { path: "updatedBy", select: "userName" },
        { path: "subCategories" }
    ]);
    if (categories.length > 0)
        return res.status(200).json({ message: 'All categories retrieved successfully', categories });
    return next(new AppError('There are no categories.', 404));
}
// for user 
export const getAllCategoriesActive = async (req, res, next) => {
    const categories = await categoryModel.find({ status: 'Active' }).select('name image');
    if (categories.length > 0)
        return res.status(200).json({ message: 'All categories retrieved successfully', categories });
    return next(new AppError('There are no categories.', 404));
}

export const getCategoryById = async (req, res, next) => {
    const category = await categoryModel.findById(req.params.id).select('name image slug');
    if (!category)
        return next(new AppError('Category not found.', 404));
    return res.status(200).json({ message: 'Category retrieved successfully', category });
}

export const updateCategory = async (req, res, next) => {
    const category = await categoryModel.findById(req.params.id);
    if (!category)
        return next(new AppError('Category not found.', 404));
    if (req.body.name) {
        if (await categoryModel.findOne({ name: req.body.name.toLowerCase(), _id: { $ne: req.params.id } })) {
            return next(new AppError('Category Name already exists', 409));
        }
        category.name = req.body.name.toLowerCase();
        category.slug = slugify(req.body.name);
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/category`
        });
        category.image = { secure_url, public_id };
    }
    if (req.body.status)
        category.status = req.body.status;

    category.updatedBy = req.user._id;
    await category.save();
    return res.status(200).json({ message: 'Category updated successfully', category });

}

export const deleteCategory = async (req, res, next) => {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category)
        return next(new AppError('Category not found.', 404));
    await cloudinary.uploader.destroy(category.image.public_id);
    return res.status(200).json({ message: 'Category deleted successfully' });

}