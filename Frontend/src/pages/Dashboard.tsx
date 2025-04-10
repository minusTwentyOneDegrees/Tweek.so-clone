import React, { useState, useRef, useEffect } from 'react'
import '../styles/dashboard.css'

type Task = {
	id: number
	text: string
	completed: boolean
}

const Dashboard = () => {
	const [tasks, setTasks] = useState<Task[]>([
		{ id: 1, text: 'Сходить в магазин', completed: false },
		{ id: 2, text: 'Проверить почту', completed: false },
	])
	const [newTask, setNewTask] = useState('')
	const [draggedId, setDraggedId] = useState<number | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [tasks.length])

	const toggleCompleted = (id: number) => {
		setTasks(
			tasks.map(task =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		)
	}

	const saveNewTask = () => {
		const trimmed = newTask.trim()
		if (trimmed) {
			setTasks([...tasks, { id: Date.now(), text: trimmed, completed: false }])
		}
		setNewTask('')
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') saveNewTask()
	}

	const handleDragStart = (id: number) => {
		setDraggedId(id)
	}

	const handleDragOver = (
		e: React.DragEvent<HTMLDivElement>,
		overId: number
	) => {
		e.preventDefault()
		if (draggedId === null || draggedId === overId) return

		const draggedIndex = tasks.findIndex(t => t.id === draggedId)
		const overIndex = tasks.findIndex(t => t.id === overId)
		if (overIndex === -1) return

		const updated = [...tasks]
		const [draggedItem] = updated.splice(draggedIndex, 1)
		updated.splice(overIndex, 0, draggedItem)
		setTasks(updated)
	}

	const handleDrop = () => {
		setDraggedId(null)
	}

	return (
		<div className='task-list'>
			{tasks.map(task => (
				<div
					className={`task-item ${draggedId === task.id ? 'dragging' : ''}`}
					key={task.id}
					draggable
					onDragStart={() => handleDragStart(task.id)}
					onDragOver={e => handleDragOver(e, task.id)}
					onDrop={handleDrop}
					onDragEnd={handleDrop}
				>
					<img
						className='checkbox'
						src={task.completed ? '/img/MetkaGr.svg' : '/img/Metka.svg'} // Подгрузка изображений. Тут изменять!!!
						alt='checkbox'
					/>
					<span className={`task-text ${task.completed ? 'completed' : ''}`}>
						{task.text}
					</span>
					<div
						className={`check-icon ${task.completed ? 'completed' : ''}`}
						onClick={() => toggleCompleted(task.id)}
					>
						✔
					</div>
				</div>
			))}

			<div
				className='task-item add-task'
				onDragOver={e => {
					e.preventDefault()
				}}
				onDrop={handleDrop}
			>
				<div className='checkbox' />
				<input
					ref={inputRef}
					type='text'
					className='task-input'
					value={newTask}
					onChange={e => setNewTask(e.target.value)}
					onBlur={saveNewTask}
					onKeyDown={handleKeyDown}
					placeholder='Новая задача'
				/>
				<div className='check-icon'>✔</div>
			</div>
		</div>
	)
}

export default Dashboard
