import React from 'react';
// import { useRouter } from 'next/router';
// import { useMetaMask } from 'metamask-react';
// import { walletModalShow } from '../../redux/counterSlice';
import Button from '@mui/material/Button';

import {
	useAccount,
	useConnect,
	useDisconnect,
} from 'wagmi'

const Metamask_comp_text = () => {
	const { isConnected } = useAccount()
	const { connect, connectors } =
		useConnect()
	const { disconnect } = useDisconnect()

	if (isConnected) {
		return (
			<Button
				// className="js-wallet bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
				onClick={disconnect}
				color="info"
				variant="contained"
			>
				Disconnect
			</Button> )
	  }

	if (!isConnected) {
		return ( 
			connectors.map((connector) => (
				<Button
					disabled={!connector.ready}
					key={connector.id}
					color="info"
					variant="contained"
					onClick={async () => {
						// register({ connector })
						await connect({ connector })
						// console.log(address)
						// register(address)
						// 	.then((response) => {
						// 	console.log(response)
						// 	})
					}}
					//className="js-wallet bg-accent shadow-accent-volume hover:bg-accent-dark block w-full rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
				>
					Connect
				</Button>
				)) 
		)
	}
};

const Metamask_comp_icon = ({ prop }) => {
	const {  isConnected } = useAccount()
	const { connect, connectors } =
		useConnect()
	const { disconnect } = useDisconnect()

	if (isConnected) {
		return ( 
				<button
					className={
						prop.asPath === '/home/home_3'
							? 'js-wallet border-jacarta-100  focus:bg-accent group hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent border-transparent bg-white/[.15]'
							: 'js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
					}
					onClick={disconnect}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className={
							prop.asPath === '/home/home_3'
								? ' h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white fill-white'
								: 'fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
						}
					>
						<path fill="none" d="M0 0h24v24H0z"></path>
						<path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z"></path>
					</svg>
				</button> 
		)
	  }

	if (!isConnected) {
		return (
			connectors.map((connector) => (
				<button
					disabled={!connector.ready}
					key={connector.id}
					onClick={async() => {
						// register({ connector })
						await connect({ connector })
						// console.log(address)
						// register(address)
						// 	.then((response) => {
						// 	console.log(response)
						// 	})
					}}
					className={
						prop.asPath === '/home/home_3'
							? 'js-wallet border-jacarta-100  focus:bg-accent group hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent border-transparent bg-white/[.15]'
							: 'js-wallet border-jacarta-100 hover:bg-accent focus:bg-accent group dark:hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:border-transparent focus:border-transparent dark:border-transparent dark:bg-white/[.15]'
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className={
							prop.asPath === '/home/home_3'
								? ' h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white fill-white'
								: 'fill-jacarta-700 h-4 w-4 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white'
						}
					>
						<path fill="none" d="M0 0h24v24H0z"></path>
						<path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z"></path>
					</svg>
				</button>
				))
		)
	}
};

export { Metamask_comp_text, Metamask_comp_icon };
