package beaconpi

import (
	"testing"
)

func TestBytes(t *testing.T) {
	var testbecon BeaconRecord
	testbecon.Major = 1
	testbecon.Minor = 2
	testbecon.Rssi = -70
	t.Logf("%#v", testbecon.Bytes())
	t.Logf("%#v", testbecon.String())
}
