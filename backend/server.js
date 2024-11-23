const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/bookRoutes'); // Ensure this matches your file structure


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true  // Allow frontend origin
  }));
app.use(express.json());

// Define a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Book Service');
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // Book routes


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
