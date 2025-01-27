export const allCategories = (req , res , next) =>{
    res.status(200).json({ message: 'All categories retrieved successfully' });
}