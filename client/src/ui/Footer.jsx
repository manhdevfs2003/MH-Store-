import React from 'react'
import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, GitHub, Globe } from "react-feather"

export default function Footer() {
	return (
		<footer className="grid grid-cols-1 md:(grid-cols-3) border-t border-gray-300 bg-gray-200 px-4">
			<div className="m-4 sm:m-6 flex-1">
				<h2 className="text-4xl text-center md:text-left mb-4">BRAND</h2>
				<ul className="flex mt-6 justify-center md:justify-start space-x-4">
					
				</ul>
			</div>			
			<div className="m-4 sm:m-6">
				<h2 className="text-xl text-center md:text-left font-medium mb-4">Useful Links</h2>
				<ul className="flex flex-col flex-wrap h-36 space-y-1 text-gray-600">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/cart">Cart</Link>
					</li>
					<li>
						<Link to="/products?category=men">Men Fashion</Link>
					</li>
					<li>
						<Link to="/products?category=women">Women Fashion</Link>
					</li>
					<li>
						<Link to="/orders">Track Order</Link>
					</li>
					<li>
						<Link to="/account">My Account</Link>
					</li>							
					<li>
						<Link to="/wishlist">Wishlist</Link>
					</li>					
					<li>
						<Link to="/terms">Terms</Link>
					</li>
				</ul>
			</div>			
			<div className="m-4 sm:m-6">
				<h2 className="text-xl text-center md:text-left font-medium mb-4">Contact</h2>
				<ul className="space-y-3 text-gray-700">
								
					
				</ul>
				<div className="mt-6">
					<img className="mx-auto md:mx-0" src="https://i.ibb.co/Qfvn4z6/payment.png" alt="payment providers" />
				</div>
			</div>
		</footer>
	)
}