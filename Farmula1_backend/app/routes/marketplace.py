from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
import json
import os

router = APIRouter(tags=["Marketplace"])

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

SELL_FILE = os.path.join(DATA_DIR, "sell.json")
BUY_FILE = os.path.join(DATA_DIR, "buy.json")

os.makedirs(DATA_DIR, exist_ok=True)

# ---------------- MODELS ---------------- #

class SellItem(BaseModel):
    id: int | None = None
    name: str
    contact: str
    product: str
    quantity: str
    price: str

class BuyItem(BaseModel):
    id: int | None = None
    name: str
    contact: str
    product: str
    quantity: str

# ---------------- FILE HELPERS ---------------- #

def read_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def write_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# ---------------- GET ---------------- #

@router.get("/sell")
def get_sell_items():
    return read_json(SELL_FILE)

@router.get("/buy")
def get_buy_items():
    return read_json(BUY_FILE)

# ---------------- POST ---------------- #

@router.post("/sell")
def add_sell_item(item: SellItem):
    data = read_json(SELL_FILE)
    item.id = (data[0]["id"] + 1) if data else 1
    data.insert(0, item.dict())
    write_json(SELL_FILE, data)
    return item

@router.post("/buy")
def add_buy_item(item: BuyItem):
    data = read_json(BUY_FILE)
    item.id = (data[0]["id"] + 1) if data else 1
    data.insert(0, item.dict())
    write_json(BUY_FILE, data)
    return item

# ---------------- DELETE (OWNER ONLY) ---------------- #

@router.delete("/sell/{item_id}")
def delete_sell_item(item_id: int, name: str):
    data = read_json(SELL_FILE)
    updated = [i for i in data if not (i["id"] == item_id and i["name"] == name)]

    if len(updated) == len(data):
        raise HTTPException(status_code=403, detail="Not authorized to delete")

    write_json(SELL_FILE, updated)
    return {"message": "Sell product deleted"}

@router.delete("/buy/{item_id}")
def delete_buy_item(item_id: int, name: str):
    data = read_json(BUY_FILE)
    updated = [i for i in data if not (i["id"] == item_id and i["name"] == name)]

    if len(updated) == len(data):
        raise HTTPException(status_code=403, detail="Not authorized to delete")

    write_json(BUY_FILE, updated)
    return {"message": "Buy request deleted"}
