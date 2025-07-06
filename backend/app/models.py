from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Client(Base):
    __tablename__ = 'clients'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    jobs = relationship('Job', back_populates='client')

class Job(Base):
    __tablename__ = 'jobs'
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey('clients.id'))
    hours = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    client = relationship('Client', back_populates='jobs')
    expenses = relationship('Expense', back_populates='job')

class Expense(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey('jobs.id'))
    item_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    job = relationship('Job', back_populates='expenses')
