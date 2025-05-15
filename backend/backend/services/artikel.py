from typing import List, Optional
from ..models.artikel import Artikel
from ..schemas.artikel import ArtikelCreateSchema, ArtikelUpdateSchema

class ArtikelService:
    @staticmethod
    def get_all_artikel(session, status=None, kategori_id=None, search_query=None, page=1, per_page=8):
        query = session.query(Artikel)

        if status:
            query = query.filter(Artikel.status == status)

        if kategori_id:
            query = query.filter(Artikel.kategori_id == kategori_id)

        if search_query:
            query = query.filter(Artikel.judul.ilike(f"%{search_query}%"))
            

        # Pagination
        offset = (page - 1) * per_page
        paginated_query = query.offset(offset).limit(per_page)
        total = query.count()

        return {
            'items': paginated_query.all(),
            'page': page,
            'per_page': per_page,
            'total': total,
            'total_pages': (total + per_page - 1) // per_page
        }

    @staticmethod
    def get_artikel_by_id(dbsession, artikel_id: int) -> Optional[Artikel]:
        """Get article by ID."""
        return dbsession.query(Artikel).get(artikel_id)

    @staticmethod
    def get_artikel_by_judul(dbsession, judul: str) -> Optional[Artikel]:
        """Get article by title."""
        return dbsession.query(Artikel).filter(Artikel.judul == judul).first()

    @staticmethod
    def get_published_artikel(dbsession) -> List[Artikel]:
        """Get all published articles."""
        return dbsession.query(Artikel).filter(Artikel.status == 'published').all()

    @staticmethod
    def create_artikel(dbsession, artikel_data: dict) -> Artikel:
        """Create a new article."""
        artikel = Artikel(**artikel_data)
        dbsession.add(artikel)
        dbsession.flush()
        return artikel

    @staticmethod
    def update_artikel(dbsession, artikel: Artikel, update_data: dict) -> Artikel:
        """Update article fields."""
        for field, value in update_data.items():
            setattr(artikel, field, value)
        dbsession.add(artikel)
        dbsession.flush()
        return artikel

    @staticmethod
    def delete_artikel(dbsession, artikel: Artikel) -> None:
        """Delete article (hard delete)."""
        dbsession.delete(artikel)
        dbsession.flush()