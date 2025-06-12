from fastapi import FastAPI
from .routes import upload, nft
from .middleware.security import setup_security
from .utils.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Setup security middleware
setup_security(app)

# Include routers
app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["upload"])
app.include_router(nft.router, prefix=settings.API_V1_STR, tags=["nft"])

@app.get("/")
async def root():
    return {"message": "Welcome to DreamLayer API"}