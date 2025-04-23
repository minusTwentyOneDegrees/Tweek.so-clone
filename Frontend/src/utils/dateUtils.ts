export const getCurrentDate = () => {
	const now = new Date()
	return now.toISOString().split('T')[0]
}

export const getWeekDates = (baseDate: Date) => {
	const start = new Date(baseDate)
	start.setDate(start.getDate() - start.getDay() + 1) // Пн
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start)
		d.setDate(start.getDate() + i)
		return d.toISOString().split('T')[0]
	})
}

export const getDayName = (dateStr: string) => {
	const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
	const date = new Date(dateStr)
	return days[date.getDay()]
}

export const formatDateForHeader = (dateStr: string) => {
	const date = new Date(dateStr)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	return `${day}.${month}`
}

export const formatMonthYear = (dateStr: string) => {
	const months = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь',
	]
	const date = new Date(dateStr)
	const monthName = months[date.getMonth()]
	const year = date.getFullYear()
	return `${monthName} ${year}`
}
