import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import studentRoutes from './routes/students.js';
import companyRoutes from './routes/companies.js';
import lecturerRoutes from './routes/lecturers.js';
import { User } from './models/User.js';
import { Internship } from './models/Internship.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function seedDatabase() {
  try {
    const companyCount = await User.countDocuments({ role: 'company' });
    if (companyCount === 0) {
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
      console.log('Database seeded with dummy internships.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Connect to MongoDB
  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('Starting in-memory MongoDB...');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    await seedDatabase();
  } catch (err) {
    console.error('MongoDB connection error:', err);
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
