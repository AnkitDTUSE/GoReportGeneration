package config

import (
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func LoadENV() error {
	_ = godotenv.Load()
	return nil
}

func ConnectDB() error {
	dsn := os.Getenv("DSN");

	if dsn == ""{
		return nil
	}

	dbConn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{}) 

	if err != nil{
		return err
	}

	db ,err := dbConn.DB()
	
	if err!=nil{
		return err
	}

	if err:= db.Ping(); err!=nil{
		return err
	}

	DB = dbConn

	return nil

}