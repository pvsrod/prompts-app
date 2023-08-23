"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
	const pathName = usePathname(); //usePathname returns the current path (e.g. for home it returns "/", "/profile",etc)
	const { data: session } = useSession(); //returns the current session info (status, user, expires,etc)
	const router = useRouter();

	const [copied, setCopied] = useState(""); //this state is just used as a flag to toggle the copy/checkmark icon

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt); //copies to the clipboard
		setTimeout(() => setCopied(""), 3000); //we set "copied" back to "" so the checkmark icon disapears after 3 seconds
	};

	//all this function does is redirects the page to either "my own profile page" or "someone else's profile page" (in case I click on one of my own prompts I should be redirected to my own page with edit/delete capabilities)
	const handleProfileClick = () => {
		if (post.creator._id === session?.user.id) return router.push("/profile");
		router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
	};

	return (
		<div className='prompt_card'>
			<div className='flex justify-between items-start gap-5'>
				<div
					className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
					onClick={handleProfileClick}>
					<Image
						src={post.creator.image}
						alt='user_image'
						width={40}
						height={40}
						className='rounded-full object-contain'
					/>
					<div className='flex flex-col'>
						<h3 className='font-satoshi font-semibold text-gray-900'>
							{post.creator.username}
						</h3>
						<p className='font-inter text-sm text-gray-500'>
							{post.creator.email}
						</p>
					</div>
				</div>
				<div className='copy_btn' onClick={handleCopy}>
					<Image
						src={
							copied === post.prompt
								? "/assets/icons/tick.svg"
								: "/assets/icons/copy.svg"
						}
						width={12}
						height={12}
						alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
					/>
				</div>
			</div>
			<p className='my-4 font-satoshi text-sm text-gray-700'>{post.prompt}</p>
			<p
				className='font-inter text-sm blue_gradient cursor-pointer'
				onClick={() => handleTagClick && handleTagClick(post.tag)}>
				#{post.tag}
			</p>

			{/* if the current user is the creator of the post AND we are in the profile page, only then we display the edit/delete options. We do this because we use the PromptCard component in both the home page and the profile page and these options only apply to the profile page */}
			{session?.user.id === post.creator._id && pathName === "/profile" && (
				<div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
					<p
						className='font-inter text-sm green_gradient cursor-pointer'
						onClick={handleEdit}>
						Edit
					</p>
					<p
						className='font-inter text-sm orange_gradient cursor-pointer'
						onClick={handleDelete}>
						Delete
					</p>
				</div>
			)}
		</div>
	);
};

export default PromptCard;
