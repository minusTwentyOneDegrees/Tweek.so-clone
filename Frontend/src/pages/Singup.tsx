import React, { useState, useRef, useEffect } from 'react'
import '../styles/login.css'

const SignupPage = () => {
	useEffect(() => {
		document.title = 'Login Tweek.so' // Заголовок страницы
		const link = document.querySelector("link[rel='icon']") as HTMLLinkElement
		if (link) {
			link.href = '/img/faviconv2.ico' // Путь к иконке
		}
	}, [])
	return (
		<div className='login-page'>
			<div className='login-box'>
				<h2 className='login-title'>Регистрация</h2>
				<input type='text' placeholder='Имя' className='input-field seamless' />
				<input
					type='email'
					placeholder='Email'
					className='input-field seamless'
				/>
				<input
					type='password'
					placeholder='Пароль'
					className='input-field seamless'
				/>
				<button className='login-button'>Зарегистрироваться</button>
				<button className='login-button google'>
					Зарегистрироваться через Google
				</button>
			</div>
		</div>
	)
}

export default SignupPage
