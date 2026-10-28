"""
Hardware Integration Stubs.
These define the interfaces for real hardware integration.
Production implementations must replace these stubs.
"""

from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass

@dataclass
class RFIDTag:
    tag_id: str
    reader_id: str
    timestamp: str
    signal_strength: Optional[float] = None

@dataclass
class GateStatus:
    gate_id: str
    is_open: bool
    last_action: str
    last_action_time: str

class RFIDReaderInterface(ABC):
    '''Abstract interface for RFID readers'''
    
    @abstractmethod
    def read_tag(self, reader_id: str) -> Optional[RFIDTag]:
        '''Read RFID tag from specified reader'''
        pass
    
    @abstractmethod
    def verify_tag_at_reader(self, tag_id: str, reader_id: str) -> bool:
        '''Verify a specific tag is at a specific reader'''
        pass
    
    @abstractmethod
    def get_reader_status(self, reader_id: str) -> dict:
        '''Get health/status of RFID reader'''
        pass

class GateBarrierInterface(ABC):
    '''Abstract interface for gate barriers/boom gates'''
    
    @abstractmethod
    def open_gate(self, gate_id: str, auth_token: str) -> bool:
        '''Open gate with authorization token'''
        pass
    
    @abstractmethod
    def close_gate(self, gate_id: str) -> bool:
        '''Close gate'''
        pass
    
    @abstractmethod
    def get_gate_status(self, gate_id: str) -> GateStatus:
        '''Get current gate status'''
        pass
    
    @abstractmethod
    def emergency_open(self, gate_id: str) -> bool:
        '''Emergency open (fire alarm, etc)'''
        pass

class UltrasonicSensorInterface(ABC):
    '''Abstract interface for parking bay ultrasonic sensors'''
    
    @abstractmethod
    def get_bay_status(self, bay_id: str) -> bool:
        '''Return True if bay is occupied, False if available'''
        pass
    
    @abstractmethod
    def get_zone_occupancy(self, zone: str) -> dict:
        '''Get occupancy for all bays in a zone'''
        pass

class VehicleDetectorInterface(ABC):
    '''Abstract interface for vehicle detection (loop detectors, cameras)'''
    
    @abstractmethod
    def detect_vehicle_at_entry(self, gate_id: str) -> Optional[str]:
        '''Detect vehicle at entry, return plate if ANPR available'''
        pass
    
    @abstractmethod
    def detect_vehicle_at_exit(self, gate_id: str) -> Optional[str]:
        '''Detect vehicle at exit'''
        pass

# Stub implementations for development
class StubRFIDReader(RFIDReaderInterface):
    '''STUB: Returns mock data for development'''
    
    def read_tag(self, reader_id: str) -> Optional[RFIDTag]:
        from datetime import datetime
        return RFIDTag(
            tag_id=f'RFID-STUB-{reader_id}',
            reader_id=reader_id,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def verify_tag_at_reader(self, tag_id: str, reader_id: str) -> bool:
        return True  # Stub always verifies
    
    def get_reader_status(self, reader_id: str) -> dict:
        return {'reader_id': reader_id, 'status': 'ONLINE', 'last_seen': '2026-10-11T00:00:00Z'}

class StubGateBarrier(GateBarrierInterface):
    '''STUB: Mock gate barrier'''
    
    def __init__(self):
        self.gate_states = {}
    
    def open_gate(self, gate_id: str, auth_token: str) -> bool:
        self.gate_states[gate_id] = True
        return True
    
    def close_gate(self, gate_id: str) -> bool:
        self.gate_states[gate_id] = False
        return True
    
    def get_gate_status(self, gate_id: str) -> GateStatus:
        from datetime import datetime
        return GateStatus(
            gate_id=gate_id,
            is_open=self.gate_states.get(gate_id, False),
            last_action='OPEN' if self.gate_states.get(gate_id, False) else 'CLOSE',
            last_action_time=datetime.utcnow().isoformat()
        )
    
    def emergency_open(self, gate_id: str) -> bool:
        self.gate_states[gate_id] = True
        return True

class StubUltrasonicSensor(UltrasonicSensorInterface):
    '''STUB: Mock ultrasonic sensors'''
    
    def __init__(self):
        self.bay_status = {}  # bay_id -> bool
    
    def get_bay_status(self, bay_id: str) -> bool:
        return self.bay_status.get(bay_id, False)
    
    def get_zone_occupancy(self, zone: str) -> dict:
        return {f'{zone}{i:02d}': False for i in range(1, 13)}

class StubVehicleDetector(VehicleDetectorInterface):
    '''STUB: Mock vehicle detector'''
    
    def detect_vehicle_at_entry(self, gate_id: str) -> Optional[str]:
        return 'TN-09-BK-4821'  # Mock plate
    
    def detect_vehicle_at_exit(self, gate_id: str) -> Optional[str]:
        return 'TN-09-BK-4821'

# Factory for getting hardware interfaces
class HardwareFactory:
    '''Factory to get hardware implementations. Switch between stub/production.'''
    
    _use_stubs = True  # Set to False for production
    
    @classmethod
    def set_production_mode(cls, enabled: bool):
        cls._use_stubs = not enabled
    
    @classmethod
    def get_rfid_reader(cls) -> RFIDReaderInterface:
        if cls._use_stubs:
            return StubRFIDReader()
        # return ProductionRFIDReader()  # Implement in production
        raise NotImplementedError('Production RFID reader not implemented')
    
    @classmethod
    def get_gate_barrier(cls) -> GateBarrierInterface:
        if cls._use_stubs:
            return StubGateBarrier()
        raise NotImplementedError('Production gate barrier not implemented')
    
    @classmethod
    def get_ultrasonic_sensor(cls) -> UltrasonicSensorInterface:
        if cls._use_stubs:
            return StubUltrasonicSensor()
        raise NotImplementedError('Production ultrasonic sensor not implemented')
    
    @classmethod
    def get_vehicle_detector(cls) -> VehicleDetectorInterface:
        if cls._use_stubs:
            return StubVehicleDetector()
        raise NotImplementedError('Production vehicle detector not implemented')
