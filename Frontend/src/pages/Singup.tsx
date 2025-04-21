import React, { useState, useEffect } from 'react'
import '../styles/login.css'

const SignupPage = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailError, setEmailError] = useState(false)
	const [passwordError, setPasswordError] = useState(false)

	useEffect(() => {
		document.title = 'Sign Up Tweek.so'
		const link = document.querySelector("link[rel='icon']")
		if (link instanceof HTMLLinkElement) {
			link.href = '/img/faviconv2.ico'
		}
	}, [])

	const validateEmail = (email: string): boolean => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	const handleSignup = () => {
		const isEmailValid = validateEmail(email)
		const isEmailFilled = email.trim() !== ''
		const isPasswordFilled = password.trim() !== ''

		setEmailError(!isEmailFilled || !isEmailValid)
		setPasswordError(!isPasswordFilled)

		if (isEmailValid && isPasswordFilled) {
			// Данные для вывода в бэк
			console.log('Name:', name)
			console.log('Email:', email)
			console.log('Password:', password)
		}
	}

	return (
		<div className='login-page'>
			<div className='login-box'>
				<h2 className='login-title'>Регистрация</h2>
				<input
					type='text'
					placeholder='Имя'
					className='input-field'
					value={name}
					onChange={e => setName(e.target.value)}
				/>
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
				<button className='login-button' onClick={handleSignup}>
					Зарегистрироваться
				</button>
				<button className='login-button google'>
					Зарегистрироваться через Google
				</button>
			</div>
		</div>
	)
}

export default SignupPage
