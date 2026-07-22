package services

import (
	"goReportGeneration/constants"

	"gorm.io/gorm"
)

type DatabaseSchema struct {
	Tables        []Table        `json:"tables"`
	Relationships []Relationship `json:"relationships"`
}

type Table struct {
	Schema  string   `gorm:"column:schema" json:"schema"`
	Name    string   `gorm:"column:name" json:"name"`
	Columns []Column `gorm:"-" json:"columns"`
}

type Column struct {
	TableName  string `gorm:"column:table_name" json:"-"`
	Name       string `gorm:"column:column_name" json:"name"`
	DataType   string `gorm:"column:data_type" json:"dataType"`
	Nullable   string `gorm:"column:is_nullable" json:"nullable"`
	PrimaryKey bool   `json:"primaryKey"`
}

type PrimaryKey struct {
	TableName  string `gorm:"column:table_name"`
	ColumnName string `gorm:"column:column_name"`
}

type Relationship struct {
	FromTable  string `gorm:"column:from_table" json:"fromTable"`
	FromColumn string `gorm:"column:from_column" json:"fromColumn"`
	ToTable    string `gorm:"column:to_table" json:"toTable"`
	ToColumn   string `gorm:"column:to_column" json:"toColumn"`
}

func GetDatabaseDetails(db *gorm.DB) (*DatabaseSchema, error) {
	var (
		tables        []Table
		columns       []Column
		primaryKeys   []PrimaryKey
		relationships []Relationship
	)

	// Get Tables
	err := db.Raw(constants.QueryTables).Scan(&tables).Error
	if err != nil {
		return nil, err
	}

	// Get Columns
	err = db.Raw(constants.QueryColumns).Scan(&columns).Error
	if err != nil {
		return nil, err
	}

	// Get primaryKeys
	err = db.Raw(constants.QueryPks).Scan(&primaryKeys).Error
	if err != nil {
		return nil, err
	}

	// Get Relationships
	err = db.Raw(constants.QueryRelations).Scan(&relationships).Error
	if err != nil {
		return nil, err
	}

	// Build Pk map

	pkMap := make(map[string]map[string]bool)

	for _, pk := range primaryKeys {
		if pkMap[pk.TableName] == nil {
			pkMap[pk.TableName] = make(map[string]bool)
		}
		pkMap[pk.TableName][pk.ColumnName] = true
	}

	// attach columns to tables

	colMap := make(map[string][]Column)

	for _, col := range columns {
		col.PrimaryKey = pkMap[col.TableName][col.Name]

		colMap[col.TableName] = append(colMap[col.TableName], col)
	}

	for i := range tables {
		tables[i].Columns = colMap[tables[i].Name]
	}

	return &DatabaseSchema{
		Tables:        tables,
		Relationships: relationships,
	}, nil
}
