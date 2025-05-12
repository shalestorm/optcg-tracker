from fastapi import FastAPI
from . import models, crud, schemas
from .database import engine
from .routes import router


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(router)
