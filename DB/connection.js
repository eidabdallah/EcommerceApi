import mongoose from "mongoose";

export const connectDB = async () => {
     mongoose.connect(process.env.DB)
          .then(() => {
               console.log('MongoDB connected...');
          }).catch(err => {
               console.error('Error connecting to MongoDB:', err);
          });
};