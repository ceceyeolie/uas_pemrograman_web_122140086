from marshmallow import Schema, fields, validate, post_load
import bcrypt

class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    username = fields.String(
        required=True,
        validate=validate.Length(min=2, max=50),
        index=True
    )
    password_hash = fields.String(load_only=True, required=True)

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @post_load
    def hash_password(self, data, **kwargs):
        if 'password_hash' in data:
            data['password_hash'] = bcrypt.hashpw(
                data['password_hash'].encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')
        return data


class UserCreateSchema(UserSchema):
    pass  # Same as UserSchema for creation


class UserUpdateSchema(Schema):
    username = fields.String(validate=validate.Length(min=2, max=50))
    password_hash = fields.String(load_only=True)

    @post_load
    def hash_password(self, data, **kwargs):
        if 'password_hash' in data:
            data['password_hash'] = bcrypt.hashpw(
                data['password_hash'].encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')
        return data