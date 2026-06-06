const express = require('express');
const cors = require('cors');
const disasterRoutes = require('./src/routes/disasters.js');
const volunteersRoutes = require('./src/routes/volunteers.js');
const resourcesRoutes = require('./src/routes/resources.js');
const tasksRoutes = require('./src/routes/tasks.js');
const authRoutes = require('./src/routes/auth');
const gisRoutes = require('./src/routes/gis');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mount disaster routes
app.use('/api/disasters', disasterRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gis', gisRoutes);


//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(process.env.PORT || 3000, "0.0.0.0");
