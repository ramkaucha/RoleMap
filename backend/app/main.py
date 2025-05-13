from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import analytic, applications, auths, users

models.Base.metadata.create_all(bind=engine)

VERSION = "1.0.0"

app = FastAPI(
    title="Application Tracker API",
    description="API for RoleMap",
    version=VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auths.router)
app.include_router(users.router)
app.include_router(applications.router)
app.include_router(analytic.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to RoleMap's API",
        "version": VERSION,
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
