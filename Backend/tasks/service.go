package tasks

type Service struct {
	repo *Repository
}

func NewService(r *Repository) *Service {
	return &Service{repo: r}
}

// Получить все задачи
func (s *Service) GetAllTasks() ([]Task, error) {
	return s.repo.GetAll()
}

// Получить одну задачу
func (s *Service) GetTaskByID(id int) (*Task, error) {
	return s.repo.GetByID(id)
}

// Создать задачу
func (s *Service) CreateTask(task Task) error {
	return s.repo.Create(task)
}

// Обновить задачу
func (s *Service) UpdateTask(id int, updated Task) error {
	updated.ID = id
	return s.repo.Update(updated)
}

// Удалить задачу
func (s *Service) DeleteTask(id int) error {
	return s.repo.Delete(id)
}
