from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from .base import BaseModel

class Kategori(BaseModel):
    __tablename__ = 'kategori'

    nama = Column(String(100), nullable=False, unique=True, index=True)
    deskripsi = Column(Text, nullable=True)

    artikels = relationship("Artikel", back_populates="kategori", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Kategori(nama='{self.nama}')>"