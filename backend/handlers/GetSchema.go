package handlers

import (
	"goReportGeneration/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetSchema(c *gin.Context, db *gorm.DB) {
	if db == nil {
		db = AnonymousDB
	}

	if db == nil {
		c.JSON(400, gin.H{
			"error": "No active database connection. Please enter your DSN details first.",
		})
		return
	}

	schema, err := services.GetDatabaseDetails(db)

	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, schema)
}
