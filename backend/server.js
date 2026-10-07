import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.route.js';
import userRoutes from './routes/users.route.js'

const localEnvironmentPath = path.resolve(process.cwd(), '.env');
const parentEnvironmentPath = path.resolve(process.cwd(), '../.env');
const environmentPath = process.env.DOTENV_CONFIG_PATH ||
    (fs.existsSync(localEnvironmentPath) ? localEnvironmentPath : parentEnvironmentPath);
dotenv.config({path: environmentPath});

if (!process.env.MONGO_URL && fs.existsSync(environmentPath)) {
    const rawEnvironment = fs.readFileSync(environmentPath, 'utf8').trim();
    if (rawEnvironment.startsWith('mongodb://') || rawEnvironment.startsWith('mongodb+srv://')) {
        process.env.MONGO_URL = rawEnvironment;
    }
}

const app=express();
const port = Number(process.env.PORT || 9090);
const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'uploads');
fs.mkdirSync(uploadsDirectory, {recursive: true});

app.use(cors({origin: process.env.FRONTEND_URL?.split(',').map((url) => url.trim()).filter(Boolean) || true}));
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static(uploadsDirectory))

const start=async()=>{
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_DB_URI;
    if (!mongoUrl) {
        throw new Error("MONGO_URL (or legacy MONGO_DB_URI) is required. Add it to backend/.env or configure it in the deployment environment.");
    }

    await mongoose.connect(mongoUrl);
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
}

start().catch((error) => {
    console.error("Unable to start backend:", error.message);
    process.exitCode = 1;
});