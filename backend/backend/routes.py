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
