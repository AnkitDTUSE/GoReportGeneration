package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(app *gin.Engine) {
	GetSchemaRoute(app)
	ConnectToAnonymousDB(app)
	GetData(app)
}
