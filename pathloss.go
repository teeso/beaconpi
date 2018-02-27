package beaconpi

import (
	"math"
	"database/sql"
	"sync"
	"errors"
	log "github.com/sirupsen/logrus"
)

func pathLossFunction(bias, k, gamma float64) func(float64) float64 {
	gammac := 10*gamma
	bc := math.Pow(k, 1/gamma)
	return func(rssi float64) float64 {
		
		return math.Pow(10, (bias - rssi)/gammac) * bc
	}
}

func PathLoss(rssi, bias, k, gamma float64) float64 {
	return pathLossFunction(bias, k, gamma)(rssi)
}

type pathmodelParams struct {
	bias float64
	k float64
	gamma float64
}

func getModelByEdge(edge int, db*sql.DB) (pathmodelParams, error) {
	var params pathmodelParams
	err := db.QueryRow(`
		select a.bias, a.k, a.gamma
		from models a, edge_node b
		where b.id = $1 and b.model = a.id
	`, edge).Scan(&params.bias, &params.k, &params.gamma)
	if err != nil {
		return params, err
	}
	return params, nil
}

var modelcache map[int]pathmodelParams
var modellock sync.Mutex

func distanceModel(rssi, edge int, db *sql.DB) (float64, error) {
	modellock.Lock()
	defer modellock.Unlock()

	if modelcache == nil {
		modelcache = make(map[int]pathmodelParams)
	}
	// Check if the cache has the param
	if v, ok := modelcache[edge]; ok {
		log.Println(PathLoss(float64(rssi), v.bias, v.k, v.gamma))
		return PathLoss(float64(rssi), v.bias, v.k, v.gamma), nil
	}
	// Look it up
	v, err := getModelByEdge(edge, db)
	if err != nil {
		return 0.0, errors.New("Failed to get model from DB " +
			err.Error())
	}
	modelcache[edge] = v
	return PathLoss(float64(rssi), v.bias, v.k, v.gamma), nil
}
