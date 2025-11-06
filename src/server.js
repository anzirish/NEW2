import { configDotenv } from "dotenv";
import express from "express"
import { authRouter } from "./routes/authRouter.js";
import { ticketRouter } from "./routes/ticketRouter.js";
import { adminRouter } from "./routes/adminRouter";

configDotenv();
connectToDb();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Server is running!!!' });
});

app.use((req, res) => res.status(404).json({ error: 'Invalid route' }));

app.use((err, req, res, next) => {
  console.error('[Error] ', err.message);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || 'Something went wrong with the server' });
});

if (!port) {
  console.error('PORT not defined in .env');
  process.exit(1);
}

app.listen(port, () => console.log(`server running on port : port`));