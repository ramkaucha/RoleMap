from eralchemy2 import render_er
from .database import Base, engine
from .models import *

render_er(Base, 'database_schema.png')
print('Schema Diagram complted')
