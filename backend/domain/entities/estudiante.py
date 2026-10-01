from dataclasses import dataclass

@dataclass
class Estudiante:
    id_estudiante: int
    genero: str
    asistencia: float
    promedio_academico: float
    cursos_desaprobados: int
    inasistencias_consecutivas: int
    rendimiento_academico: str