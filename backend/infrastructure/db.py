import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Numeric, TIMESTAMP
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class EstudianteModel(Base):
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True, index=True)
    id_estudiante = Column(Integer, nullable=False)
    genero = Column(String(1))
    asistencia = Column(Numeric(5, 2))
    promedio_academico = Column(Numeric(5, 2))
    cursos_desaprobados = Column(Integer)
    inasistencias_consecutivas = Column(Integer)
    rendimiento_academico = Column(String(20))
    cargado_en = Column(TIMESTAMP, server_default=func.now())


class UsuarioModel(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    clave = Column(String(255), nullable=False)
    creado_en = Column(TIMESTAMP, server_default=func.now())


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()