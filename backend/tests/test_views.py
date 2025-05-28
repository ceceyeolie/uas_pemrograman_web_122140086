from backend import models
from backend.views.default import my_view
from backend.views.notfound import notfound_view
import json
from webtest import TestApp
from backend import main

def test_my_view_failure(app_request):
    info = my_view(app_request)
    assert info.status_int == 500

def test_my_view_success(app_request, dbsession):
    model = models.MyModel(name='one', value=55)
    dbsession.add(model)
    dbsession.flush()

    info = my_view(app_request)
    assert app_request.response.status_int == 200
    assert info['one'].name == 'one'
    assert info['project'] == 'backend'

def test_notfound_view(app_request):
    info = notfound_view(app_request)
    assert app_request.response.status_int == 404
    assert info == {}

def test_get_articles():
    app = TestApp(main({}))
    res = app.get('/articles', status=200)
    assert isinstance(res.json, list)

def test_post_article_success():
    app = TestApp(main({}))
    payload = {
        "title": "Judul",
        "content": "Konten",
        "author": "Penulis"
    }
    res = app.post_json('/articles', payload, status=201)
    assert res.json["title"] == "Judul"

def test_post_article_fail():
    app = TestApp(main({}))
    payload = {}  # data kosong
    res = app.post_json('/articles', payload, status=400)
    assert res.status_code == 400