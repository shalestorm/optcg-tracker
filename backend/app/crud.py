from sqlalchemy.orm import Session
from . import models, schemas


# ========== LEADERS ==========

def create_leader(db: Session, leader: schemas.LeaderCreate):
    db_leader = models.Leader(name=leader.name, image_url=leader.image_url, set=leader.set)
    db.add(db_leader)
    db.commit()
    db.refresh(db_leader)
    return db_leader


def get_leader(db: Session, leader_id: int):
    return db.query(models.Leader).filter(models.Leader.id == leader_id).first()


def get_leader_by_name(db: Session, name: str):
    return db.query(models.Leader).filter(models.Leader.name == name).first()

def get_leader_by_set(db: Session, set: str):
    return db.query(models.Leader).filter(models.Leader.set == set).first()

def get_leader_by_name_and_set(db: Session, name: str, set: str):
    return db.query(models.Leader).filter(
        models.Leader.name == name,
        models.Leader.set == set
    ).all()


def get_all_leaders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Leader).offset(skip).limit(limit).all()


# ========== MATCHES ==========

def create_match(db: Session, match: schemas.MatchCreate):
    db_match = models.Match(**match.dict())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match


def get_match(db: Session, match_id: int):
    return db.query(models.Match).filter(models.Match.id == match_id).first()


def get_all_matches(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Match).offset(skip).limit(limit).all()


def get_matches_by_leader(db: Session, leader_id: int):
    return db.query(models.Match).filter(models.Match.leader_id == leader_id).all()
