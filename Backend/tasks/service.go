package tasks

type Service struct {
	repo *Repository
}
//сервис используется для создания промежуточной логики между хендлером и бд, я не придумал логику поэтому пусть так будет
func NewService(r *Repository) *Service {
	return &Service{repo: r}
}

// Получить все задачи пользователя
func (s *Service) GetAllTasks(userID int) ([]Task, error) {
	return s.repo.GetAllByUser(userID)
}

// Создать задачу
func (s *Service) CreateTask(task Task, userID int) (int, error) {
	return s.repo.CreateTask(task, userID)
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
