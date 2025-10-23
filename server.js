import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import webRouter from './src/routes/web.js';
import { connectToDb } from './src/persistence/db.js';

dotenv.config();
console.log("ENV MONGODB_URI =", process.env.MONGODB_URI);
try {
  const u = (process.env.MONGODB_URI || "").split("//")[1].split("@")[0];
  console.log("→ Parsed user =", u.split(":")[0]);
} catch {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Handlebars without a default layout
app.engine('hbs', engine({ extname: '.hbs', layoutsDir: false, defaultLayout: false }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static + form parsing
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', webRouter);

// Start after DB connects
const PORT = process.env.PORT || 3000;
connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
