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

	app.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("VALID_URL"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	routes.SetupRoutes(app)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	app.Run(":" + port)
}
