from fastapi import FastAPI
from . import models, crud, schemas
from .database import engine
from .routes import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
]
models.Base.metadata.create_all(bind=engine)


# >:( why cors always so mad!


app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
