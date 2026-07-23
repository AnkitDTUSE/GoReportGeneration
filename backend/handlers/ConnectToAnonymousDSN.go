package handlers

import (
	"net/http"

	"goReportGeneration/services"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var AnonymousDB *gorm.DB

func ConnectToDB(c *gin.Context) {
	dsn, err := services.CreateDSN(c)

	if err != nil || dsn == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body or empty DSN",
		})
		return
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Anonymous Database connection failed",
		})
		return
	}

	AnonymousDB = db

	schema, err := services.GetDatabaseDetails(db)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Database connected successfully",
		})
		return
	}

	c.JSON(http.StatusOK, schema)
}

func DisconnectDB(c *gin.Context) {
	if AnonymousDB != nil {
		sqlDB, err := AnonymousDB.DB()
		if err == nil && sqlDB != nil {
			sqlDB.Close()
		}
		AnonymousDB = nil
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Database connection reset successfully",
	})
}


