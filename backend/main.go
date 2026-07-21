package main

import (
	"fmt"
	"goReportGeneration/config"
	"goReportGeneration/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := config.LoadENV(); err != nil {
		log.Fatal(err)
	}

	if err := config.ConnectDB(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("DB connected!!")

	app := gin.Default()

	routes.SetupRoutes(app)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	app.Run(":" + port)
}
