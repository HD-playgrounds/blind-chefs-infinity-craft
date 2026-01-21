from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session, select

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: str  # ingredient, technique, appliance
    icon: str
    isBase: bool = Field(default=False)
    directions: Optional[str] = None

class Recipe(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source_id: int = Field(foreign_key="item.id")
    target_id: int = Field(foreign_key="item.id")
    result_id: int = Field(foreign_key="item.id")
    is_order_dependent: bool = Field(default=False)

class Progression(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_id: int = Field(foreign_key="item.id")
    is_discovered: bool = Field(default=False)
    is_unlocked: bool = Field(default=False)
    mastery_count: int = Field(default=0)
