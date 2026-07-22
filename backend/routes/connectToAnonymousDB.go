package routes

import (
	"goReportGeneration/handlers"

	"github.com/gin-gonic/gin"
)

func ConnectToAnonymousDB(app *gin.Engine) {
	app.POST("/api/v1/connDb", func(c *gin.Context) {
		handlers.ConnectToDB(c)
	})
}
