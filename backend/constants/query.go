package constants

const (
	QueryTables = `SELECT
			table_schema AS schema,
			table_name AS name
			FROM information_schema.tables
			WHERE table_type = 'BASE TABLE'
			AND table_schema NOT IN ('pg_catalog','information_schema')
			ORDER BY table_schema, table_name;`
	QueryColumns = `
		SELECT
			table_name,
			column_name,
			data_type,
			is_nullable
		FROM information_schema.columns
		WHERE table_schema NOT IN ('pg_catalog','information_schema')
		ORDER BY table_name, ordinal_position;`

	QueryPks = `
		SELECT
			tc.table_name,
			kcu.column_name
		FROM information_schema.table_constraints tc
		JOIN information_schema.key_column_usage kcu
			ON tc.constraint_name = kcu.constraint_name
		WHERE tc.constraint_type = 'PRIMARY KEY';
	`
	QueryRelations = `
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
)
