// Dirección del backend (FastAPI)
export const API = "http://127.0.0.1:8000";

// Trae la lista de estudiantes del backend
export async function obtenerEstudiantes() {
  const res = await fetch(`${API}/estudiantes`);
  if (!res.ok) throw new Error("No se pudo obtener la lista de estudiantes.");
  const data = await res.json();
  return Array.isArray(data) ? data : data.estudiantes || [];
}
