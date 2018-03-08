package main

import (
	"github.com/co60ca/beaconpi"
        "flag"
)

func getflags() (out MetricsParameters) {
	flag.StringVar(&out.DriverName, "db-driver-name", "",
		"Required: The database driver name")
	flag.StringVar(&out.DataSourceName, "db-datasource-name", "",
		"Required: The database datasource name, may be multiple tokes")
        flag.StringVar(&out.Port, "port", "", "Required: Port for serving http")
        flag.Parse()
}

func main() {
        config := getflags()
	beaconpi.MetricStart(&config)
}
