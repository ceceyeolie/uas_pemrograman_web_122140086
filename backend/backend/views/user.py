from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
    HTTPNoContent
)
from ..models.user import User
from ..services.user import UserService
from ..schemas.user import (
    UserSchema,
    UserCreateSchema,
    UserUpdateSchema
)
from marshmallow import ValidationError


@view_config(route_name='api_v1.users', request_method='GET', renderer='json')
def get_users(request):
    """Get all users."""
    users = UserService.get_all_users(request.dbsession)
    return UserSchema(many=True).dump(users)


@view_config(route_name='api_v1.users', request_method='POST', renderer='json')
def create_user(request):
    """Create a new user."""
    schema = UserCreateSchema()
    try:
        user_data = schema.load(request.json_body)
    except ValidationError as err:
        raise HTTPBadRequest(json={'errors': err.messages})

    if UserService.get_user_by_username(request.dbsession, user_data['username']):
        raise HTTPBadRequest(json={'errors': {'username': ['Username already exists']}})

    user = UserService.create_user(request.dbsession, user_data)
    return UserSchema().dump(user)


@view_config(route_name='api_v1.user', request_method='GET', renderer='json')
def get_user(request):
    """Get user by ID."""
    user_id = int(request.matchdict['id'])
    user = UserService.get_user_by_id(request.dbsession, user_id)
    if not user:
        raise HTTPNotFound()
    return UserSchema().dump(user)


@view_config(route_name='api_v1.user', request_method='PUT', renderer='json')
def update_user(request):
    """Update user by ID."""
    user_id = int(request.matchdict['id'])
    user = UserService.get_user_by_id(request.dbsession, user_id)
    if not user:
        raise HTTPNotFound()

    schema = UserUpdateSchema()
    try:
        update_data = schema.load(request.json_body)
    except ValidationError as err:
        raise HTTPBadRequest(json={'errors': err.messages})

    updated_user = UserService.update_user(request.dbsession, user, update_data)
    return UserSchema().dump(updated_user)


@view_config(route_name='api_v1.user', request_method='DELETE')
def delete_user(request):
    """Delete user (hard delete)."""
    user_id = int(request.matchdict['id'])
    user = UserService.get_user_by_id(request.dbsession, user_id)
    if not user:
        raise HTTPNotFound()
    UserService.delete_user(request.dbsession, user)
    return HTTPNoContent()