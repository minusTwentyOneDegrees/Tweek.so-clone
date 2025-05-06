import React, { useState, useRef, useEffect } from 'react'
import '../styles/dashboard.css'
import {
	getCurrentDate,
	getWeekDates,
	getDayName,
	formatDateForHeader,
	formatMonthYear,
} from '../utils/dateUtils'

import {
	handleTaskClick,
	closeModal,
	toggleTaskCompletedInModal,
} from '../utils/modalUtils'

import { useNavigate } from 'react-router-dom'

export type Task = {
	id: number
	title: string
	completed: boolean
	description?: string
	date: string
}

//... Тут можешь написать функцию, которая будет записывать данные в массив
//Но только обеспечь её условия, чтобы она отрабатывала первее всего

//Функция, которая берёт все заметки
const getAllNotes = (tasks: Task[]) => {
	return tasks
		.filter(task => task.title && task.title.trim() !== '')
		.map(task => task.title)
}

const Dashboard = () => {
	const navigate = useNavigate()

	const [tasks, setTasks] = useState<Task[]>([])
	const [newTaskPerDate, setNewTaskPerDate] = useState<Record<string, string>>(
		{}
	)
	const [draggedTask, setDraggedTask] = useState<Task | null>(null)
	const [draggedOverTask, setDraggedOverTask] = useState<Task | null>(null)
	const [activeModalTask, setActiveModalTask] = useState<Task | null>(null)
	const [currentDate, setCurrentDate] = useState<Date>(new Date())

	const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

	const weekDates = getWeekDates(currentDate)
	const headerMonth = formatMonthYear(weekDates[0])
	console.log('Данные задач:', tasks);
	console.log('Даты для сравнения:', weekDates);


	useEffect(() => {
		if (tasks.length > 0) {
			console.log('Все заметки:', tasks)
			const notes = getAllNotes(tasks)
			console.log('Все заметки:', notes)
		}
	}, [tasks])
	// Тут можно подгружать данные, всё это отрабаетывает в самом начале
	useEffect(() => {
		// подгрузка данных 
		const fetchTasks = async () => {
			const token = localStorage.getItem('token')
			if (!token) {
				navigate('/login')
				return
			}
		
			try {
				const response = await fetch('http://localhost:8080/api/tasks', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
		
				if (response.status === 401) {
					localStorage.removeItem('token')
					navigate('/login')
					return
				}
		
				if (!response.ok) throw new Error('Ошибка загрузки задач')
		
				const data = await response.json()
		
				// 🟡 Обрезаем время: берём только YYYY-MM-DD
				const normalizedTasks = data.map((task: Task) => ({
					...task,
					date: task.date.slice(0, 10), // ← ключевая строка!
				}))
		
				console.log('Нормализованные задачи:', normalizedTasks)
				setTasks(normalizedTasks)
			} catch (error) {
				console.error(error)
			}
		}
		


		document.title = 'My calendar — Tweek.so' // Заголовок страницы

		const link = document.querySelector("link[rel='icon']") as HTMLLinkElement
		if (link) {
			link.href = '/img/faviconv2.ico' // Путь к иконке
		}
		fetchTasks()
	}, [])	

	const handleAddTask = async (date: string) => {
		const newTaskText = newTaskPerDate[date]?.trim()
		if (newTaskText) {
			const tempTask = {
				title: newTaskText,
				description: '',
				completed: false,
				date: date,
			}
	
			try {
				const token = localStorage.getItem('token')
				const response = await fetch('http://localhost:8080/api/tasks', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(tempTask),
				})
	
				const data = await response.json()
				const realTask = { id: data.id, ...tempTask }
	
				setTasks(prev => [...prev, realTask])
				setNewTaskPerDate(prev => ({ ...prev, [date]: '' }))
			} catch (error) {
				console.error(error)
			}
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

	const handleDrop = async (targetDate: string) => {
		if (!draggedTask) return
	  
		// Обновляем только в том случае, если дата изменилась
		if (draggedTask.date !== targetDate) {
		  const updatedTask = { ...draggedTask, date: targetDate }
	  
		  try {
			const token = localStorage.getItem('token')
			if (!token) {
			  console.error("No token found")
			  return
			}
	  
			// Отправляем обновленную задачу на сервер
			const response = await fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
			  method: 'PUT',
			  headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			  },
			  body: JSON.stringify(updatedTask),
			})
	  
			if (!response.ok) throw new Error('Ошибка при обновлении задачи на сервере')
	  
			// Если обновление прошло успешно, обновляем состояние задач локально
			const updatedTasks = tasks.filter(t => t.id !== draggedTask.id)
			updatedTasks.push(updatedTask)
	  
			setTasks(updatedTasks)
			console.log("Обновленные задачи после перетаскивания:", updatedTasks)
		  } catch (error) {
			console.error("Ошибка при перетаскивании задачи:", error)
		  }
		} else {
		  // Если дата не изменилась, просто меняем её местоположение в списке
		  const updatedTasks = tasks.filter(t => t.id !== draggedTask.id)
		  const targetIndex = tasks.indexOf(draggedOverTask!)
		  updatedTasks.splice(targetIndex, 0, draggedTask)
		  setTasks(updatedTasks)
		  console.log(updatedTasks) // Данные по перемещённой задаче + списку
		}
	  
		// Сбрасываем состояние перетаскивания
		setDraggedTask(null)
		setDraggedOverTask(null)
	  }
	  

	const toggleCompleted = async (id: number) => {
		const task = tasks.find(t => t.id === id)
		if (!task) return
	
		const updatedTask = { ...task, completed: !task.completed }
	
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedTask),
			})
	
			if (!response.ok) throw new Error('Ошибка обновления')
		} catch (error) {
			console.error(error)
		}
		setTasks(prev =>
			prev.map(task =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		)
	}
	

	const deleteTask = async (id: number) => {
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
	
			if (!response.ok) throw new Error('Ошибка удаления задачи')
			closeModal(setActiveModalTask)
		} catch (error) {
			console.error(error)
		}
		setTasks(prev => prev.filter(task => task.id !== id))
	}
	

	const updateTask = async (key: keyof Task, value: string) => {
		if (!activeModalTask) return
	
		const updatedTask = { ...activeModalTask, [key]: value }
	
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedTask),
			})
	
			if (!response.ok) throw new Error('Ошибка при обновлении')
	
			setActiveModalTask(updatedTask)
		} catch (error) {
			console.error(error)
		}
	}
	

	useEffect(() => {
		if (!activeModalTask) return
		setTasks(prev =>
			prev.map(task =>
				task.id === activeModalTask.id ? activeModalTask : task
			)
		)
	}, [activeModalTask])

	const handleWeekChange = (direction: 'prev' | 'next') => {
		const newDate = new Date(currentDate)
		if (direction === 'prev') {
			newDate.setDate(newDate.getDate() - 7)
		} else if (direction === 'next') {
			newDate.setDate(newDate.getDate() + 7)
		}
		setCurrentDate(newDate)
	}

	return (
		<div className='dashboard'>
			<div className='dashboard-header'>
				<span className='month-year'>{headerMonth}</span>
				<div className='nav-buttons'>
					<button
						className='nav-button'
						onClick={() => handleWeekChange('prev')}
					>
						&lt;
					</button>
					<button
						className='nav-button'
						onClick={() => handleWeekChange('next')}
					>
						&gt;
					</button>
				</div>
			</div>

			<div className='task-list'>
				{weekDates.map(date => {
					const isToday = date === getCurrentDate()

					return (
						<div
							key={date}
							className='day-column'
							onDrop={() => handleDrop(date)}
							onDragOver={e => e.preventDefault()}
						>
							<div className={`day-header ${isToday ? 'today' : ''}`}>
								<span className='date'>{formatDateForHeader(date)}</span>
								<span className='day'>{getDayName(date)}</span>
							</div>
							<hr className={`day-separator ${isToday ? 'today' : ''}`} />
							{tasks
								.filter(task => task.date === date)
								.map(task => (
									<div
										className={`task-item ${
											draggedTask?.id === task.id ? 'dragging' : ''
										}`}
										key={task.id}
										draggable
										onDragStart={() => handleDragStart(task)}
										onDragOver={e => handleDragOver(e, task)}
										onClick={() => handleTaskClick(task, setActiveModalTask)}
									>
										<img
											className={`checkbox ${
												task.description?.trim() ? 'visible' : ''
											}`}
											src={
												task.completed ? '/img/MetkaGr.svg' : '/img/Metka.svg'
											}
											alt='checkbox'
											style={{
												display:
													task.description === undefined || task.description.trim() === ''
														? 'none'
														: 'inline-block',
											}}
										/>
										<span
											className={`task-text ${
												task.completed ? 'completed' : ''
											}`}
										>
											{task.title}
										</span>
										<div
											className={`check-icon ${
												task.completed ? 'completed' : ''
											}`}
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
										if (el) inputRefs.current[date] = el
									}}
									type='title'
									className='task-input'
									value={newTaskPerDate[date] || ''}
									onChange={e =>
										setNewTaskPerDate(prev => ({
											...prev,
											[date]: e.target.value,
										}))
									}
									onBlur={() => handleAddTask(date)}
									onKeyDown={e => handleKeyDown(e, date)}
									placeholder=''
								/>
							</div>
						</div>
					)
				})}
			</div>

			{activeModalTask && (
				<div
					className='modal-overlay'
					onClick={() => closeModal(setActiveModalTask)}
				>
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
								type='title'
								value={activeModalTask.title}
								onChange={e => updateTask('title', e.target.value)}
							/>
							{String(activeModalTask.description).trim() !== '' && (
								<div
									className={`check-icon ${
										activeModalTask.completed ? 'completed' : ''
									}`}
									onClick={() =>
										toggleTaskCompletedInModal(
											activeModalTask,
											setTasks,
											setActiveModalTask
										)
									}
								>
									✔
								</div>
							)}
						</div>
						<hr />
						<textarea
							className='modal-note'
							placeholder='Добавить дополнительные заметки ...'
							value={activeModalTask.description || ''}
							onChange={e => updateTask('description', e.target.value)}
						></textarea>
					</div>
				</div>
			)}
		</div>
	)
}

export default Dashboard
