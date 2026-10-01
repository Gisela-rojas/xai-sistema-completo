from abc import ABC, abstractmethod
from typing import List
from domain.entities.estudiante import Estudiante


class EstudianteRepositoryPort(ABC):
    @abstractmethod
    def guardar_lote(self, estudiantes: List[Estudiante]) -> int:
        """Guarda una lista de estudiantes y devuelve cuántos se guardaron."""
        pass