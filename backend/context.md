# Project Context Summary

## development.ini

```ini
###
# app configuration
# https://docs.pylonsproject.org/projects/pyramid/en/latest/narr/environment.html
###

[app:main]
use = egg:backend

pyramid.reload_templates = true
pyramid.debug_authorization = false
pyramid.debug_notfound = false
pyramid.debug_routematch = false
pyramid.default_locale_name = en
pyramid.includes =
    pyramid_debugtoolbar

sqlalchemy.url = postgresql://postgres:Gilthunder2@localhost:5432/artikel_db

retry.attempts = 3

# By default, the toolbar only appears for clients from IP addresses
# '127.0.0.1' and '::1'.
# debugtoolbar.hosts = 127.0.0.1 ::1

[pshell]
setup = backend.pshell.setup

###
# wsgi server configuration
###

[alembic]
# path to migration scripts
script_location = backend/alembic
file_template = %%(year)d%%(month).2d%%(day).2d_%%(rev)s
# file_template = %%(rev)s_%%(slug)s

[server:main]
use = egg:waitress#main
listen = localhost:6543

###
# logging configuration
# https://docs.pylonsproject.org/projects/pyramid/en/latest/narr/logging.html
###

[loggers]
keys = root, backend, sqlalchemy, alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = INFO
handlers = console

[logger_backend]
level = DEBUG
handlers =
qualname = backend

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine
# "level = INFO" logs SQL queries.
# "level = DEBUG" logs SQL queries and results.
# "level = WARN" logs neither.  (Recommended for production systems.)

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(asctime)s %(levelname)-5.5s [%(name)s:%(lineno)s][%(threadName)s] %(message)s

```


## initialize_db.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\scripts\initialize_db.py`

```python
import transaction
import bcrypt
from datetime import date, timedelta
from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config
from ..models import get_tm_session, get_session_factory
from ..models.user import User
from ..models.kategori import Kategori
from ..models.artikel import Artikel

def main():
    config_uri = 'development.ini'
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)

    engine = engine_from_config(settings, 'sqlalchemy.')
    session_factory = get_session_factory(engine)

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)

        # ✅ Create sample categories
        kategori_politik = Kategori(
            nama='Politik',
            deskripsi='Berita terkini seputar politik dan pemerintahan'
        )
        kategori_teknologi = Kategori(
            nama='Teknologi',
            deskripsi='Inovasi, gadget, dan perkembangan teknologi'
        )
        kategori_kesehatan = Kategori(
            nama='Kesehatan',
            deskripsi='Tips kesehatan dan perkembangan medis'
        )

        dbsession.add_all([kategori_politik, kategori_teknologi, kategori_kesehatan])
        dbsession.flush()

        # ✅ Create 30 articles (10 per kategori)
        base_konten = {
            'Politik': "Pemilu {tahun} akan segera dimulai. Partai politik mulai menyusun strategi. KPU telah mengumumkan tahapan pemilu yang berlangsung sampai April {tahun}. Fokus kampanye mencakup ekonomi, infrastruktur, dan pendidikan. Masyarakat diimbau menjaga netralitas dan ikut serta secara aktif dalam proses demokrasi.\n\nKPU menekankan pentingnya verifikasi data pemilih serta meningkatkan transparansi melalui rekapitulasi digital. Simulasi logistik dan distribusi perlengkapan TPS sedang dilakukan. Semua pihak berharap pemilu berjalan jujur, adil, dan damai.\n\nSebanyak {jumlah_partai} partai akan ikut serta, membawa isu-isu yang krusial bagi masa depan bangsa. Debat capres akan menjadi ajang penting untuk menilai visi-misi calon pemimpin. Publik diminta kritis dalam menerima informasi agar tidak terjebak hoaks.",
            'Teknologi': "Tahun {tahun} menjadi tonggak kemajuan AI di Indonesia. Teknologi seperti LLM, chatbot, dan sistem rekomendasi semakin canggih. Penggunaan AI di bidang kesehatan memungkinkan diagnosa lebih cepat dan akurat.\n\nAI juga merevolusi pendidikan dengan pembelajaran adaptif. Industri kreatif memanfaatkan AI untuk membuat musik, desain, dan tulisan yang tak kalah dengan buatan manusia. Namun, tantangan etika dan regulasi tetap perlu diwaspadai.\n\nPemerintah menyusun kebijakan terkait penggunaan AI agar tidak disalahgunakan. Kolaborasi antara riset dan industri sangat penting untuk memastikan AI dikembangkan secara bertanggung jawab.",
            'Kesehatan': "Menjaga kesehatan mental di tengah kesibukan adalah hal penting. Strategi seperti olahraga rutin, meditasi, dan manajemen waktu efektif sangat membantu. Nutrisi juga berperan besar dalam menjaga keseimbangan suasana hati.\n\nInteraksi sosial yang sehat dan konsultasi dengan profesional jika diperlukan sangat disarankan. Aplikasi kesehatan mental kini mudah diakses dan mendukung proses pemulihan individu dari stres dan tekanan psikologis.\n\nMindfulness menjadi pendekatan populer untuk mengelola emosi dan meningkatkan kesadaran diri. Dengan langkah yang tepat, setiap orang bisa menjaga keseimbangan mental demi kualitas hidup yang lebih baik."
        }

        categories = [
            ('Politik', kategori_politik),
            ('Teknologi', kategori_teknologi),
            ('Kesehatan', kategori_kesehatan)
        ]

        artikel_list = []
        for i in range(30):
            kategori_nama, kategori_obj = categories[i % 3]
            tanggal = date(2025, 5, 1) + timedelta(days=i)
            tahun = tanggal.year
            jumlah_partai = 16 + (i % 5)

            judul = f"{kategori_nama} Update #{i + 1}"
            konten_template = base_konten[kategori_nama]
            konten = konten_template.format(tahun=tahun, jumlah_partai=jumlah_partai)

            artikel = Artikel(
                judul=judul,
                konten=konten,
                penulis='chef',
                kategori_id=kategori_obj.id,
                tanggal_publikasi=tanggal,
                status='published' if i % 2 == 0 else 'draft'
            )
            artikel_list.append(artikel)

        dbsession.add_all(artikel_list)

if __name__ == '__main__':
    main()
```



## models/__init__.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\models\__init__.py`

```python
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers
import zope.sqlalchemy

# Import or define all models here to ensure they are attached to the
# ``Base.metadata`` prior to any initialization routines.
from .mymodel import MyModel  # flake8: noqa
from .artikel import Artikel  # flake8: noqa
from .kategori import Kategori  # flake8: noqa
from .user import User  # flake8: noqa

# Run ``configure_mappers`` after defining all of the models to ensure
# all relationships can be setup.
configure_mappers()


def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)


def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory


def get_tm_session(session_factory, transaction_manager, request=None):
    """
    Get a ``sqlalchemy.orm.Session`` instance backed by a transaction.

    This function will hook the session to the transaction manager which
    will take care of committing any changes.

    - When using pyramid_tm it will automatically be committed or aborted
      depending on whether an exception is raised.

    - When using scripts you should wrap the session in a manager yourself.
      For example:

      .. code-block:: python

          import transaction

          engine = get_engine(settings)
          session_factory = get_session_factory(engine)
          with transaction.manager:
              dbsession = get_tm_session(session_factory, transaction.manager)

    This function may be invoked with a ``request`` kwarg, such as when invoked
    by the reified ``.dbsession`` Pyramid request attribute which is configured
    via the ``includeme`` function below. The default value, for backwards
    compatibility, is ``None``.

    The ``request`` kwarg is used to populate the ``sqlalchemy.orm.Session``'s
    "info" dict.  The "info" dict is the official namespace for developers to
    stash session-specific information.  For more information, please see the
    SQLAlchemy docs:
    https://docs.sqlalchemy.org/en/stable/orm/session_api.html#sqlalchemy.orm.session.Session.params.info

    By placing the active ``request`` in the "info" dict, developers will be
    able to access the active Pyramid request from an instance of an SQLAlchemy
    object in one of two ways:

    - Classic SQLAlchemy. This uses the ``Session``'s utility class method:

      .. code-block:: python

          from sqlalchemy.orm.session import Session as sa_Session

          dbsession = sa_Session.object_session(dbObject)
          request = dbsession.info["request"]

    - Modern SQLAlchemy. This uses the "Runtime Inspection API":

      .. code-block:: python

          from sqlalchemy import inspect as sa_inspect

          dbsession = sa_inspect(dbObject).session
          request = dbsession.info["request"]
    """
    dbsession = session_factory(info={"request": request})
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager
    )
    return dbsession


def includeme(config):
    """
    Initialize the model for a Pyramid app.

    Activate this setup using ``config.include('backend.models')``.

    """
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    # Use ``pyramid_tm`` to hook the transaction lifecycle to the request.
    # Note: the packages ``pyramid_tm`` and ``transaction`` work together to
    # automatically close the active database session after every request.
    # If your project migrates away from ``pyramid_tm``, you may need to use a
    # Pyramid callback function to close the database session after each
    # request.
    config.include('pyramid_tm')

    # use pyramid_retry to retry a request when transient exceptions occur
    config.include('pyramid_retry')

    # hook to share the dbengine fixture in testing
    dbengine = settings.get('dbengine')
    if not dbengine:
        dbengine = get_engine(settings)

    session_factory = get_session_factory(dbengine)
    config.registry['dbsession_factory'] = session_factory

    # make request.dbsession available for use in Pyramid
    def dbsession(request):
        # hook to share the dbsession fixture in testing
        dbsession = request.environ.get('app.dbsession')
        if dbsession is None:
            # request.tm is the transaction manager used by pyramid_tm
            dbsession = get_tm_session(
                session_factory, request.tm, request=request
            )
        return dbsession

    config.add_request_method(dbsession, reify=True)
```



## models/meta.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\models\meta.py`

```python
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import MetaData

# Recommended naming convention used by Alembic, as various different database
# providers will autogenerate vastly different names making migrations more
# difficult. See: https://alembic.sqlalchemy.org/en/latest/naming.html
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=NAMING_CONVENTION)
Base = declarative_base(metadata=metadata)
```



## models/mymodel.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\models\mymodel.py`

```python
from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
)

from .meta import Base


class MyModel(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    value = Column(Integer)


Index('my_index', MyModel.name, unique=True, mysql_length=255)
```



## views/artikel.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\artikel.py`

```python
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

    is_authenticated = request.authenticated_userid is not None

    if not is_authenticated:
        status = 'published'

    artikels = ArtikelService.get_all_artikel(
        request.dbsession,
        status=status,
        kategori_id=kategori_id,
        search_query=search_query
    )
    return ArtikelSchema(many=True).dump(artikels)


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
```



## views/cors.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\cors.py`

```python
# In a file called tweens.py or in the main file
from pyramid.response import Response
from pyramid.httpexceptions import HTTPForbidden

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        # Allow specific origin (not *)
        allowed_origin = 'http://localhost:5173'

        if request.method == 'OPTIONS':
            # Preflight response
            response = request.response
            response.headers['Access-Control-Allow-Origin'] = allowed_origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Max-Age'] = '3600'
            return response

        # Actual response
        response = handler(request)
        response.headers['Access-Control-Allow-Origin'] = allowed_origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    return cors_tween
```



## views/default.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\default.py`

```python
from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import SQLAlchemyError

from .. import models


@view_config(route_name='home', renderer='backend:templates/mytemplate.jinja2')
def my_view(request):
    try:
        query = request.dbsession.query(models.MyModel)
        one = query.filter(models.MyModel.name == 'one').one()
    except SQLAlchemyError:
        return Response(db_err_msg, content_type='text/plain', status=500)
    return {'one': one, 'project': 'backend'}


db_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:

1.  You may need to initialize your database tables with `alembic`.
    Check your README.txt for descriptions and try to run it.

2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.

After you fix the problem, please restart the Pyramid application to
try it again.
"""
```



## views/kategori.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\kategori.py`

```python
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
    """Get all categories."""
    kategoris = KategoriService.get_all_kategori(request.dbsession)
    return KategoriSchema(many=True).dump(kategoris)


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
```



## views/login.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\login.py`

```python
# views/login.py
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPUnauthorized, HTTPBadRequest
from pyramid.response import Response
from pyramid.security import remember 
from ..models.user import User
from ..services.user import UserService
import bcrypt

@view_config(route_name='api_v1.login', request_method='POST', renderer='json')
def login(request):
    data = request.json_body
    username = data.get('username')
    password = data.get('password')

    user = UserService.get_user_by_username(request.dbsession, username)
    if not user or not user.check_password(password):
        raise HTTPUnauthorized(json={'message': 'Invalid email or password. Please try again.'})

    headers = remember(request, user.id)

    return Response(
        json={
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username
            }
        },
        headers=headers
    )
```



## views/notfound.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\notfound.py`

```python
from pyramid.view import notfound_view_config


@notfound_view_config(renderer='backend:templates/404.jinja2')
def notfound_view(request):
    request.response.status = 404
    return {}
```



## views/user.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\user.py`

```python
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
```



## views/__init__.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\views\__init__.py`

```python

```



## backend/__init__.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\__init__.py`

```python
from pyramid.config import Configurator
from .views.cors import cors_tween_factory
from pyramid.renderers import JSON
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    with Configurator(settings=settings) as config:
        authn_policy = AuthTktAuthenticationPolicy(
            secret='super_secret_key',
            hashalg='sha512'
        )
        authz_policy = ACLAuthorizationPolicy()
        config.set_authentication_policy(authn_policy)
        config.set_authorization_policy(authz_policy)

        config.add_tween('.cors_tween_factory')  # Add CORS tween
        config.add_renderer('json', JSON(indent=4))

        config.add_settings({
            'marshmallow': {
                'strict': True 
            }
        })
        config.include('pyramid_marshmallow')

        config.include('pyramid_jinja2')
        config.include('.routes')
        config.include('.models')
        config.scan()

    return config.make_wsgi_app()
```



## routes.py
**Path**: `D:\DITO\PERKULIAHAN\Sem 6\PEMWEB\Cici\backend\backend\routes.py`

```python
def includeme(config):
    # Static assets (unchanged)
    config.add_static_view('static', 'static', cache_max_age=3600)
    
    # Homepage (unchanged)
    config.add_route('home', '/')

    # API v1 Routes
    config.add_route('api_v1.users', '/api/v1/users')          # List/Create
    config.add_route('api_v1.user', '/api/v1/users/{id}')      # Get/Update/Delete

    config.add_route('api_v1.kategoris', '/api/v1/kategori')  # List/Create
    config.add_route('api_v1.kategori', '/api/v1/kategori/{id}')  # Get/Update/Delete

    config.add_route('api_v1.artikels', '/api/v1/artikel')    # List/Create
    config.add_route('api_v1.artikel', '/api/v1/artikel/{id}')  # Get/Update/Delete

    config.add_route('api_v1.login', '/api/v1/login')
```
