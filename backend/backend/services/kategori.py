from typing import List, Optional
from ..models.kategori import Kategori
from ..schemas.kategori import KategoriCreateSchema, KategoriUpdateSchema

class KategoriService:
    """Service for kategori operations."""

    @staticmethod
    def get_all_kategori(dbsession) -> List[Kategori]:
        """Get all categories."""
        return dbsession.query(Kategori).all()

    @staticmethod
    def get_kategori_by_id(dbsession, kategori_id: int) -> Optional[Kategori]:
        """Get category by ID."""
        return dbsession.query(Kategori).get(kategori_id)

    @staticmethod
    def get_kategori_by_nama(dbsession, nama: str) -> Optional[Kategori]:
        """Get category by name."""
        return dbsession.query(Kategori).filter(Kategori.nama == nama).first()

    @staticmethod
    def create_kategori(dbsession, kategori_data: dict) -> Kategori:
        """Create a new category."""
        kategori = Kategori(**kategori_data)
        dbsession.add(kategori)
        dbsession.flush()
        return kategori

    @staticmethod
    def update_kategori(dbsession, kategori: Kategori, update_data: dict) -> Kategori:
        """Update category fields."""
        for field, value in update_data.items():
            setattr(kategori, field, value)
        dbsession.add(kategori)
        dbsession.flush()
        return kategori

    @staticmethod
    def delete_kategori(dbsession, kategori: Kategori) -> None:
        """Delete category (hard delete)."""
        dbsession.delete(kategori)
        dbsession.flush()