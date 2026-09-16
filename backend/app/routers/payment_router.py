import os
from datetime import datetime

import razorpay
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

load_dotenv()

router = APIRouter(
    prefix="/api/payment",
    tags=["Payment"],
)

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise RuntimeError("Razorpay API keys are not configured")

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)


class CreateOrderRequest(BaseModel):
    amount: float = Field(gt=0)


@router.post("/create-order")
def create_razorpay_order(request: CreateOrderRequest):
    try:
        # Razorpay expects INR amount in paise.
        amount_in_paise = round(request.amount * 100)

        receipt = f"nandhini_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        razorpay_order = razorpay_client.order.create(
            {
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": receipt,
                "payment_capture": 1,
                "notes": {
                    "business": "Nandhini Agency",
                },
            }
        )

        return {
            "status": "success",
            "key_id": RAZORPAY_KEY_ID,
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "receipt": razorpay_order["receipt"],
        }

    except razorpay.errors.BadRequestError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        print("RAZORPAY ERROR:", repr(error))
        raise HTTPException(
            status_code=500,
            detail=f"Unable to create Razorpay order: {str(error)}",
        )