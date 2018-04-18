package beaconpi

import (
	"net/http"
	log "github.com/sirupsen/logrus"
	"encoding/json"
	"database/sql"
)

func jsonResponse(w http.ResponseWriter, results map[string]interface{}) {
	encoder := json.NewEncoder(w)
	err := encoder.Encode(results)
	if err != nil {
		log.Error("Failed to write jsonResponse", err)
		http.Error(w, "Server error", 500)
	}
	return
}

func quickStats() http.Handler {
	return http.HandlerFunc(func (w http.ResponseWriter, req *http.Request) {
		dbconfig := dbHandler{mp.DriverName, mp.DataSourceName}
		db, err := dbconfig.openDB()
		if err != nil {
			log.Infof("Error opening DB", err)
			http.Error(w, "Server failure", 500)
			return
		}
		defer db.Close()

		// Active edges in last 10 minutes
		var (
			countedges int
			countbeacons int
		)

		type edges struct {
			Title string
			Room string
			Location string
			Description string
		}
		var inactEdges []edges
		rowsedge, err := db.Query(`select title, room, location, description 
					from edge_node 
					where lastupdate < current_timestamp - interval '00:10:00'
				`)
		if err != nil {
			log.Printf("Failed while getting inactive edges %s", err)
			http.Error(w, "Server failure", 500)
			return
		}
		defer rowsedge.Close()
		for rowsedge.Next() {
			var t edges
			var desc sql.NullString
			if err := rowsedge.Scan(&t.Title, &t.Room, &t.Location, &desc); err != nil {
				log.Printf("Failed while scanning edges %s", err)
				http.Error(w, "Server failure", 500)
				return
			}
			t.Description = desc.String
			inactEdges = append(inactEdges, t)
		}

		if err = db.QueryRow(`select count(*) 
				from edge_node 
				`).Scan(&countedges); err != nil {
			log.Printf("Failed while getting total count %s", err)
			http.Error(w, "Server failure", 500)
			return
		}
		if err = db.QueryRow(`select count(*) 
				from ibeacons 
				`).Scan(&countbeacons); err != nil {
			log.Printf("Failed while getting total beacon count %s", err)
			http.Error(w, "Server failure", 500)
			return
		}

		type ibeacons struct {
			Label string
			Uuid string
			Major int
			Minor int
		}
		var inactivebeacons []ibeacons
		rows, err := db.Query(`
			select label, uuid, major, minor from ibeacons 
			where id in (
				select distinct i.beaconid from (
					select beaconid, datetime from beacon_log where 
						datetime < current_timestamp - interval '00:10:00' order by datetime desc) as i)
		`)
		defer rows.Close()
		if err != nil {
			log.Printf("Failed to get inactive beacons %s", err)
			http.Error(w, "Server failure", 500)
			return
		}
		for rows.Next() {
			var t ibeacons
			if err = rows.Scan(&t.Label, &t.Uuid, &t.Major, &t.Minor); err != nil {
				log.Printf("Failed while scanning beacons %s", err)
				http.Error(w, "Server failure", 500)
				return
			}
			inactivebeacons = append(inactivebeacons, t)
		}
		jsonResponse(w, map[string]interface{}{
			"InactiveBeacons": inactivebeacons,
			"InactiveEdges": inactEdges,
			"EdgeCount": countedges,
			"InaEdgeCount": countedges - len(inactEdges),
			"BeaconCount": countbeacons,
			"InaBeaconCount": countbeacons - len(inactivebeacons),
		})
	})
}
