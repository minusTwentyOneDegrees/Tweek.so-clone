package tasks

type Task struct {
	ID          int    `json:"id"`          // ID в БД
	Title       string `json:"title"`       // Текст задачи
	Description string `json:"description"` // Описание задачи
	Date        string `json:"date"`        // Дата (день) выполнения задачи
	Completed   bool   `json:"completed"`   // Выполнена ли задача
}
