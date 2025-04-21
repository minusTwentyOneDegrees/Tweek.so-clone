// LoginPage.jsx
import React, { useState, useEffect } from 'react'
import '../styles/login.css'

const LoginPage = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)

	useEffect(() => {
		document.title = 'Login Tweek.so'
		const link = document.querySelector("link[rel='icon']")
		if (link instanceof HTMLLinkElement) {
			link.href = '/img/faviconv2.ico'
		}
	}, [])

	const validateEmail = (email: string): boolean => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	const handleLogin = () => {
		const isEmailValid = validateEmail(email)
		const isPasswordFilled = password.trim() !== ''
		const isEmailFilled = email.trim() !== ''

		setEmailError(!isEmailFilled || !isEmailValid)
		setPasswordError(!isPasswordFilled)

		if (isEmailFilled && isEmailValid && isPasswordFilled) {
			// Данные для вывода в бэк
			console.log('Email:', email)
			console.log('Password:', password)
		}
	}

	return (
		<div className='login-page'>
			<div className='login-box'>
				<h2 className='login-title'>Вход</h2>
				<input
					type='email'
					placeholder='Email'
					className={`input-field ${emailError ? 'error' : ''}`}
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Пароль'
					className={`input-field ${passwordError ? 'error' : ''}`}
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button className='login-button' onClick={handleLogin}>
					Вход
				</button>
				<button className='login-button google'>Войти через Google</button>
			</div>
		</div>
	)
}

export default LoginPage
