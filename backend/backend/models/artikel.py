from sqlalchemy import Column, String, Text, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class Artikel(BaseModel):
    __tablename__ = 'artikel'

    judul = Column(String(100), nullable=False, index=True)
    konten = Column(Text, nullable=False)
    penulis = Column(String(100), nullable=False, index=True)
    kategori_id = Column(Integer, ForeignKey('kategori.id'), nullable=False)
    tanggal_publikasi = Column(Date, nullable=True)
    status = Column(String(20), nullable=False)  # e.g., 'draft', 'published'

    kategori = relationship("Kategori", back_populates="artikels")

    def __repr__(self):
        return f"<Artikel(judul='{self.judul}', status='{self.status}')>"