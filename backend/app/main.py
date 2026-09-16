import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.category_router import router as category_router
from app.routers.product_router import router as product_router
from app.routers.payment_router import router as payment_router

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")


app = FastAPI(
    title="Nandhini Agency API",
    description="Backend API for Nandhini Agency",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(category_router)
app.include_router(product_router)
app.include_router(payment_router)


@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Nandhini Agency backend is running",
    }
@app.get("/api/payment/config-check")
def payment_config_check():
    return {
        "razorpay_key_loaded": bool(RAZORPAY_KEY_ID),
        "razorpay_secret_loaded": bool(RAZORPAY_KEY_SECRET),
    }