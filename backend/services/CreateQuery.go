package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateQueryRequest struct {
	Selected map[string][]string `json:"selected"`
}

type RelEdge struct {
	FromTable  string
	FromColumn string
	ToTable    string
	ToColumn   string
}

func BuildQueryFromSchema(schema *DatabaseSchema, req *CreateQueryRequest) (string, error) {
	
	if req == nil || len(req.Selected) == 0 {
		return "", fmt.Errorf("Selected map cannot be empty")
	}

	if schema == nil {
		return "", fmt.Errorf("database schema is nil")
	}

	tableMap := make(map[string]map[string]bool)
	for _, t := range schema.Tables {
		colMap := make(map[string]bool)
		for _, c := range t.Columns {
			colMap[c.Name] = true
		}
		tableMap[t.Name] = colMap
	}

	var reqTables []string
	for tName := range req.Selected {
		reqTables = append(reqTables, tName)
	}
	sort.Strings(reqTables)

	var selectCols []string

	for _, tName := range reqTables {
		cols, exists := tableMap[tName]
		if !exists {
			return "", fmt.Errorf("table '%s' does not exist in schema", tName)
		}

		reqCols := req.Selected[tName]
		if len(reqCols) == 0 {
			return "", fmt.Errorf("no attributes specified for table '%s'", tName)
		}

		for _, col := range reqCols {
			if !cols[col] {
				return "", fmt.Errorf("attribute '%s' does not exist in table '%s'", col, tName)
			}
			selectCols = append(selectCols, fmt.Sprintf("%s.%s", quoteIdent(tName), quoteIdent(col)))
		}
	}

	if len(reqTables) == 1 {
		baseTable := reqTables[0]
		query := fmt.Sprintf("SELECT %s FROM %s;", strings.Join(selectCols, ", "), quoteIdent(baseTable))
		return query, nil
	}

	adj := make(map[string][]RelEdge)
	for _, r := range schema.Relationships {
		// Forward edge: from_table -> to_table
		adj[r.FromTable] = append(adj[r.FromTable], RelEdge{
			FromTable:  r.FromTable,
			FromColumn: r.FromColumn,
			ToTable:    r.ToTable,
			ToColumn:   r.ToColumn,
		})
		// Reverse edge: to_table -> from_table (mapping column names correctly to their respective tables)
		adj[r.ToTable] = append(adj[r.ToTable], RelEdge{
			FromTable:  r.ToTable,
			FromColumn: r.ToColumn,
			ToTable:    r.FromTable,
			ToColumn:   r.FromColumn,
		})
	}

	baseTable := reqTables[0]
	visited := make(map[string]bool)
	parentEdge := make(map[string]RelEdge)

	queue := []string{baseTable}
	visited[baseTable] = true

	for len(queue) > 0 {
		curr := queue[0] //qu.front()
		queue = queue[1:] //pop front()

		for _, edge := range adj[curr] {
			if !visited[edge.ToTable] {
				visited[edge.ToTable] = true
				parentEdge[edge.ToTable] = edge
				queue = append(queue, edge.ToTable)
			}
		}
	}

	for _, tName := range reqTables {
		if !visited[tName] {
			return "", fmt.Errorf("integrity constraint error: table '%s' cannot be connected via database relationships", tName)
		}
	}

	neededTables := make(map[string]bool)

	for _, tName := range reqTables {
		neededTables[tName] = true
		curr := tName
		for curr != baseTable {
			edge, ok := parentEdge[curr]
			if !ok {
				break
			}
			neededTables[edge.FromTable] = true
			curr = edge.FromTable
		}
	}

	included := map[string]bool{baseTable: true}
	var joinClauses []string

	for len(included) < len(neededTables) {
		progress := false

		var neededList []string
		for t := range neededTables {
			if !included[t] {
				neededList = append(neededList, t)
			}
		}
		sort.Strings(neededList)

		for _, t := range neededList {
			edge := parentEdge[t]
			if included[edge.FromTable] {
				clause := fmt.Sprintf("JOIN %s ON %s.%s = %s.%s",
					quoteIdent(edge.ToTable),
					quoteIdent(edge.FromTable), quoteIdent(edge.FromColumn),
					quoteIdent(edge.ToTable), quoteIdent(edge.ToColumn),
				)
				joinClauses = append(joinClauses, clause)
				included[edge.ToTable] = true
				progress = true
				break
			}
		}

		if !progress {
			return "", fmt.Errorf("failed to construct valid JOIN sequence for requested tables")
		}
	}

	query := fmt.Sprintf("SELECT %s FROM %s", strings.Join(selectCols, ", "), quoteIdent(baseTable))
	if len(joinClauses) > 0 {
		query += " " + strings.Join(joinClauses, " ")
	}
	query += ";"

	return query, nil
}

func CreateQuery(c *gin.Context, db *gorm.DB) (string, error) {
	if c.Request.Body == nil {
		return "", fmt.Errorf("request body is missing")
	}

	bodyBytes, err := io.ReadAll(c.Request.Body)
	
	if err != nil || len(bodyBytes) == 0 {
		return "", fmt.Errorf("request body is empty or invalid")
	}
	
	c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	var req CreateQueryRequest

	if err := json.Unmarshal(bodyBytes, &req); err == nil && len(req.Selected) > 0 {
	}else{
		return "", fmt.Errorf("invalid JSON body: please provide table attribute Selected, e.g. {\"car\": [\"id\", \"make\"]}")
	} 
	
	schema, err := GetDatabaseDetails(db)

	if err != nil {
		return "", fmt.Errorf("failed to retrieve database schema: %w", err)
	}

	return BuildQueryFromSchema(schema, &req)
}

func quoteIdent(s string) string {
	return "\"" + strings.ReplaceAll(s, "\"", "\"\"") + "\""
}