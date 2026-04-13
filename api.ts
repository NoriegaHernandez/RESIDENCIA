// src/lib/api.ts
// Reemplaza el cliente de Supabase — apunta a tu servidor Express local

const BASE_URL = "http://localhost:3000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// ─────────────────────────────────────────────
// FLOOR PLANS
// ─────────────────────────────────────────────

export const floorPlansApi = {
  getAll: () => request<FloorPlan[]>("/floor_plans"),

  create: (name: string, image_url: string) =>
    request<FloorPlan>("/floor_plans", {
      method: "POST",
      body: JSON.stringify({ name, image_url }),
    }),

  delete: (id: string) =>
    request(`/floor_plans/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────
// PRINTERS
// ─────────────────────────────────────────────

export const printersApi = {
  getByFloorPlan: (floor_plan_id: string) =>
    request<Printer[]>(`/printers?floor_plan_id=${floor_plan_id}`),

  create: (data: Partial<Printer>) =>
    request<Printer>("/printers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Printer>) =>
    request<Printer>(`/printers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/printers/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────
// COMPUTERS
// ─────────────────────────────────────────────

export const computersApi = {
  getByFloorPlan: (floor_plan_id: string) =>
    request<Computer[]>(`/computers?floor_plan_id=${floor_plan_id}`),

  create: (data: Partial<Computer>) =>
    request<Computer>("/computers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Computer>) =>
    request<Computer>(`/computers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/computers/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────
// TVS
// ─────────────────────────────────────────────

export const tvsApi = {
  getByFloorPlan: (floor_plan_id: string) =>
    request<TV[]>(`/tvs?floor_plan_id=${floor_plan_id}`),

  create: (data: Partial<TV>) =>
    request<TV>("/tvs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<TV>) =>
    request<TV>(`/tvs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/tvs/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────

export const inventoryApi = {
  getAll: () => request<InventoryDevice[]>("/inventory"),

  create: (data: Partial<InventoryDevice>) =>
    request<InventoryDevice>("/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<InventoryDevice>) =>
    request<InventoryDevice>(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/inventory/${id}`, { method: "DELETE" }),
};

// ─────────────────────────────────────────────
// TIPOS (copiados de lib/supabase.ts y hooks)
// ─────────────────────────────────────────────

export interface FloorPlan {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Printer {
  id: string;
  floor_plan_id: string;
  name: string;
  model: string;
  toner: string;
  status: string;
  x_position: number;
  y_position: number;
  created_at: string;
  updated_at: string;
}

export interface Computer {
  id: string;
  floor_plan_id: string;
  name: string;
  model: string;
  type: string;
  os: string;
  status: string;
  hostname: string;
  username: string;
  ip: string;
  x_position: number;
  y_position: number;
  created_at: string;
  updated_at: string;
}

export interface TV {
  id: string;
  floor_plan_id: string;
  name: string;
  model: string;
  size: string;
  type: string;
  status: string;
  x_position: number;
  y_position: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryDevice {
  id: string;
  tag: string;
  employee_number: string;
  user_name: string;
  hostname: string;
  type: string;
  brand: string;
  model: string;
  os_series: string;
  cpu: string;
  ram: string;
  ssd: string;
  req_no: string;
  supplier: string;
  plant_use: string;
  business_unit: string;
  department: string;
  area: string;
  status: string;
  comments: string;
  registration_date: string;
  created_at: string;
  updated_at: string;
}
