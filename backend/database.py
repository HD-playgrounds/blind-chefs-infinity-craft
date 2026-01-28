from sqlmodel import SQLModel, create_engine
import os

sqlite_file_name = "game.db"
# Use absolute path to ensure DB is found regardless of where valid CWD is
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, sqlite_file_name)
sqlite_url = f"sqlite:///{db_path}"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
