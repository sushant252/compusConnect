
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const password = process.env.ADMIN_PASSWORD;

        if (!process.env.MONGO_URI || !email || !password) {
            throw new Error("Required environment variables are missing");
        }

        if (password.length < 8) {
            throw new Error("Admin password must be at least 8 characters");
        }

        await mongoose.connect(process.env.MONGO_URI);

        // Hash the latest password from .env
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin if missing, otherwise update existing account
        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    name: "CampusConnect Admin",
                    email,
                    password: hashedPassword,
                    role: "admin"
                }
            },
            {
                upsert: true,
                returnDocument: "after",
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        console.log("Admin account created/updated successfully!");

    } catch (error) {
        console.error("Admin creation/update failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();
