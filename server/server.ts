import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import studentRoutes from './routes/students.js';
import companyRoutes from './routes/companies.js';
import lecturerRoutes from './routes/lecturers.js';
import { User } from './models/User.js';
import { Internship } from './models/Internship.js';
import { FinalGrade } from './models/FinalGrade.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

async function seedDatabase() {
  try {
    const companyCount = await User.countDocuments({ role: 'company' });
    const studentCount = await User.countDocuments({ role: 'student' });
    const lecturerCount = await User.countDocuments({ role: 'lecturer' });
    
    console.log(`📊 Database stats: ${companyCount} companies, ${studentCount} students, ${lecturerCount} lecturers`);
    
    // Only seed if database is completely empty
    if (companyCount === 0 && studentCount === 0 && lecturerCount === 0) {
      console.log('🌱 Database is empty. Seeding initial data...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const techCorp = await User.create({
        name: 'TechCorp Solutions',
        email: 'hr@techcorp.com',
        password: hashedPassword,
        role: 'company'
      });

      const globalSystems = await User.create({
        name: 'Global Systems Inc',
        email: 'careers@globalsystems.com',
        password: hashedPassword,
        role: 'company'
      });

      const innovaDev = await User.create({
        name: 'InnovaDev',
        email: 'jobs@innovadev.io',
        password: hashedPassword,
        role: 'company'
      });

      await Internship.create([
        {
          company: techCorp._id,
          title: 'Frontend Developer Intern',
          description: 'Join our team to build modern web applications using React and Tailwind CSS. You will work closely with senior developers to implement new features and improve user experience.',
          requirements: 'Basic knowledge of HTML, CSS, JavaScript, and React. Familiarity with Git is a plus.',
          duration: '6 Months',
          status: 'open'
        },
        {
          company: techCorp._id,
          title: 'UI/UX Design Intern',
          description: 'Help us design intuitive and beautiful user interfaces. You will assist in creating wireframes, prototypes, and high-fidelity mockups.',
          requirements: 'Experience with Figma or Adobe XD. A portfolio of design projects.',
          duration: '3 Months',
          status: 'open'
        },
        {
          company: globalSystems._id,
          title: 'Backend Engineering Intern',
          description: 'Work on our core API services using Node.js and Express. You will learn about database design, API security, and scalable architecture.',
          requirements: 'Understanding of Node.js, REST APIs, and basic database concepts (SQL or NoSQL).',
          duration: '6 Months',
          status: 'open'
        },
        {
          company: innovaDev._id,
          title: 'Full Stack Developer Intern',
          description: 'Get hands-on experience across the entire stack. You will contribute to both frontend and backend development of our flagship product.',
          requirements: 'Knowledge of JavaScript/TypeScript, React, and Node.js. Eagerness to learn new technologies.',
          duration: '12 Months',
          status: 'open'
        }
      ]);
      
      // Add students
      const studentPassword = await bcrypt.hash('password123', 10);
      
      await User.create([
        {
          name: 'John Smith',
          email: 'john.smith@student.com',
          password: studentPassword,
          role: 'student'
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@student.com',
          password: studentPassword,
          role: 'student'
        },
        {
          name: 'Mike Wilson',
          email: 'mike.wilson@student.com',
          password: studentPassword,
          role: 'student'
        }
      ]);

      // Add lecturers
      const lecturerPassword = await bcrypt.hash('password123', 10);
      
      await User.create([
        {
          name: 'Dr. Emily Chen',
          email: 'emily.chen@lecturer.com',
          password: lecturerPassword,
          role: 'lecturer'
        },
        {
          name: 'Prof. James Brown',
          email: 'james.brown@lecturer.com',
          password: lecturerPassword,
          role: 'lecturer'
        }
      ]);
      
      console.log('✅ Database seeded with initial data.');
    } else {
      console.log('✅ Database already contains data. Skipping seeding.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Connect to MongoDB
  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️  MONGODB_URI not found in .env file');
    console.log('📝 Please add your MongoDB Atlas connection string to .env file:');
    console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
    console.log('💡 Using in-memory MongoDB for now...');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
  } else {
    console.log('🔗 Connecting to MongoDB Atlas...');
  }

  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');
    await seedDatabase();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    console.log('💡 Falling back to in-memory MongoDB...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const fallbackUri = mongoServer.getUri();
      await mongoose.connect(fallbackUri);
      console.log('✅ Connected to in-memory MongoDB');
      await seedDatabase();
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to in-memory MongoDB:', fallbackErr);
      process.exit(1);
    }
  }

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/lecturers', lecturerRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Enable CORS for client
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
