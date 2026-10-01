import { useState } from "react";
import { nivelDe } from "./Dashboard";

// HU-003: Factores que explican el riesgo, en lenguaje sencillo
export default function Explicacion({ estudiante, irADashboard }) {
  const [feedback, setFeedback] = useState(false);

  if (!estudiante) {
    return (
      <>
        <h1>Explicación del riesgo</h1>
        <div className="panel">
          <div className="msg info">Elige un estudiante en el Dashboard y presiona "Ver explicación".</div>
          <button className="btn" onClick={irADashboard}>Ir al dashboard</button>
        </div>
      </>
    );
  }

  const factores = estudiante.factores || []; // vendrá del modelo (SHAP)

  return (
    <>
      <h1>Explicación del riesgo</h1>
      <p className="sub">Estudiante {estudiante.id_estudiante}</p>
      <div className="panel">
        <p>Nivel de riesgo: <span className={`riesgo ${nivelDe(estudiante)}`}>
          {nivelDe(estudiante) === "pendiente" ? "Sin calcular" : nivelDe(estudiante)}
        </span></p>

        <h3>Factores que más influyen</h3>
        {factores.length === 0 ? (
          <div className="msg aviso">Los factores (entre 3 y 5) aparecerán cuando el modelo XAI esté conectado.</div>
        ) : (
          <ol>{factores.map((f, i) => <li key={i}>{f}</li>)}</ol>
        )}

        <h3>Datos del estudiante</h3>
        <ul>
          <li>Asistencia: {estudiante.asistencia}%</li>
          <li>Promedio académico: {estudiante.promedio_academico}</li>
          <li>Cursos desaprobados: {estudiante.cursos_desaprobados}</li>
          <li>Inasistencias seguidas: {estudiante.inasistencias_consecutivas}</li>
        </ul>

        {feedback ? (
          <div className="msg ok">Gracias. Marcaste esta explicación como no comprendida.</div>
        ) : (
          <button className="btn btn-sec" onClick={() => setFeedback(true)}>No entendí esta explicación</button>
        )}
      </div>
    </>
  );
}
