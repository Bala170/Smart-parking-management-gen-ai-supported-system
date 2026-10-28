"""add camera monitoring tables

Revision ID: 20261022_monitoring
Revises: 162e1606bd9c
"""
from alembic import op
import sqlalchemy as sa


revision = "20261022_monitoring"
down_revision = "162e1606bd9c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "parking_zones",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("zone_code", sa.String(20), nullable=False),
        sa.Column("description", sa.String(255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)")),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.UniqueConstraint("zone_code"),
    )
    op.create_index("ix_parking_zones_id", "parking_zones", ["id"])
    op.create_index("ix_parking_zones_zone_code", "parking_zones", ["zone_code"])
    op.create_table(
        "cameras",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("camera_code", sa.String(50), nullable=False),
        sa.Column("stream_url", sa.Text()),
        sa.Column("zone_id", sa.Integer(), sa.ForeignKey("parking_zones.id")),
        sa.Column("status", sa.String(20), nullable=False, server_default="OFFLINE"),
        sa.Column("last_seen_at", sa.DateTime(timezone=True)),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("(CURRENT_TIMESTAMP)")),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.UniqueConstraint("camera_code"),
    )
    op.create_index("ix_cameras_id", "cameras", ["id"])
    op.create_index("ix_cameras_camera_code", "cameras", ["camera_code"])
    op.create_table(
        "vehicle_detections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("camera_id", sa.Integer(), sa.ForeignKey("cameras.id"), nullable=False),
        # The legacy migration does not create parking_slots; the ORM model
        # keeps the runtime relationship while this migration remains portable.
        sa.Column("slot_id", sa.Integer()),
        sa.Column("vehicle_plate", sa.String(30)),
        sa.Column("vehicle_type", sa.String(30)),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("detected_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", sa.String(30), nullable=False, server_default="demo"),
        sa.Column("frame_reference", sa.Text()),
    )
    op.create_index("ix_vehicle_detections_id", "vehicle_detections", ["id"])
    op.create_index("ix_vehicle_detections_camera_id", "vehicle_detections", ["camera_id"])
    op.create_index("ix_vehicle_detections_slot_id", "vehicle_detections", ["slot_id"])
    op.create_index("ix_vehicle_detections_detected_at", "vehicle_detections", ["detected_at"])


def downgrade() -> None:
    op.drop_table("vehicle_detections")
    op.drop_table("cameras")
    op.drop_table("parking_zones")
