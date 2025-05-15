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