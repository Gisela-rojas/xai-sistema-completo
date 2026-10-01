from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from infrastructure.db import get_db, engine, Base
from infrastructure.adapters.output.estudiante_repository_postgres import EstudianteRepositoryPostgres
from infrastructure.adapters.output.usuario_repository_postgres import UsuarioRepositoryPostgres
from application.useCases.cargar_datos_estudiantes import CargarDatosEstudiantesUseCase
from application.useCases.registrar_usuario import RegistrarUsuarioUseCase
from application.useCases.login_usuario import LoginUsuarioUseCase

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegistroRequest(BaseModel):
    nombre: str
    correo: str
    clave: str


class LoginRequest(BaseModel):
    correo: str
    clave: str


@app.post("/estudiantes/cargar")
def cargar_estudiantes(archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    repositorio = EstudianteRepositoryPostgres(db)
    caso_de_uso = CargarDatosEstudiantesUseCase(repositorio)
    return caso_de_uso.ejecutar(archivo)


@app.get("/estudiantes")
def listar_estudiantes(db: Session = Depends(get_db)):
    repositorio = EstudianteRepositoryPostgres(db)
    return repositorio.listar_todos()


@app.post("/usuarios/registrar")
def registrar_usuario(datos: RegistroRequest, db: Session = Depends(get_db)):
    repositorio = UsuarioRepositoryPostgres(db)
    caso_de_uso = RegistrarUsuarioUseCase(repositorio)
    return caso_de_uso.ejecutar(datos.nombre, datos.correo, datos.clave)


@app.post("/usuarios/login")
def login_usuario(datos: LoginRequest, db: Session = Depends(get_db)):
    repositorio = UsuarioRepositoryPostgres(db)
    caso_de_uso = LoginUsuarioUseCase(repositorio)
    return caso_de_uso.ejecutar(datos.correo, datos.clave)


@app.get("/")
def inicio():
    return {"mensaje": "API Sistema XAI funcionando"}