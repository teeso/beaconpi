# GNU Makefile for beaconpi

PACKAGE = github.com/co60ca/beaconpi
SERVERFLAGS =
CLIENTFLAGS = 
SERVERENV = CGO=0
CLIENTENV = GOARCH=arm64 GOOS=linux CGO=0

.PHONY: all
all: reqs build/beaconserv build/beaconclient build/metricsserv build/hcidump

.PHONY: clean
clean:
	rm -rf build

# Using go get to fetch any prequisite libraries
.PHONY: reqs
reqs:
	@go get .

build/beaconserv:
	$(SERVERENV) \
	go build -o $@ $(SERVERFLAGS) $(PACKAGE)/beaconserv
build/beaconclient:
	$(CLIENTENV) \
	go build -o $@ $(CLIENTFLAGS) $(PACKAGE)/beaconclient
build/metricsserv:
	$(SERVERENV) \
	go build -o $@ $(SERVERFLAGS) $(PACKAGE)/metricsserv  
build/hcidump:
	$(SERVERENV) \
	go build -o $@ $(SERVERFLAGS) $(PACKAGE)/mockhcidump
