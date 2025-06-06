package auth

import (
	"database/sql"
	"errors"
)

var (
	ErrUserExists   = errors.New("user already exists")
	ErrUserNotFound = errors.New("user not found")
)

type UserRepository interface {
	CreateUser(user User) error
	GetUserByUsername(username string) (User, error)
}

type PostgresUserRepo struct {
	db *sql.DB
}

func NewPostgresUserRepo(db *sql.DB) *PostgresUserRepo {
	return &PostgresUserRepo{db: db}
}

func (r *PostgresUserRepo) CreateUser(user User) error {
	_, err := r.db.Exec(
		"INSERT INTO users (username, password) VALUES ($1, $2)",
		user.Username, user.Password,
	)

	if err != nil {
		// Проверка на уникальность (можно уточнить по коду ошибки, если нужно)
		return ErrUserExists
	}

	return nil
}

func (r *PostgresUserRepo) GetUserByUsername(username string) (User, error) {
	row := r.db.QueryRow(
		"SELECT id, username, password FROM users WHERE username = $1",
		username,
	)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Password)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return User{}, ErrUserNotFound
		}
		return User{}, err
	}

	return user, nil
}
