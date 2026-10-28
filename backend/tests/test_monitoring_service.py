from datetime import timedelta

from app.core.db import Base
from app.models.camera import Camera
from app.models.detection import VehicleDetection
from app.models.parking_slot import ParkingSlot
from app.services.monitoring import ingest_demo_frame, monitoring_summary, utc_now


def test_demo_ingest_updates_camera_slot_and_detection():
    class FakeSession:
        def __init__(self):
            self.camera = Camera(id=1, name="Demo", camera_code="CAM-1")
            self.slot = ParkingSlot(id=1, slot_code="A01", zone="A", type="Two-Wheeler", status="AVAILABLE")
            self.items = []

        def query(self, model):
            return self

        def all(self):
            return [self.slot]

        def add(self, item):
            self.items.append(item)

        def commit(self):
            return None

        def refresh(self, item):
            item.id = 1

    db = FakeSession()
    detections = ingest_demo_frame(db, db.camera, ["A01"], {"A01": "TN-01-AA-0001"})

    assert db.slot.status == "OCCUPIED"
    assert db.camera.status == "ONLINE"
    assert detections[0].vehicle_plate == "TN-01-AA-0001"
    assert any(isinstance(item, VehicleDetection) for item in db.items)


def test_monitoring_summary_counts_state():
    class FakeQuery:
        def __init__(self, values):
            self.values = values

        def all(self):
            return self.values

        def order_by(self, *_):
            return self

        def first(self):
            return self.values[0] if self.values else None

    class FakeSession:
        def query(self, model):
            if model is ParkingSlot:
                return FakeQuery([
                    ParkingSlot(status="OCCUPIED"),
                    ParkingSlot(status="AVAILABLE"),
                ])
            if model is Camera:
                return FakeQuery([])
            return FakeQuery([])

    summary = monitoring_summary(FakeSession())
    assert summary["total_slots"] == 2
    assert summary["occupied_slots"] == 1
    assert summary["available_slots"] == 1
