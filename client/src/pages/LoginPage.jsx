import React, { useContext } from 'react'
import { sliderItems } from '@/dummydata'

import { UserContext, CartContext } from '@/App'
import LoginForm from "@/ui/LoginForm"
import api from '@/api'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
	const {cart, cartDispatch} = useContext(CartContext)
	const {setUser} = useContext(UserContext)
	const navigate = useNavigate()

	const handleLogin = async userData => {
		const resp = await api.loginUser(userData)
		if (resp.status == "ok") {
			setUser(api.getUser())
			const cartResp = await api.getUserCart()
			console.log("Cart Response:", cartResp)
			if (cartResp.products) {
				cartDispatch({type: "SET_PRODUCTS", payload: cartResp.products})
			}
			if (cartResp.products.length) {
				navigate("/cart")
			} else {
				navigate("/account")
			}
		}
		return resp
	}
	const randomSlide = sliderItems[Math.floor(Math.random() * sliderItems.length)]

	return (
		<main 
			className="flex justify-center h-screen items-center bg-cover bg-center sm:bg-left"
			style={{backgroundImage: `url(${randomSlide.image})`}}
		>
			<div className="min-w-sm p-6 rounded-lg bg-white filter drop-shadow-2xl">
				<h3 className="text-2xl font-bold text-center mb-6">Login to your account</h3>
				<LoginForm onSubmit={handleLogin} />
			</div>
		</main>
	)
}