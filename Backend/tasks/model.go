package tasks

import "time"

// Subtask — подзадача
type Subtask struct {
	ID        int    `json:"id"`        // можно для frontend обновления
	Title     string `json:"title"`     // текст подзадачи
	Completed bool   `json:"completed"` // выполнена или нет
}

// Task — основная задача
type Task struct {
	ID        int       `json:"id"`        // ID в БД
	Title     string    `json:"title"`     // Текст задачи
	Date      time.Time `json:"date"`      // Дата (день) выполнения задачи
	Completed bool      `json:"completed"` // Выполнена ли задача в целом
	Subtasks  []Subtask `json:"subtasks"`  // Массив подзадач
}
