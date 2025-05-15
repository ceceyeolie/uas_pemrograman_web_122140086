from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
    HTTPNoContent
)
from ..models.artikel import Artikel
from ..services.artikel import ArtikelService
from ..schemas.artikel import (
    ArtikelSchema,
    ArtikelCreateSchema,
    ArtikelUpdateSchema
)

from ..services.kategori import KategoriService
from marshmallow import ValidationError

@view_config(route_name='api_v1.artikels', request_method='GET', renderer='json')
def get_artikels(request):
    status = request.params.get('status')
    kategori_id = request.params.get('kategori_id')
    search_query = request.params.get('q')
    page = int(request.params.get('page', 1))
    per_page = int(request.params.get('per_page', 8))  # Default 8 for homepage

    is_authenticated = request.authenticated_userid is not None

    if not is_authenticated:
        status = 'published'

    result = ArtikelService.get_all_artikel(
        request.dbsession,
        status=status,
        kategori_id=kategori_id,
        search_query=search_query,
        page=page,
        per_page=per_page
    )

    return {
        'data': ArtikelSchema(many=True).dump(result['items']),
        'meta': {
            'page': result['page'],
            'per_page': result['per_page'],
            'total': result['total'],
            'total_pages': result['total_pages']
        }
    }


@view_config(route_name='api_v1.artikels', request_method='POST', renderer='json')
def create_artikel(request):
    """Create a new article."""
    schema = ArtikelCreateSchema()
    try:
        artikel_data = schema.load(request.json_body)
    except ValidationError as err:
        raise HTTPBadRequest(json={'errors': err.messages})

    kategori_id = artikel_data.get('kategori_id')
    kategori = KategoriService.get_kategori_by_id(request.dbsession, kategori_id)
    if not kategori:
        raise HTTPBadRequest(json={'errors': {'kategori_id': ['Invalid category ID']}})

    artikel = ArtikelService.create_artikel(request.dbsession, artikel_data)
    return ArtikelSchema().dump(artikel)


@view_config(route_name='api_v1.artikel', request_method='GET', renderer='json')
def get_artikel(request):
    """Get article by ID."""
    artikel_id = int(request.matchdict['id'])
    artikel = ArtikelService.get_artikel_by_id(request.dbsession, artikel_id)
    if not artikel:
        raise HTTPNotFound()
    return ArtikelSchema().dump(artikel)


@view_config(route_name='api_v1.artikel', request_method='PUT', renderer='json')
def update_artikel(request):
    """Update article by ID."""
    artikel_id = int(request.matchdict['id'])
    artikel = ArtikelService.get_artikel_by_id(request.dbsession, artikel_id)
    if not artikel:
        raise HTTPNotFound()

    schema = ArtikelUpdateSchema()
    try:
        update_data = schema.load(request.json_body)
    except ValidationError as err:
        raise HTTPBadRequest(json={'errors': err.messages})

    kategori_id = update_data.get('kategori_id')
    if kategori_id:
        kategori = KategoriService.get_kategori_by_id(request.dbsession, kategori_id)
        if not kategori:
            raise HTTPBadRequest(json={'errors': {'kategori_id': ['Invalid category ID']}})

    updated_artikel = ArtikelService.update_artikel(request.dbsession, artikel, update_data)
    return ArtikelSchema().dump(updated_artikel)


@view_config(route_name='api_v1.artikel', request_method='DELETE')
def delete_artikel(request):
    """Delete article (hard delete)."""
    artikel_id = int(request.matchdict['id'])
    artikel = ArtikelService.get_artikel_by_id(request.dbsession, artikel_id)
    if not artikel:
        raise HTTPNotFound()
    ArtikelService.delete_artikel(request.dbsession, artikel)
    return HTTPNoContent()