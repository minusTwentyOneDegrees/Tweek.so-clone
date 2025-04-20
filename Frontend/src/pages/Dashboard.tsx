import React, { useState, useRef, useEffect } from 'react'
import '../styles/dashboard.css'

type Task = {
	id: number
	text: string
	completed: boolean
	note?: string
}

const Dashboard = () => {
	const [tasks, setTasks] = useState<Task[]>([
		{ id: 1, text: 'Сходить в магазин', completed: false },
		{ id: 2, text: 'Проверить почту', completed: false },
	])
	const [newTask, setNewTask] = useState('')
	const [draggedId, setDraggedId] = useState<number | null>(null)
	const [activeModalTask, setActiveModalTask] = useState<Task | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		inputRef.current?.focus()
	}, [tasks.length])

	const toggleCompleted = (id: number) => {
		setTasks(prev =>
			prev.map(task =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		)
	}

	const saveNewTask = () => {
		const trimmed = newTask.trim()
		if (trimmed) {
			const updatedTasks = [
				...tasks,
				{ id: Date.now(), text: trimmed, completed: false },
			]
			setTasks(updatedTasks)
			console.log(updatedTasks) // updatedTasks можно использовать, как массив для сохранения данных
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

	const handleDrop = () => setDraggedId(null)

	const handleTaskClick = (task: Task) => setActiveModalTask({ ...task })

	const closeModal = () => setActiveModalTask(null)

	const deleteTask = (id: number) => {
		setTasks(prev => prev.filter(task => task.id !== id))
		closeModal()
	}

	const updateTask = (key: keyof Task, value: string) => {
		if (!activeModalTask) return

		setActiveModalTask(prev => {
			const updatedTask = prev ? { ...prev, [key]: value } : null

			if (updatedTask?.note !== undefined) {
				const textarea = document.querySelector(
					'.modal-note'
				) as HTMLTextAreaElement
				if (textarea) {
					textarea.style.height = 'auto'
					textarea.style.height = `${textarea.scrollHeight}px`
				}
			}

			return updatedTask
		})
	}

	const toggleTaskCompletedInModal = () => {
		if (!activeModalTask) return

		const updatedTask = {
			...activeModalTask,
			completed: !activeModalTask.completed,
		}

		setTasks(prev =>
			prev.map(task => (task.id === activeModalTask.id ? updatedTask : task))
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
		<>
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
						<span className={`task-text ${task.completed ? 'completed' : ''}`}>
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
				<div
					className='task-item add-task'
					onDragOver={e => e.preventDefault()}
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
				</div>
			</div>

			{activeModalTask && (
				<div className='modal-overlay' onClick={closeModal}>
					<div className='modal' onClick={e => e.stopPropagation()}>
						<div className='modal-header'>
							<p>{new Date().toLocaleDateString()}</p>
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
		</>
	)
}

export default Dashboard
