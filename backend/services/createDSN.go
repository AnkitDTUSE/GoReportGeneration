package services

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type DBConnectionReq struct {
	Host     string `json:"host" binding:"required"`
	Port     int    `json:"port"`
	User     string `json:"user" binding:"required"`
	Password string `json:"password" binding:"required"`
	DBName   string `json:"dbname" binding:"required"`
	SSLMode  string `json:"sslmode"`
}

func CreateDSN(c *gin.Context) (string, error) {
	var req DBConnectionReq

	if err := c.ShouldBindJSON(&req); err != nil {
		return "", err
	}

	if req.Port == 0 {
		req.Port = 5432
	}
	if req.SSLMode == "" {
		req.SSLMode = "disable"
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s TimeZone=UTC",
		req.Host, req.User, req.Password, req.DBName, req.Port, req.SSLMode,
	)

	return dsn, nil
}

