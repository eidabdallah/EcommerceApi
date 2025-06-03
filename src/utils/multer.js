import multer from 'multer';
import { AppError } from './AppError.js';
export const fileMimeTypes = {
    image: ['image/png', 'image/jpeg', 'image/gif', 'image/ico', 'image/svg+xml' , 'image/avif'],
    pdf: ['application/pdf'],
    excel : ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}
export function fileUpload(customTypes = []) {
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
        if (customTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError("Invalid file format", 400), false);
        }
    }
    const upload = multer({ fileFilter, storage });
    return upload;
}
