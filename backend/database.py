from sqlmodel import SQLModel, create_engine
import os

sqlite_file_name = "game.db"
sqlite_url = f"sqlite:///backend/{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
