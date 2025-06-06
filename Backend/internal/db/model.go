package db

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"` // в базе будет хэш
}


type Task struct {
	ID          int    `json:"id"`          // ID в БД
	Title       string `json:"title"`       // Текст задачи
	Description string `json:"description"` // Описание задачи
	Date        string `json:"date"`        // Дата (день) выполнения задачи
	Completed   bool   `json:"completed"`   // Выполнена ли задача
}
