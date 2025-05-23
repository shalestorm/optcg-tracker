from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

# I know i know - pydantic is cool and all xD but its just not for me


class Leader(Base):
    __tablename__ = "leaders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_url = Column(String, nullable=True)
    set = Column(String, index=True)
    matches = relationship("Match", back_populates="leader", foreign_keys="Match.leader_id")

    __table_args__ = (UniqueConstraint('name', 'set', name='unique_leader_set'),)


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.now(timezone.utc))
    result = Column(String)  # "win" or "loss"
    position = Column(String)  # "1st" or "2nd"

    # Player current leader
    leader_id = Column(Integer, ForeignKey("leaders.id"))
    leader = relationship("Leader", back_populates="matches", foreign_keys=[leader_id])

    # Opposing leader
    opposing_leader_id = Column(Integer, ForeignKey("leaders.id"))
    opposing_leader = relationship("Leader", foreign_keys=[opposing_leader_id])
