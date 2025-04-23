import { Task } from '../pages/Dashboard'

export const getAllNotes = (tasks: Task[]): Task[] => {
	console.log('Получаем все задачи:', tasks) // Логируем задачи
	return tasks // Возвращаем задачи
}

// Функция для переключения статуса задачи
export const toggleCompleted = (tasks: Task[], taskId: number): Task[] => {
	console.log('Переключаем статус задачи с ID:', taskId) // Логируем ID задачи
	const updatedTasks = tasks.map(task =>
		task.id === taskId ? { ...task, completed: !task.completed } : task
	)
	console.log('Обновленные задачи после изменения статуса:', updatedTasks) // Логируем обновлённый список задач
	return updatedTasks // Возвращаем обновленные задачи
}

// Функция для удаления задачи
export const deleteTask = (tasks: Task[], taskId: number): Task[] => {
	console.log('Удаляем задачу с ID:', taskId) // Логируем ID удаляемой задачи
	const filteredTasks = tasks.filter(task => task.id !== taskId)
	console.log('Обновленный список задач после удаления:', filteredTasks) // Логируем обновленный список задач
	return filteredTasks // Возвращаем оставшиеся задачи
}
