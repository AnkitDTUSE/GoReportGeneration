package handlers

import (
	"goReportGeneration/config"
	"goReportGeneration/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetDataFromDBasPerRequested(c *gin.Context, db *gorm.DB) {
	if db == nil {
		db = config.DB
	}
	if db == nil {
		db = AnonymousDB
	}

	if db == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Database connection is not initialized. Please connect to a database or set DSN in .env.",
		})
		return
	}

	query, err := services.CreateQuery(c, db) // main QUERY GENERATOR
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var retrievedData []map[string]any
	
	if err = db.Raw(query).Find(&retrievedData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	} 

	c.JSON(http.StatusOK, gin.H{
		"query": query,
		"data":  retrievedData,
	})
}
