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

export type Task = {
	id: number
	text: string
	completed: boolean
	note?: string
	date: string
}

//... Тут можешь написать функцию, которая будет записывать данные в массив
//Но только обеспечь её условия, чтобы она отрабатывала первее всего
//Функция, которая берёт все заметки
const getAllNotes = (tasks: Task[]) => {
	return tasks
		.filter(task => task.note && task.note.trim() !== '')
		.map(task => task.note)
}

const Dashboard = () => {
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

	// Тут можно подгружать данные, всё это отрабаетывает в самом начале
	useEffect(() => {
		document.title = 'My calendar — Tweek.so' // Заголовок страницы

		const link = document.querySelector("link[rel='icon']") as HTMLLinkElement
		if (link) {
			link.href = '/img/faviconv2.ico' // Путь к иконке
		}
		const notes = getAllNotes(tasks)
		console.log('Все заметки:', notes) // Вывод всех заметок в консоль
	}, [])

	const handleAddTask = (date: string) => {
		const newTaskText = newTaskPerDate[date]?.trim()
		if (newTaskText) {
			const updatedTasks = [
				...tasks,
				{ id: Date.now(), text: newTaskText, completed: false, date },
			]
			console.log(updatedTasks) // Данные по списку добавленных задач
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

		if (draggedTask.date !== targetDate) {
			const updatedTasks = tasks.filter(t => t.id !== draggedTask.id)
			const updatedDraggedTask = { ...draggedTask, date: targetDate }
			updatedTasks.push(updatedDraggedTask)
			setTasks(updatedTasks)
			console.log(updatedTasks) // Данные по перемещённой задаче + списку
		} else {
			const updatedTasks = tasks.filter(t => t.id !== draggedTask.id)
			const targetIndex = tasks.indexOf(draggedOverTask!)
			updatedTasks.splice(targetIndex, 0, draggedTask)
			setTasks(updatedTasks)
			console.log(updatedTasks) // Данные по перемещённой задаче + списку
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
		console.log(
			`Completed Task With ID: ${id}, completed: ${!tasks.find(
				task => task.id === id
			)?.completed}` //ID той задачи, которая была "Выполнена" вне модального ока
		)
	}

	const deleteTask = (id: number) => {
		setTasks(prev => prev.filter(task => task.id !== id))
		console.log('Deleted Task With ID: ' + id) // Данные по удалённой задачке
		closeModal(setActiveModalTask)
	}

	const updateTask = (key: keyof Task, value: string) => {
		if (!activeModalTask) return
		console.log(`Task ID: ${activeModalTask.id}, Updating ${key} to:`, value) // Данные по изменениями заметок
		setActiveModalTask(prev => (prev ? { ...prev, [key]: value } : null))
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
												task.note?.trim() ? 'visible' : ''
											}`}
											src={
												task.completed ? '/img/MetkaGr.svg' : '/img/Metka.svg'
											}
											alt='checkbox'
											style={{
												display:
													task.note === undefined || task.note.trim() === ''
														? 'none'
														: 'inline-block',
											}}
										/>
										<span
											className={`task-text ${
												task.completed ? 'completed' : ''
											}`}
										>
											{task.text}
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
									type='text'
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
								type='text'
								value={activeModalTask.text}
								onChange={e => updateTask('text', e.target.value)}
							/>
							{String(activeModalTask.note).trim() !== '' && (
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
