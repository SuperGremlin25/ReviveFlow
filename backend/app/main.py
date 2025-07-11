from fastapi import FastAPI
from dotenv import load_dotenv
import os
from . import models, database
from .routes import router

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Backend running"}
