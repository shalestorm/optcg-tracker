from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas
from .database import get_db
from .models import Match

router = APIRouter()


# LEADER ROUTES

@router.post("/leaders/", response_model=schemas.Leader)
def create_leader(leader: schemas.LeaderCreate, db: Session = Depends(get_db)):
    existing_leaders = crud.get_leader_by_name_and_set(db, leader.name, leader.set)
    if existing_leaders:
        raise HTTPException(status_code=400, detail="Leader already exists")
    return crud.create_leader(db, leader)


@router.get("/leaders/", response_model=List[schemas.Leader])
def read_leaders(
    skip: int = 0,
    limit: int = 100,
    name: str = None,  # type: ignore
    set: str = None,  # type: ignore
    db: Session = Depends(get_db)
):
    if name and set:
        return crud.get_leader_by_name_and_set(db, name, set)
    return crud.get_all_leaders(db, skip=skip, limit=limit)


@router.get("/leaders/by_set/{set}", response_model=List[schemas.Leader])
def read_leaders_by_set(set: str, db: Session = Depends(get_db)):
    return crud.get_leader_by_set(db, set)


@router.get("/leaders/{leader_id}", response_model=schemas.Leader)
def read_leader(leader_id: int, db: Session = Depends(get_db)):
    leader = crud.get_leader(db, leader_id)
    if not leader:
        raise HTTPException(status_code=404, detail="Leader not found")
    return leader


# MATCH ROUTES

@router.post("/matches/", response_model=schemas.Match)
def create_match(match: schemas.MatchCreate, db: Session = Depends(get_db)):
    return crud.create_match(db, match)


@router.get("/matches/", response_model=List[schemas.Match])
def read_matches(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_matches(db, skip=skip, limit=limit)


@router.get("/matches/{match_id}", response_model=schemas.Match)
def read_match(match_id: int, db: Session = Depends(get_db)):
    match = crud.get_match(db, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match


@router.get("/leaders/{leader_id}/matches", response_model=List[schemas.Match])
def read_matches_by_leader(leader_id: int, db: Session = Depends(get_db)):
    return crud.get_matches_by_leader(db, leader_id)


@router.delete("/matches/leader/{leader_id}")
def delete_matches_by_leader(leader_id: int, db: Session = Depends(get_db)):
    deleted = db.query(Match).filter(Match.leader_id == leader_id).delete()
    db.commit()
    return {"deleted_count": deleted}
