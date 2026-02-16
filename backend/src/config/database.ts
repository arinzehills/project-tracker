import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/project-tracker';
    await mongoose.connect(DB_URI);
    console.log('✓ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
