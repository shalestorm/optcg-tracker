from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class Leader(Base):
    __tablename__ = "leaders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    image_url = Column(String, nullable=True)
    set = Column(String, index=True)
    matches = relationship("Match", back_populates="leader", foreign_keys="Match.leader_id")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.now(timezone.utc))
    result = Column(String)  # "win" or "loss"
    position = Column(String)  # "1st" or "2nd"

    # Player's selected leader
    leader_id = Column(Integer, ForeignKey("leaders.id"))
    leader = relationship("Leader", back_populates="matches", foreign_keys=[leader_id])

    # Opposing leader
    opposing_leader_id = Column(Integer, ForeignKey("leaders.id"))
    opposing_leader = relationship("Leader", foreign_keys=[opposing_leader_id])
