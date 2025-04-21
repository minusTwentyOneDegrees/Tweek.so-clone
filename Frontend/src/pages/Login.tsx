// LoginPage.jsx
import React, { useState, useRef, useEffect } from 'react'
import '../styles/login.css'

const LoginPage = () => {
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
				<h2 className='login-title'>Вход</h2>
				<input type='email' placeholder='Email' className='input-field' />
				<input type='password' placeholder='Пароль' className='input-field' />
				<button className='login-button'>Вход</button>
				<button className='login-button google'>Войти через Google</button>
			</div>
		</div>
	)
}

export default LoginPage
