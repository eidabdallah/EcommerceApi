import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./model/user.model.js";

export const connectDB = async () => {
     try {
          await mongoose.connect(process.env.DB);

          const adminExists = await userModel.findOne({ role: 'Admin' });
          if (!adminExists) {
               const adminPassword = bcrypt.hashSync(process.env.AdminPassword, parseInt(process.env.SALTROUND));
               const adminUser = new userModel({
                    userName: "Admin",
                    email: process.env.AdminEmail,
                    password: adminPassword,
                    phoneNumber: "0596247255",
                    role: "Admin",
                    status: "Active",
                    confirmEmail: true,
               });

               await adminUser.save();
          }
          console.log('MongoDB connected...');
     } catch (err) {
          console.error('Error connecting to MongoDB:', err);
     }
};
