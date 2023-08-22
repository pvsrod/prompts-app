"use client";
import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

//this is just another component we will use in the "Feed" component, since we will only use here, we create it in the same file (I'm not sure what is the point or benefit but it is no diferent than creating a new "PromptCardList.js" file in the "Components" folder and then importing it here)
const PromptCardList = ({ data, handleTagClick }) => {
	return (
		<div className='mt-16 prompt_layout'>
			{data.map((post) => {
				return (
					<PromptCard
						key={post._id}
						post={post}
						handleTagClick={handleTagClick}
					/>
				);
			})}
		</div>
	);
};

const Feed = () => {
	const [searchText, setSearchText] = useState("");
	const [posts, setPosts] = useState([]);

	const handleSearchChange = (e) => {};

	//we fetch the "prompts" data in the useEffect
	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch("/api/prompt");
			const data = await response.json();

			setPosts(data);
		};

		fetchPosts();
	}, []);

	return (
		<section className='feed'>
			<form className='relative w-full flex-center'>
				<input
					type='text'
					placeholder='Search for a tag or a username'
					value={searchText}
					onChange={handleSearchChange}
					required
					className='search_input peer'
				/>
			</form>

			<PromptCardList data={posts} handleTagClick={() => {}} />
		</section>
	);
};

export default Feed;
