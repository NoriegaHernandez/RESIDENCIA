import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "7895123",
  database: "supabase_local",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.message);
  } else {
    console.log("✅ Conectado a PostgreSQL correctamente");
  }
});

// ─────────────────────────────────────────────
// FLOOR PLANS
// ─────────────────────────────────────────────

app.get("/floor_plans", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM floor_plans ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/floor_plans", async (req, res) => {
  try {
    const { name, image_url } = req.body;
    const result = await pool.query(
      "INSERT INTO floor_plans (name, image_url) VALUES ($1, $2) RETURNING *",
      [name, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/floor_plans/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM floor_plans WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// PRINTERS
// ─────────────────────────────────────────────

app.get("/printers", async (req, res) => {
  try {
    const { floor_plan_id } = req.query;
    const result = await pool.query(
      "SELECT * FROM printers WHERE floor_plan_id = $1 ORDER BY created_at ASC",
      [floor_plan_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/printers", async (req, res) => {
  try {
    const { floor_plan_id, name, model, toner, status, x_position, y_position } = req.body;
    const result = await pool.query(
      `INSERT INTO printers (floor_plan_id, name, model, toner, status, x_position, y_position)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [floor_plan_id, name || "New Printer", model || "", toner || "Full", status || "Online", x_position, y_position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/printers/:id", async (req, res) => {
  try {
    const { name, model, toner, status, x_position, y_position } = req.body;
    const result = await pool.query(
      `UPDATE printers SET name=$1, model=$2, toner=$3, status=$4,
       x_position=$5, y_position=$6, updated_at=now()
       WHERE id=$7 RETURNING *`,
      [name, model, toner, status, x_position, y_position, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/printers/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM printers WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// COMPUTERS
// ─────────────────────────────────────────────

app.get("/computers", async (req, res) => {
  try {
    const { floor_plan_id } = req.query;
    const result = await pool.query(
      "SELECT * FROM computers WHERE floor_plan_id = $1 ORDER BY created_at ASC",
      [floor_plan_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/computers", async (req, res) => {
  try {
    const { floor_plan_id, name, model, type, os, status, hostname, username, ip, x_position, y_position } = req.body;
    const result = await pool.query(
      `INSERT INTO computers (floor_plan_id, name, model, type, os, status, hostname, username, ip, x_position, y_position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [floor_plan_id, name || "New Computer", model || "", type || "Desktop", os || "Windows",
       status || "Online", hostname || "", username || "", ip || "", x_position, y_position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/computers/:id", async (req, res) => {
  try {
    const { name, model, type, os, status, hostname, username, ip, x_position, y_position } = req.body;
    const result = await pool.query(
      `UPDATE computers SET name=$1, model=$2, type=$3, os=$4, status=$5,
       hostname=$6, username=$7, ip=$8, x_position=$9, y_position=$10, updated_at=now()
       WHERE id=$11 RETURNING *`,
      [name, model, type, os, status, hostname, username, ip, x_position, y_position, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/computers/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM computers WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// TVS
// ─────────────────────────────────────────────

app.get("/tvs", async (req, res) => {
  try {
    const { floor_plan_id } = req.query;
    const result = await pool.query(
      "SELECT * FROM tvs WHERE floor_plan_id = $1 ORDER BY created_at ASC",
      [floor_plan_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/tvs", async (req, res) => {
  try {
    const { floor_plan_id, name, model, size, type, status, x_position, y_position } = req.body;
    const result = await pool.query(
      `INSERT INTO tvs (floor_plan_id, name, model, size, type, status, x_position, y_position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [floor_plan_id, name || "New TV", model || "", size || '55"', type || "LED", status || "Online", x_position, y_position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/tvs/:id", async (req, res) => {
  try {
    const { name, model, size, type, status, x_position, y_position } = req.body;
    const result = await pool.query(
      `UPDATE tvs SET name=$1, model=$2, size=$3, type=$4, status=$5,
       x_position=$6, y_position=$7, updated_at=now()
       WHERE id=$8 RETURNING *`,
      [name, model, size, type, status, x_position, y_position, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tvs/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tvs WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────

app.get("/inventory", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory ORDER BY registration_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/inventory", async (req, res) => {
  try {
    const {
      tag, employee_number, user_name, hostname, type, brand, model,
      os_series, cpu, ram, ssd, req_no, supplier, plant_use,
      business_unit, department, area, status, comments, registration_date
    } = req.body;
    const result = await pool.query(
      `INSERT INTO inventory (tag, employee_number, user_name, hostname, type, brand, model,
        os_series, cpu, ram, ssd, req_no, supplier, plant_use,
        business_unit, department, area, status, comments, registration_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING *`,
      [tag, employee_number || "", user_name || "", hostname || "", type || "Computer",
       brand || "", model || "", os_series || "", cpu || "", ram || "", ssd || "",
       req_no || "", supplier || "", plant_use || "", business_unit || "",
       department || "", area || "", status || "Active", comments || "",
       registration_date || new Date().toISOString().split("T")[0]]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/inventory/:id", async (req, res) => {
  try {
    const {
      tag, employee_number, user_name, hostname, type, brand, model,
      os_series, cpu, ram, ssd, req_no, supplier, plant_use,
      business_unit, department, area, status, comments, registration_date
    } = req.body;
    const result = await pool.query(
      `UPDATE inventory SET tag=$1, employee_number=$2, user_name=$3, hostname=$4,
        type=$5, brand=$6, model=$7, os_series=$8, cpu=$9, ram=$10, ssd=$11,
        req_no=$12, supplier=$13, plant_use=$14, business_unit=$15,
        department=$16, area=$17, status=$18, comments=$19,
        registration_date=$20, updated_at=now()
       WHERE id=$21 RETURNING *`,
      [tag, employee_number, user_name, hostname, type, brand, model,
       os_series, cpu, ram, ssd, req_no, supplier, plant_use, business_unit,
       department, area, status, comments, registration_date, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/inventory/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM inventory WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
