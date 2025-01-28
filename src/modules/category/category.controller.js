import categoryModel from './../../../DB/model/category.model.js';
import cloudinary from './../../utils/cloudinary.js';
import slugify from 'slugify';
export const createCategory = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return res.status(409).json({ message: 'Category already exists' });
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `ecommerce/category`
    });

    const category = await categoryModel.create({
        name,
        slug: slugify(name),
        image: { secure_url, public_id },
    });
    return res.status(201).json({ message: 'Category created successfully', category });
}

//for admin
export const getAllCategories = async (req, res, next) => {
    const categories = await categoryModel.find({});
    if (categories.length > 0)
        return res.status(200).json({ message: 'All categories retrieved successfully', categories });
    return res.status(404).json({ message: 'There are no categories.' });
}
// for user 
export const getAllCategoriesActive = async (req, res, next) => {
    const categories = await categoryModel.find({ status: 'Active' }).select('name image');
    if (categories.length > 0)
        return res.status(200).json({ message: 'All categories retrieved successfully', categories });
    return res.status(404).json({ message: 'There are no categories.' });
}

export const getCategoryById = async (req, res, next) => {
    const category = await categoryModel.findById(req.params.id).select('name image slug');
    if (!category)
        return res.status(404).json({ message: 'Category not found.' });
    return res.status(200).json({ message: 'Category retrieved successfully', category });
}

export const updateCategory = async (req, res, next) => {
    if (!(req.params.id))
        return res.status(400).json({ message: 'Category ID is required.' });
    const category = await categoryModel.findById(req.params.id);
    if (!category)
        return res.status(404).json({ message: 'Category not found.' });
    if (req.body.name) {
        if (await categoryModel.findOne({ name: req.body.name.toLowerCase() , _id:{$ne: req.params.id} })) {
            return res.status(409).json({ message: 'Category Name already exists' });
        }
        category.name = req.body.name.toLowerCase();
        category.slug = slugify(req.body.name);
    }

    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `ecommerce/category`
        });
        category.image = { secure_url, public_id };
    }
    if (req.body.status)
        category.status = req.body.status;
    await category.save();
    return res.status(200).json({ message: 'Category updated successfully', category });

}

export const deleteCategory = async (req, res, next) => {
    if (!(req.params.id))
        return res.status(400).json({ message: 'Category ID is required.' });
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category)
        return res.status(404).json({ message: 'Category not found.' });
    await cloudinary.uploader.destroy(category.image.public_id);
    return res.status(200).json({ message: 'Category deleted successfully' });
 
}