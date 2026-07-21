package services

import "gorm.io/gorm"

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
	queryTables := `SELECT
			table_schema AS schema,
			table_name AS name
			FROM information_schema.tables
			WHERE table_type = 'BASE TABLE'
			AND table_schema NOT IN ('pg_catalog','information_schema')
			ORDER BY table_schema, table_name;`

	err := db.Raw(queryTables).Scan(&tables).Error
	if err != nil {
		return nil, err
	}

	// Get Columns

	queryColumns := `
		SELECT
			table_name,
			column_name,
			data_type,
			is_nullable
		FROM information_schema.columns
		WHERE table_schema NOT IN ('pg_catalog','information_schema')
		ORDER BY table_name, ordinal_position;
	`

	err = db.Raw(queryColumns).Scan(&columns).Error
	if err != nil {
		return nil, err
	}

	// Get primaryKeys
	queryPks := `
		SELECT
			tc.table_name,
			kcu.column_name
		FROM information_schema.table_constraints tc
		JOIN information_schema.key_column_usage kcu
			ON tc.constraint_name = kcu.constraint_name
		WHERE tc.constraint_type = 'PRIMARY KEY';
	`
	err = db.Raw(queryPks).Scan(&primaryKeys).Error
	if err != nil {
		return nil, err
	}

	// Get Relationships

	queryRelations := `
		SELECT
			tc.table_name AS from_table,
			kcu.column_name AS from_column,
			ccu.table_name AS to_table,
			ccu.column_name AS to_column
		FROM information_schema.table_constraints tc
		JOIN information_schema.key_column_usage kcu
			ON tc.constraint_name = kcu.constraint_name
		JOIN information_schema.constraint_column_usage ccu
			ON tc.constraint_name = ccu.constraint_name
		WHERE tc.constraint_type = 'FOREIGN KEY';
	`
	err = db.Raw(queryRelations).Scan(&relationships).Error
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
