import subCategoryModel from '../../../DB/model/subCategory.model.js';
import cloudinary from './../../utils/cloudinary.js';
import slugify from 'slugify';
import categoryModel from './../../../DB/model/category.model.js';
export const createSubCategory = async (req, res, next) => {
    const {categoryId} = req.body;
    if (!categoryId)
        return res.status(400).json({ message: 'Category ID is required.' });
    const category = await categoryModel.findById(categoryId);
    if (!category)
        return res.status(404).json({ message: 'Category not found.' });

    const name = req.body.name.toLowerCase();
    if (await subCategoryModel.findOne({ name })) {
        return res.status(409).json({ message: 'Category already exists' });
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APPNAME}/subcategories`
    });
    const subcategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        image: { secure_url, public_id },
        categoryId,
        createdBy: req.user._id,
        updatedBy: req.user._id
    });
    return res.status(201).json({ message: 'SubCategory created successfully', subcategory });
}

//for admin
export const getAllSubCategoriesByCategory = async (req, res, next) => {
    const {id} = req.params;
    const subcategories = await subCategoryModel.find({categoryId : id});
    if (subcategories.length > 0)
        return res.status(200).json({ message: 'All Subcategories for this Category retrieved successfully', subcategories });
    return res.status(404).json({ message: 'There are no sub categories for this category' });
}
// for user 
export const getAllSubCategoriesActiveByCategory = async (req, res, next) => {
    const {id} = req.params;
    const subcategories = await subCategoryModel.find({categoryId : id , status: 'Active'});
    if (subcategories.length > 0)
        return res.status(200).json({ message: 'All Subcategories for this Category retrieved successfully', subcategories });
    return res.status(404).json({ message: 'There are no sub categories for this category' });
}

export const getSubCategoryById = async (req, res, next) => {
    const subCategory = await subCategoryModel.findById(req.params.id).select('name image slug');
    if (!subCategory)
        return res.status(404).json({ message: 'SubCategory not found.' });
    return res.status(200).json({ message: 'SubCategory retrieved successfully', subCategory });
}

export const updateSubCategory = async (req, res, next) => {
    if (!(req.params.id))
        return res.status(400).json({ message: 'Sub Category ID is required.' });
    const subcategory = await subCategoryModel.findById(req.params.id);
    if (!subcategory)
        return res.status(404).json({ message: 'Sub Category not found.' });
    if (req.body.name) {
        if (await subCategoryModel.findOne({ name: req.body.name.toLowerCase() , _id:{$ne: req.params.id} })) {
            return res.status(409).json({ message: 'Sub Category Name already exists' });
        }
        subcategory.name = req.body.name.toLowerCase();
        subcategory.slug = slugify(req.body.name);
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/subcategories`
        });
        subcategory.image = { secure_url, public_id };
    }
    if (req.body.status)
        subcategory.status = req.body.status;

    subcategory.updatedBy = req.user._id;
    await subcategory.save();
    return res.status(200).json({ message: 'Sub Category updated successfully', subcategory });

}

export const deleteSubCategory = async (req, res, next) => {
    if (!(req.params.id))
        return res.status(400).json({ message: 'Sub Category ID is required.' });
    const subcategory = await subCategoryModel.findByIdAndDelete(req.params.id);
    if (!subcategory)
        return res.status(404).json({ message: 'Category not found.' });
    await cloudinary.uploader.destroy(subcategory.image.public_id);
    return res.status(200).json({ message: 'Category deleted successfully' });
}