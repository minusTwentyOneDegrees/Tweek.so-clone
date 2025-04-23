import { Task } from '../pages/Dashboard'

export const handleTaskClick = (
	task: Task,
	setActiveModalTask: React.Dispatch<React.SetStateAction<Task | null>>
) => {
	setActiveModalTask({ ...task })
}

export const closeModal = (
	setActiveModalTask: React.Dispatch<React.SetStateAction<Task | null>>
) => {
	setActiveModalTask(null)
}

export const toggleTaskCompletedInModal = (
	activeModalTask: Task | null,
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
	setActiveModalTask: React.Dispatch<React.SetStateAction<Task | null>>
) => {
	if (!activeModalTask) return

	const updatedTask = {
		...activeModalTask,
		completed: !activeModalTask.completed,
	}

	console.log(
		`Completed Task with ID: ${updatedTask.id}, Completed: ${updatedTask.completed}` // Вот тут вот вывод завершённой задачи с модального окна
	)

	setTasks(prev =>
		prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
	)

	setActiveModalTask(updatedTask)
}
