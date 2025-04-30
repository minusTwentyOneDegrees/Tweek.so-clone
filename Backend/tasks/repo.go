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
        SELECT id, title, date, completed
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
		if err := rows.Scan(&t.ID, &t.Title, &t.Date, &t.Completed); err != nil {
			return nil, err
		}

		subtasks, err := r.getSubtasksByTaskID(t.ID)
		if err != nil {
			return nil, err
		}

		t.Subtasks = subtasks
		tasks = append(tasks, t)
	}

	return tasks, nil
}

// Создать задачу и подзадачи
func (r *Repository) CreateTask(task Task, userID int) error {
	var taskID int
	err := r.db.QueryRow(`
        INSERT INTO tasks (title, date, completed, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, task.Title, task.Date, task.Completed, userID).Scan(&taskID)
	if err != nil {
		return err
	}

	for _, sub := range task.Subtasks {
		_, err := r.db.Exec(`
            INSERT INTO subtasks (title, completed, task_id)
            VALUES ($1, $2, $3)
        `, sub.Title, sub.Completed, taskID)
		if err != nil {
			return err
		}
	}

	return nil
}

// Обновить задачу
func (r *Repository) Update(task Task) error {
	_, err := r.db.Exec(`
        UPDATE tasks
        SET title = $1, date = $2, completed = $3
        WHERE id = $4
    `, task.Title, task.Date, task.Completed, task.ID)
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

// Получить подзадачи по ID задачи
func (r *Repository) getSubtasksByTaskID(taskID int) ([]Subtask, error) {
	rows, err := r.db.Query(`
        SELECT id, title, completed
        FROM subtasks
        WHERE task_id = $1
        ORDER BY id
    `, taskID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subtasks []Subtask
	for rows.Next() {
		var s Subtask
		if err := rows.Scan(&s.ID, &s.Title, &s.Completed); err != nil {
			return nil, err
		}
		subtasks = append(subtasks, s)
	}

	return subtasks, nil
}
