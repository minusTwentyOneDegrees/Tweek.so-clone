import React, { useState, useRef, useEffect } from 'react'
import '../styles/dashboard.css'

type Task = {
	id: number
	text: string
	completed: boolean
	note?: string
	date: string // формат YYYY-MM-DD
}

const getCurrentDate = () => {
	const now = new Date()
	return now.toISOString().split('T')[0]
}

const getWeekDates = () => {
	const start = new Date()
	start.setDate(start.getDate() - start.getDay() + 1) // Пн
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start)
		d.setDate(start.getDate() + i)
		return d.toISOString().split('T')[0]
	})
}

const getDayName = (dateStr: string) => {
	const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
	const date = new Date(dateStr)
	return days[date.getDay()]
}

const Dashboard = () => {
	const [tasks, setTasks] = useState<Task[]>([])
	const [newTaskPerDate, setNewTaskPerDate] = useState<Record<string, string>>(
		{}
	)
	const [draggedTask, setDraggedTask] = useState<Task | null>(null)
	const [draggedOverTask, setDraggedOverTask] = useState<Task | null>(null)
	const [activeModalTask, setActiveModalTask] = useState<Task | null>(null)

	const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

	const weekDates = getWeekDates()

	const handleAddTask = (date: string) => {
		const newTaskText = newTaskPerDate[date]?.trim()
		if (newTaskText) {
			const updatedTasks = [
				...tasks,
				{ id: Date.now(), text: newTaskText, completed: false, date },
			]
			setTasks(updatedTasks)
			setNewTaskPerDate(prev => ({ ...prev, [date]: '' }))
		}
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		date: string
	) => {
		if (e.key === 'Enter') handleAddTask(date)
	}

	const handleDragStart = (task: Task) => {
		setDraggedTask(task)
	}

	const handleDragOver = (e: React.DragEvent, task: Task) => {
		e.preventDefault()
		setDraggedOverTask(task)
	}

	const handleDrop = (targetDate: string) => {
		if (!draggedTask) return

		if (draggedTask.date === targetDate) {
			// Перемещаем задачу внутри одного дня
			const updatedTasks = tasks.filter(t => t.id !== draggedTask.id)
			const targetIndex = tasks.indexOf(draggedOverTask!)
			updatedTasks.splice(targetIndex, 0, draggedTask)
			setTasks(updatedTasks)
		} else {
			// Перемещаем задачу между днями
			setTasks(prev =>
				prev.map(t =>
					t.id === draggedTask.id ? { ...t, date: targetDate } : t
				)
			)
		}

		setDraggedTask(null)
		setDraggedOverTask(null)
	}

	const toggleCompleted = (id: number) => {
		setTasks(prev =>
			prev.map(task =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		)
	}

	const handleTaskClick = (task: Task) => setActiveModalTask({ ...task })

	const closeModal = () => setActiveModalTask(null)

	const deleteTask = (id: number) => {
		setTasks(prev => prev.filter(task => task.id !== id))
		closeModal()
	}

	const updateTask = (key: keyof Task, value: string) => {
		if (!activeModalTask) return
		setActiveModalTask(prev => (prev ? { ...prev, [key]: value } : null))
	}

	const toggleTaskCompletedInModal = () => {
		if (!activeModalTask) return
		const updatedTask = {
			...activeModalTask,
			completed: !activeModalTask.completed,
		}
		setTasks(prev =>
			prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
		)
		setActiveModalTask(updatedTask)
	}

	useEffect(() => {
		if (!activeModalTask) return
		setTasks(prev =>
			prev.map(task =>
				task.id === activeModalTask.id ? activeModalTask : task
			)
		)
	}, [activeModalTask])

	return (
		<div className='task-list'>
			{weekDates.map(date => (
				<div
					key={date}
					className='day-column'
					onDrop={() => handleDrop(date)}
					onDragOver={e => e.preventDefault()}
				>
					<div className='day-header'>
						<span className='date'>{date}</span>
						<span className='day'>{getDayName(date)}</span>
					</div>
					<hr className='day-separator' />
					{tasks
						.filter(task => task.date === date)
						.map((task, index) => (
							<div
								className={`task-item ${
									draggedTask?.id === task.id ? 'dragging' : ''
								}`}
								key={task.id}
								draggable
								onDragStart={() => handleDragStart(task)}
								onDragOver={e => handleDragOver(e, task)}
								onClick={() => handleTaskClick(task)}
							>
								<img
									className={`checkbox ${task.note?.trim() ? 'visible' : ''}`}
									src={task.completed ? '/img/MetkaGr.svg' : '/img/Metka.svg'}
									alt='checkbox'
									style={{
										display:
											task.note === undefined || task.note.trim() === ''
												? 'none'
												: 'inline-block',
									}}
								/>
								<span
									className={`task-text ${task.completed ? 'completed' : ''}`}
								>
									{task.text}
								</span>
								<div
									className={`check-icon ${task.completed ? 'completed' : ''}`}
									onClick={e => {
										e.stopPropagation()
										toggleCompleted(task.id)
									}}
								>
									✔
								</div>
							</div>
						))}
					<div className='task-item add-task'>
						<div className='checkbox' />
						<input
							ref={el => {
								if (el) {
									inputRefs.current[date] = el
								}
							}}
							type='text'
							className='task-input'
							value={newTaskPerDate[date] || ''}
							onChange={e =>
								setNewTaskPerDate(prev => ({ ...prev, [date]: e.target.value }))
							}
							onBlur={() => handleAddTask(date)}
							onKeyDown={e => handleKeyDown(e, date)}
							placeholder='Новая задача'
						/>
					</div>
				</div>
			))}

			{activeModalTask && (
				<div className='modal-overlay' onClick={closeModal}>
					<div className='modal' onClick={e => e.stopPropagation()}>
						<div className='modal-header'>
							<p>{activeModalTask.date}</p>
							<div
								className='delete-icon'
								onClick={() => deleteTask(activeModalTask.id)}
							>
								<img src='/img/Basket.svg' alt='Delete' />
							</div>
						</div>

						<div className='modal-body'>
							<input
								className='modal-title'
								type='text'
								value={activeModalTask.text}
								onChange={e => updateTask('text', e.target.value)}
							/>
							{String(activeModalTask.note).trim() !== '' && (
								<div
									className={`check-icon ${
										activeModalTask.completed ? 'completed' : ''
									}`}
									onClick={toggleTaskCompletedInModal}
								>
									✔
								</div>
							)}
						</div>
						<hr />
						<textarea
							className='modal-note'
							placeholder='Добавить дополнительные заметки ...'
							value={activeModalTask.note || ''}
							onChange={e => updateTask('note', e.target.value)}
						></textarea>
					</div>
				</div>
			)}
		</div>
	)
}

export default Dashboard
