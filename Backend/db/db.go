package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

// Init устанавливает подключение к PostgreSQL
func Init(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}
