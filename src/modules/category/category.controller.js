import categoryModel from './../../../DB/model/category.model.js';
import cloudinary from './../../utils/cloudinary.js';
import slugify from 'slugify';
export const createCategory = async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({ name })) {
        return res.status(409).json({ message: 'Category already exists' });
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {
        folder : `ecommerce/category/${name}`
    });

    const category = await categoryModel.create({
        name,
        slug: slugify(name),
        image: { secure_url, public_id },
    });
    return res.status(201).json({ message: 'Category created successfully' , category });
}