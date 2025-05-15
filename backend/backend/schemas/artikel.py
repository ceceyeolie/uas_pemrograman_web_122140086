from marshmallow import Schema, fields, validates_schema, ValidationError
from ..models.artikel import Artikel

class ArtikelSchema(Schema):
    id = fields.Int()
    judul = fields.Str()
    konten = fields.Str()
    penulis = fields.Str()
    kategori_id = fields.Int()
    status = fields.Str()  # No restriction here for dumping
    tanggal_publikasi = fields.Date()

class ArtikelCreateSchema(Schema):
    judul = fields.Str(required=True)
    konten = fields.Str(required=True)
    penulis = fields.Str(required=True)
    kategori_id = fields.Int(required=True)
    status = fields.Str(default='draft', validate=lambda s: s in ['published', 'draft'])  # ✅ Allow both
    tanggal_publikasi = fields.Date()

    @validates_schema
    def validate_kategori_exists(self, data, **kwargs):
        # Your existing validation logic
        pass

class ArtikelUpdateSchema(Schema):
    judul = fields.Str()
    konten = fields.Str()
    penulis = fields.Str()
    kategori_id = fields.Int()
    status = fields.Str(validate=lambda s: s in ['published', 'draft'])  # ✅ Allow both
    tanggal_publikasi = fields.Date()