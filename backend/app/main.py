from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
import app.models

from app.routers.auth import router as auth_router
from app.routers.vehicles import router as vehicle_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Dealership Inventory System")

# ✅ CORS FIXED
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROUTERS
app.include_router(auth_router)
app.include_router(vehicle_router)

@app.get("/")
def home():
    return {"message": "API Running 🚀"}