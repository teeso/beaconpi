package beaconpi

import (
	"fmt"
	"encoding/binary"
	"bytes"
)
// This module is designed to be able to mock hcidump with realistic
// looking data

type MockConfig struct {
	Beacons []MockBeacon
	Edges []MockEdge
	// For simplicity I provide all Edges data but give a selector, this
	// lets multiple running producers share the same config file
	EdgeSelected int
	PathLossModel PathmodelParams
}

type MockBeacon struct {
	BeaconRecord
	Location []float64
}

type MockEdge struct {
	Location []float64
}

func (b *BeaconRecord) Bytes() (o []byte) {
	// I don't really care about this fix data so I just grabbed some online
	// for testing purposes
	fixed := "\x04\x3E\x2A\x02\x01\x03\x00\xB3\xF1\xC6\x72\x02\x00\x1E\x02\x01\x1A\x1A\xFF\x4C\x00\x02\x15"
	buf := new(bytes.Buffer)
	o = make([]byte, 46)
	// 0-22
	copy(o[:23], []byte(fixed))
	// 23-39 uuid
	copy(o[23:40], b.Uuid[:])
	// 40-41 major
	if err := binary.Write(buf, binary.BigEndian, b.Major); err != nil {
		panic(err)
	}
	copy(o[40:42], buf.Bytes()[:2])
	buf.Reset()
	// 42-43 minor
	if err := binary.Write(buf, binary.BigEndian, b.Minor); err != nil {
		panic(err)
	}
	copy(o[42:44], buf.Bytes()[:2])
	buf.Reset()
	// 44 tx power
	// 45 rx power (rssi)
	// Warning: b.Rssi is two bytes so we use byte 1
	if err := binary.Write(buf, binary.BigEndian, b.Rssi); err != nil {
		panic(err)
	}
	o[45] = buf.Bytes()[1]
	return
}

// Prints the beacon record the same way hcidump does
func (b *BeaconRecord) String() (o string) {

	// every twentyith byte is followed by new line and two spaces
	o = ">"
	for i, v := range(b.Bytes()) {
		if i != 0 && (i % 20) == 0 {
			o += "\n  "
		} else {
			o += " "
		}
		o += fmt.Sprintf("%02X", v) 
	}
	return
}

