import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "7895123",
  database: "supabase_local",
  port: 5432
});

// 🔹 endpoint ejemplo
app.get("/computers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM computers");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});