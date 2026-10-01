import { useEffect, useState } from "react";
import { obtenerEstudiantes } from "../api";

// HU-002 (puntaje), HU-004 (lista por nivel de riesgo), HU-005 (filtros)
const ORDEN = { alto: 3, medio: 2, bajo: 1 };

export function nivelDe(est) {
  // Cuando el modelo XAI esté conectado, el backend enviará "nivel_riesgo"
  return (est.nivel_riesgo || "").toLowerCase() || "pendiente";
}

export default function Dashboard({ onVerExplicacion }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [fRiesgo, setFRiesgo] = useState("todos");
  const [fGenero, setFGenero] = useState("todos");

  useEffect(() => {
    obtenerEstudiantes()
      .then(setEstudiantes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = estudiantes
    .filter((e) => fRiesgo === "todos" || nivelDe(e) === fRiesgo)
    .filter((e) => fGenero === "todos" || (e.genero || "").toUpperCase() === fGenero)
    .sort((a, b) => (ORDEN[nivelDe(b)] || 0) - (ORDEN[nivelDe(a)] || 0));

  const contar = (n) => estudiantes.filter((e) => nivelDe(e) === n).length;
  const hayPuntajes = estudiantes.some((e) => nivelDe(e) !== "pendiente");

  return (
    <>
      <h1>Dashboard de riesgo</h1>
      <p className="sub">Estudiantes ordenados de mayor a menor riesgo de abandono.</p>

      <div className="resumen">
        <div className="cuenta alto">Riesgo alto<b>{contar("alto")}</b></div>
        <div className="cuenta medio">Riesgo medio<b>{contar("medio")}</b></div>
        <div className="cuenta bajo">Riesgo bajo<b>{contar("bajo")}</b></div>
        <div className="cuenta">Total estudiantes<b>{estudiantes.length}</b></div>
      </div>

      <div className="panel">
        <div className="fila">
          <label className="campo">Nivel de riesgo
            <select value={fRiesgo} onChange={(e) => setFRiesgo(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
            </select>
          </label>
          <label className="campo">Género
            <select value={fGenero} onChange={(e) => setFGenero(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
            </select>
          </label>
          <label className="campo">Aula / grado
            <select disabled><option>Aún no está en los datos</option></select>
          </label>
        </div>

        {cargando && <div className="msg info">Cargando estudiantes...</div>}
        {error && <div className="msg error">{error}</div>}
        {!cargando && !error && estudiantes.length === 0 && (
          <div className="msg info">Todavía no hay estudiantes. Ve a "Cargar datos" para subir un archivo.</div>
        )}
        {!cargando && estudiantes.length > 0 && !hayPuntajes && (
          <div className="msg aviso">El puntaje de riesgo aparecerá cuando el modelo XAI esté conectado al backend.</div>
        )}
        {!cargando && hayPuntajes && contar("alto") === 0 && (
          <div className="msg ok">No hay casos de riesgo alto en el periodo actual.</div>
        )}
        {!cargando && estudiantes.length > 0 && filtrados.length === 0 && (
          <div className="msg info">No hay resultados para esos filtros.</div>
        )}

        {filtrados.length > 0 && (
          <div className="tabla-caja">
            <table>
              <thead>
                <tr>
                  <th>Código</th><th>Género</th><th>Asistencia</th><th>Promedio</th>
                  <th>Cursos desaprobados</th><th>Inasistencias seguidas</th><th>Riesgo</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id_estudiante}</td>
                    <td>{e.genero}</td>
                    <td>{e.asistencia}%</td>
                    <td>{e.promedio_academico}</td>
                    <td>{e.cursos_desaprobados}</td>
                    <td>{e.inasistencias_consecutivas}</td>
                    <td><span className={`riesgo ${nivelDe(e)}`}>{nivelDe(e) === "pendiente" ? "Sin calcular" : nivelDe(e)}</span></td>
                    <td><button className="btn btn-sec" onClick={() => onVerExplicacion(e)}>Ver explicación</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
