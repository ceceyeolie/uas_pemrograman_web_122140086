from typing import List, Optional
from ..models.user import User
from ..schemas.user import UserCreateSchema, UserUpdateSchema

class UserService:
    """Service for user operations."""
    @staticmethod
    def get_user_by_username(dbsession, username):
        return dbsession.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_all_users(dbsession) -> List[User]:
        """Get all users."""
        return dbsession.query(User).all()

    @staticmethod
    def get_user_by_id(dbsession, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return dbsession.query(User).get(user_id)

    @staticmethod
    def get_user_by_username(dbsession, username: str) -> Optional[User]:
        """Get user by username."""
        return dbsession.query(User).filter(User.username == username).first()

    @staticmethod
    def create_user(dbsession, user_data: dict) -> User:
        """Create a new user."""
        user = User(**user_data)
        dbsession.add(user)
        dbsession.flush()
        return user

    @staticmethod
    def update_user(dbsession, user: User, update_data: dict) -> User:
        """Update user fields."""
        for field, value in update_data.items():
            setattr(user, field, value)
        dbsession.add(user)
        dbsession.flush()
        return user

    @staticmethod
    def delete_user(dbsession, user: User) -> None:
        """Delete user (hard delete)."""
        dbsession.delete(user)
        dbsession.flush()