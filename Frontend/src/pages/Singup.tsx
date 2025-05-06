import React, { useState, useEffect } from 'react'
import '../styles/login.css'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
	const navigate = useNavigate()
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

	const handleSignup = async () => {
		const isEmailValid = validateEmail(email)
		const isPasswordFilled = password.trim() !== ''
		const isEmailFilled = email.trim() !== ''
	
		setEmailError(!isEmailFilled || !isEmailValid)
		setPasswordError(!isPasswordFilled)
	
		if (isEmailValid && isPasswordFilled) {
			try {
				const response = await fetch('http://localhost:8080/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: email,
						password: password,
					}),
				})
	
				if (response.status === 409) {
					alert('Пользователь с таким email уже существует')
					return
				}
	
				if (!response.ok) {
					alert('Ошибка при регистрации')
					return
				}
	
				alert('Регистрация успешна! Теперь войдите в систему.')
				navigate('/login')
			} catch (error) {
				console.error('Ошибка при регистрации:', error)
				alert('Произошла ошибка. Попробуйте позже.')
			}
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
				<button className='login-button google' onClick={() => navigate('/login')}>Войти через Google</button>
			</div>
		</div>
	)
}

export default SignupPage
