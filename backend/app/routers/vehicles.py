from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Vehicle
from app.schemas import VehicleCreate, VehicleUpdate
from app.dependencies import get_current_user, admin_required

router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"]
)


# -----------------------------
# Add Vehicle (Admin Only)
# -----------------------------
@router.post("/")
def add_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):

    new_vehicle = Vehicle(
        make=vehicle.make,
        model=vehicle.model,
        category=vehicle.category,
        price=vehicle.price,
        quantity=vehicle.quantity
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle


# -----------------------------
# Get All Vehicles
# -----------------------------
@router.get("/")
def get_all_vehicles(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Vehicle).all()


# -----------------------------
# Search Vehicles
# -----------------------------
@router.get("/search")
def search_vehicle(
    make: str = Query(None),
    model: str = Query(None),
    category: str = Query(None),
    min_price: float = Query(None),
    max_price: float = Query(None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    query = db.query(Vehicle)

    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))

    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))

    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))

    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)

    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)

    return query.all()


# -----------------------------
# Get Vehicle By ID
# -----------------------------
@router.get("/{vehicle_id}")
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return vehicle


# -----------------------------
# Update Vehicle (Admin Only)
# -----------------------------
@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    vehicle.make = data.make
    vehicle.model = data.model
    vehicle.category = data.category
    vehicle.price = data.price
    vehicle.quantity = data.quantity

    db.commit()
    db.refresh(vehicle)

    return vehicle

    # -----------------------------
# Purchase Vehicle (User Only)
# -----------------------------
@router.post("/{vehicle_id}/purchase")
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    if user.get("is_admin"):
        raise HTTPException(
            status_code=403,
            detail="Admin cannot purchase vehicles"
        )

    if vehicle.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Vehicle out of stock"
        )

    vehicle.quantity -= 1

    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Vehicle purchased successfully",
        "remaining_quantity": vehicle.quantity
    }


# -----------------------------
# Restock Vehicle (Admin Only)
# -----------------------------
@router.post("/{vehicle_id}/restock")
def restock_vehicle(
    vehicle_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    vehicle.quantity += quantity

    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Vehicle restocked successfully",
        "quantity": vehicle.quantity
    }


# -----------------------------
# Delete Vehicle (Admin Only)
# -----------------------------
@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(admin_required)
):

    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    db.delete(vehicle)
    db.commit()

    return {
        "message": "Vehicle deleted successfully"
    }