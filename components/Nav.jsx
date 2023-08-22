"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react"; //these are nextsjs' utilities that simplify the login/logout process (npm install next-auth), getProviders will return a list of the 'providers' we can use to sign in (we will use google auth)

const Nav = () => {
	const { data: session } = useSession(); //returns the data from the current session (if there is one)

	const [providers, setProviders] = useState(null);
	const [toggleDropdown, setToggleDropdown] = useState(false);

	//we use the getProviders function to retrieve the possible signIn providers and update the 'providers' state value
	useEffect(() => {
		const setUpProviders = async () => {
			const response = await getProviders();
			setProviders(response);
		};
		setUpProviders();
	}, []);

	return (
		<nav className='flex-between w-full mb-16 pt-3'>
			<Link href='/' className='flex gap-2 flex-center'>
				<Image
					src='/assets/images/logo.svg'
					alt='Promptopia logo'
					width={30}
					height={30}
					className='object-contain'
				/>
				<p className='logo_text'>Promptopia</p>
			</Link>

			{/* Desktop Navigation */}
			<div className='sm:flex hidden'>
				{session?.user ? (
					<div className='flex gap-3 md:gap-5'>
						<Link href='/create-prompt' className='black_btn'>
							Create Post
						</Link>
						<button type='button' className='outline_btn' onClick={signOut}>
							Sign Out
						</button>
						<Link href='/profile'>
							<Image
								src={session?.user.image}
								width={37}
								height={37}
								className='rounded-full'
								alt='profile'
							/>
						</Link>
					</div>
				) : (
					<>
						{providers &&
							Object.values(providers).map((provider) => (
								<button
									className='black_btn mr-4'
									type='button'
									key={provider.name}
									onClick={() => signIn(provider.id)}>
									<Image
										src={`/assets/images/${provider.name}.svg`}
										className='rounded-full mr-2'
										width={20}
										height={20}
										alt='provider'
									/>
									Sign In
								</button>
							))}
					</>
				)}
			</div>

			{/* Mobile Navigation */}
			<div className='sm:hidden flex relative'>
				{session?.user ? (
					<div className='flex'>
						<Image
							src={session?.user.image}
							width={37}
							height={37}
							className='rounded-full'
							alt='profile'
							onClick={() => setToggleDropdown((prev) => !prev)}
						/>
						{toggleDropdown && (
							<div className='dropdown'>
								<Link
									href='/profile'
									className='dropdown_link'
									onClick={() => setToggleDropdown(false)}>
									My Profile
								</Link>
								<Link
									href='/create-prompt'
									className='dropdown_link'
									onClick={() => setToggleDropdown(false)}>
									Create Prompt
								</Link>
								<button
									className='mt-5 w-full black_btn'
									type='button'
									onClick={() => {
										setToggleDropdown(false);
										signOut();
									}}>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					<>
						{providers &&
							Object.values(providers).map((provider) => (
								<button
									className='black_btn mr-3'
									type='button'
									key={provider.name}
									onClick={() => signIn(provider.id)}>
									<Image
										src={`/assets/images/${provider.name}.svg`}
										className='rounded-full mr-2'
										width={20}
										height={20}
										alt='provider'
									/>
									Sign In
								</button>
							))}
					</>
				)}
			</div>
		</nav>
	);
};

export default Nav;
