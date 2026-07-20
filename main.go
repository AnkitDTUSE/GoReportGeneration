package main

import (
	"fmt"
	"goReportGeneration/config"
	"log"
)

func main() {
	if err := config.LoadENV(); err != nil {
		log.Fatal(err)
	}

	if err := config.ConnectDB(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("DB connected!!")

	

}
