package main

import (
	"github.com/PurinPintakhiew/NextJs-Golang/configs"
	"github.com/PurinPintakhiew/NextJs-Golang/routes"
)

func main() {
	configs.ConnectDB()
	routes.Route()
}
