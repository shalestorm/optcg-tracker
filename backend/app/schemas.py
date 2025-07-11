from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# trying pydantic - still not cool. but i think i can grasp it

#  leaders


class LeaderBase(BaseModel):
    name: str
    image_url: Optional[str] = None
    set: str


class LeaderCreate(LeaderBase):
    pass


class Leader(LeaderBase):
    id: int

    class Config:
        orm_mode = True


#  matches
class MatchBase(BaseModel):
    result: str
    position: str
    leader_id: int
    opposing_leader_id: int


class MatchCreate(MatchBase):
    pass


class Match(MatchBase):
    id: int
    date: datetime

    class Config:
        orm_mode = True
