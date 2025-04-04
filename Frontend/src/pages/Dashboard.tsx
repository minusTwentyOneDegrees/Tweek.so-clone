import React, { useState } from 'react'
import '../styles/dashboard.css'

const Dashboard = () => {
	const [features, setFeatures] = useState([
		{ id: 1, name: 'Dark Mode', enabled: true },
		{ id: 2, name: 'New Sidebar', enabled: false },
	])

	const [editingId, setEditingId] = useState<number | null>(null)
	const [newName, setNewName] = useState('')

	const toggleFeature = (id: number) => {
		setFeatures(
			features.map(f => (f.id === id ? { ...f, enabled: !f.enabled } : f))
		)
	}

	const startEditing = (id: number, name: string) => {
		setEditingId(id)
		setNewName(name)
	}

	const saveFeatureName = (id: number) => {
		setFeatures(features.map(f => (f.id === id ? { ...f, name: newName } : f)))
		setEditingId(null)
	}

	return (
		<div className='container'>
			<h1>Feature Flags</h1>
			<table>
				<thead>
					<tr>
						<th>Фича</th>
						<th>Статус</th>
						<th>Действие</th>
					</tr>
				</thead>
				<tbody>
					{features.map(feature => (
						<tr key={feature.id}>
							<td onClick={() => startEditing(feature.id, feature.name)}>
								{editingId === feature.id ? (
									<input
										type='text'
										value={newName}
										onChange={e => setNewName(e.target.value)}
										onBlur={() => saveFeatureName(feature.id)}
										onKeyDown={e =>
											e.key === 'Enter' && saveFeatureName(feature.id)
										}
										autoFocus
									/>
								) : (
									feature.name
								)}
							</td>
							<td>{feature.enabled ? 'Включено' : 'Выключено'}</td>
							<td>
								<button onClick={() => toggleFeature(feature.id)}>
									{feature.enabled ? 'Выключить' : 'Включить'}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default Dashboard
