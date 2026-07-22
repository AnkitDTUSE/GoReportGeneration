package routes

import (
	"goReportGeneration/handlers"

	"github.com/gin-gonic/gin"
)

func GetSchemaRoute(app *gin.Engine) {
	app.GET("/api/v1/getDets", func(c *gin.Context) {
		handlers.GetSchema(c, handlers.AnonymousDB)
	})
}
