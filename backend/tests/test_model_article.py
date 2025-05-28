from backend.models.artikel import Artikel

def test_article_model(dbsession):
    artikel = Artikel(
        title="Contoh Judul",
        content="Isi artikel",
        category_id=1,
        author_id=1
    )
    dbsession.add(artikel)
    dbsession.flush()

    assert artikel.id is not None
    assert artikel.title == "Contoh Judul"
    assert artikel.is_active is True
