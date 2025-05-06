// LoginPage.jsx
import React, { useState, useEffect } from 'react'
import '../styles/login.css'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
	const navigate = useNavigate()
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

	const handleLogin = async () => {
		
		const isEmailValid = validateEmail(email)
		const isPasswordFilled = password.trim() !== ''
	
		setEmailError(!isEmailValid)
		setPasswordError(!isPasswordFilled)
	
		if (isEmailValid && isPasswordFilled) {
			try {
				const response = await fetch('http://localhost:8080/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: email,
						password: password,
					}),
				})
	
				if (!response.ok) {
					alert('Неверный email или пароль')
					return
				}
	
				const data = await response.json()
				localStorage.setItem('token', data.token)
				window.location.href = '/'
			} catch (error) {
				console.error('Ошибка при входе:', error)
				alert('Произошла ошибка. Попробуйте позже.')
			}
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
				<button className='login-button google' onClick={() => navigate('/signup')}>Войти через Google</button>
			</div>
		</div>
	)
}

export default LoginPage
