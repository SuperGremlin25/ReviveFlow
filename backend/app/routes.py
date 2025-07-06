from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database
from fastapi import status

router = APIRouter()

from fastapi.responses import StreamingResponse
from . import pdf

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/clients", response_model=schemas.ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/clients", response_model=list[schemas.ClientOut])
def get_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

@router.post("/jobs", response_model=schemas.JobOut, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/jobs", response_model=list[schemas.JobOut])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).all()

@router.post("/jobs/{job_id}/expenses", response_model=schemas.ExpenseOut, status_code=status.HTTP_201_CREATED)
def add_expense(job_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(job_id=job_id, **expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/jobs/{job_id}/summary", response_model=schemas.JobSummary)
def job_summary(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    expenses = db.query(models.Expense).filter(models.Expense.job_id == job_id).all()
    total_expenses = sum(e.price * e.quantity for e in expenses)
    total = job.hours * job.rate + total_expenses
    return schemas.JobSummary(
        job_id=job.id,
        client_id=job.client_id,
        hours=job.hours,
        rate=job.rate,
        total=total,
        expenses=expenses
    )

@router.get("/jobs/{job_id}/invoice")
def get_invoice(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    client = db.query(models.Client).filter(models.Client.id == job.client_id).first()
    expenses = db.query(models.Expense).filter(models.Expense.job_id == job_id).all()
    pdf_bytes = pdf.generate_invoice_pdf(client, job, expenses)
    return StreamingResponse(pdf_bytes, media_type="application/pdf")

@router.get("/health")
def health():
    return {"status": "ok"}
