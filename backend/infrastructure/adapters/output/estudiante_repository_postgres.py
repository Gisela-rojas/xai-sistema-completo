from typing import List
from domain.entities.estudiante import Estudiante
from domain.ports.estudiante_repository_port import EstudianteRepositoryPort
from infrastructure.db import EstudianteModel


class EstudianteRepositoryPostgres(EstudianteRepositoryPort):
    def __init__(self, db):
        self.db = db

    def guardar_lote(self, estudiantes: List[Estudiante]) -> int:
        contador = 0
        for e in estudiantes:
            modelo = EstudianteModel(
                id_estudiante=e.id_estudiante,
                genero=e.genero,
                asistencia=e.asistencia,
                promedio_academico=e.promedio_academico,
                cursos_desaprobados=e.cursos_desaprobados,
                inasistencias_consecutivas=e.inasistencias_consecutivas,
                rendimiento_academico=e.rendimiento_academico,
            )
            self.db.add(modelo)
            contador += 1
        self.db.commit()
        return contador

    def listar_todos(self):
        filas = self.db.query(EstudianteModel).all()
        return [
            {
                "id": f.id,
                "id_estudiante": f.id_estudiante,
                "genero": f.genero,
                "asistencia": float(f.asistencia),
                "promedio_academico": float(f.promedio_academico),
                "cursos_desaprobados": f.cursos_desaprobados,
                "inasistencias_consecutivas": f.inasistencias_consecutivas,
                "rendimiento_academico": f.rendimiento_academico,
            }
            for f in filas
        ]