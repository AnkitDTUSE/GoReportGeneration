package routes

import (
	"goReportGeneration/handlers"

	"github.com/gin-gonic/gin"
)

func GetData(app *gin.Engine) {
	handler := func(c *gin.Context) {
		handlers.GetDataFromDBasPerRequested(c, handlers.AnonymousDB)
	}

	// app.POST("/api/v1/getData", handler)
	app.GET("/api/v1/getData", handler)
}
