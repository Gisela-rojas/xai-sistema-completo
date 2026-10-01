import { useState } from "react";
import { API } from "../api";

// HU-001: Cargar datos académicos y de asistencia (CSV/Excel)
const EXTENSIONES = [".csv", ".xlsx", ".xls"];

export default function CargarDatos() {
  const [archivo, setArchivo] = useState(null);
  const [msg, setMsg] = useState(null);
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    setMsg(null);
    if (!archivo) {
      setMsg({ tipo: "error", texto: "Selecciona un archivo primero." });
      return;
    }
    const nombre = archivo.name.toLowerCase();
    if (!EXTENSIONES.some((ext) => nombre.endsWith(ext))) {
      // Escenario 2: formato inválido
      setMsg({ tipo: "error", texto: "Formato no soportado. Usa un archivo CSV o Excel (.csv, .xlsx, .xls)." });
      return;
    }
    const datos = new FormData();
    datos.append("archivo", archivo);
    datos.append("file", archivo);
    setCargando(true);
    try {
      const res = await fetch(`${API}/estudiantes/cargar`, { method: "POST", body: datos });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detalle = typeof data.detail === "string" ? data.detail : "Revisa que el archivo tenga las columnas requeridas.";
        setMsg({ tipo: "error", texto: detalle });
      } else {
        // Escenario 1: carga exitosa
        setMsg({ tipo: "ok", texto: data.mensaje || "Datos cargados y guardados correctamente." });
      }
    } catch {
      setMsg({ tipo: "error", texto: "No hay conexión con el servidor. Revisa que el backend esté prendido." });
    }
    setCargando(false);
  };

  return (
    <>
      <h1>Cargar datos de estudiantes</h1>
      <p className="sub">Sube un archivo CSV o Excel con: género, asistencia, promedio académico, cursos desaprobados e inasistencias consecutivas.</p>
      <div className="panel">
        <div className="fila">
          <label className="campo" style={{ flex: 1 }}>Archivo
            <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setArchivo(e.target.files[0])} />
          </label>
          <button className="btn" onClick={cargar} disabled={cargando}>
            {cargando ? "Cargando..." : "Cargar datos"}
          </button>
        </div>
        {msg && <div className={`msg ${msg.tipo}`}>{msg.texto}</div>}
        <div className="msg info">Privacidad (HU-007): identifica a cada estudiante con un código, sin nombres ni DNI.</div>
      </div>
    </>
  );
}
