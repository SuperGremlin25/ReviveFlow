from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class ClientOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    class Config:
        orm_mode = True

class JobCreate(BaseModel):
    client_id: int
    hours: float
    rate: float
    notes: Optional[str] = None

class JobOut(BaseModel):
    id: int
    client_id: int
    hours: float
    rate: float
    notes: Optional[str]
    class Config:
        orm_mode = True

class ExpenseCreate(BaseModel):
    item_name: str
    quantity: int
    price: float

class ExpenseOut(BaseModel):
    id: int
    job_id: int
    item_name: str
    quantity: int
    price: float
    class Config:
        orm_mode = True

class JobSummary(BaseModel):
    job_id: int
    client_id: int
    hours: float
    rate: float
    total: float
    expenses: List[ExpenseOut]
