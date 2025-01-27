import multer from 'multer';
export const fileMimeTypes = {
    image : [ 'image/png', 'image/jpeg', 'image/gif', 'image/ico', 'image/svg+xml'],
    pdf : ['application/pdf']
}
export function fileUpload(customTypes = []){
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
        if(customTypes.includes(file.mimetype)) {
            cb(null, true);
        }else{
            cb("invalid format" , false);
        }
    }
    const upload = multer({ fileFilter , storage });
    return upload;
}
