from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
    HTTPNoContent
)
from ..models.kategori import Kategori
from ..services.kategori import KategoriService
from ..schemas.kategori import (
    KategoriSchema,
    KategoriCreateSchema,
    KategoriUpdateSchema
)
from marshmallow import ValidationError

@view_config(route_name='api_v1.kategoris', request_method='GET', renderer='json')
def get_kategoris(request):
    page = int(request.params.get('page', 1))
    per_page = int(request.params.get('per_page', 15))

    query = request.dbsession.query(Kategori)
    total = query.count()
    
    offset = (page - 1) * per_page
    paginated_query = query.offset(offset).limit(per_page)

    return {
        'data': KategoriSchema(many=True).dump(paginated_query.all()),
        'meta': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'total_pages': (total + per_page - 1) // per_page
        }
    }

@view_config(route_name='api_v1.kategoris', request_method='POST', renderer='json')
def create_kategori(request):
    """Create a new category."""
    schema = KategoriCreateSchema()
    try:
        kategori_data = schema.load(request.json_body)
    except ValidationError as err:
        raise HTTPBadRequest(json={'errors': err.messages})

    if KategoriService.get_kategori_by_nama(request.dbsession, kategori_data['nama']):
        raise HTTPBadRequest(json={'errors': {'nama': ['Category name already exists']}})

    kategori = KategoriService.create_kategori(request.dbsession, kategori_data)
    return KategoriSchema().dump(kategori)


@view_config(route_name='api_v1.kategori', request_method='GET', renderer='json')
def get_kategori(request):
    """Get category by ID."""
    kategori_id = int(request.matchdict['id'])
    kategori = KategoriService.get_kategori_by_id(request.dbsession, kategori_id)
    if not kategori:
        raise HTTPNotFound()
    return KategoriSchema().dump(kategori)


@view_config(route_name='api_v1.kategori', request_method='PUT', renderer='json')
def update_kategori(request):
    """Update category by ID."""
    kategori_id = int(request.matchdict['id'])
    kategori = KategoriService.get_kategori_by_id(request.dbsession, kategori_id)
    if not kategori:
        raise HTTPNotFound()

    schema = KategoriUpdateSchema()
    try:
        update_data = schema.load(request.json_body)
    except ValidationError as err:
        raise HTTPBadRequest(json={'errors': err.messages})

    updated_kategori = KategoriService.update_kategori(request.dbsession, kategori, update_data)
    return KategoriSchema().dump(updated_kategori)


@view_config(route_name='api_v1.kategori', request_method='DELETE')
def delete_kategori(request):
    """Delete category (hard delete)."""
    kategori_id = int(request.matchdict['id'])
    kategori = KategoriService.get_kategori_by_id(request.dbsession, kategori_id)
    if not kategori:
        raise HTTPNotFound()
    KategoriService.delete_kategori(request.dbsession, kategori)
    return HTTPNoContent()