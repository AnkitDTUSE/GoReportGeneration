package handlers

import (
	"goReportGeneration/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Report struct {
	ID    int32   `json:"id"`
	Item  string  `json:"item"`
	Price float32 `json:"price"`
	HSN   int     `json:"hsn"`
}

func GetSchema(c *gin.Context, db *gorm.DB) {
	schema, err := services.GetDatabaseDetails(db)

	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, schema)
}
