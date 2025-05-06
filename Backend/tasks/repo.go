package tasks

import (
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

// Получить все задачи пользователя
func (r *Repository) GetAllByUser(userID int) ([]Task, error) {
	rows, err := r.db.Query(`
	SELECT id, title, description, date, completed
	FROM tasks
	WHERE user_id = $1
	ORDER BY date
`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task

	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Title, &t.Description, &t.Date, &t.Completed); err != nil {
			return nil, err
		}

		tasks = append(tasks, t)
	}

	return tasks, nil
}

// Создать задачу
func (r *Repository) CreateTask(task Task, userID int) (int, error) {
	var taskID int
	err := r.db.QueryRow(`
		INSERT INTO tasks (title, description, date, completed, user_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`, task.Title, task.Description, task.Date, task.Completed, userID).Scan(&taskID)
	if err != nil {
		return 0, err
	}

	return taskID, nil
}

// Обновить задачу
func (r *Repository) Update(task Task) error {
	_, err := r.db.Exec(`
	UPDATE tasks
	SET title = $1, description = $2, date = $3, completed = $4
	WHERE id = $5
`, task.Title, task.Description, task.Date, task.Completed, task.ID)
	return err
}

// Удалить задачу
func (r *Repository) Delete(id int) error {
	_, err := r.db.Exec(`
        DELETE FROM tasks
        WHERE id = $1
    `, id)
	return err
}
