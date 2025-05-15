from marshmallow import Schema, fields, validate

class KategoriSchema(Schema):
    id = fields.Integer(dump_only=True)
    nama = fields.String(
        required=True,
        validate=validate.Length(min=2, max=100),
        unique=True
    )
    deskripsi = fields.String(validate=validate.Length(max=500), allow_none=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class KategoriCreateSchema(KategoriSchema):
    pass  # All fields except id and timestamps


class KategoriUpdateSchema(Schema):
    nama = fields.String(validate=validate.Length(min=2, max=100))
    deskripsi = fields.String(validate=validate.Length(max=500), allow_none=True)