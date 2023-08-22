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
	const [allPosts, setAllPosts] = useState([]); //stores the array with all the post

	//Search states
	const [searchText, setSearchText] = useState(""); //state linked to the controled search input
	const [searchTimeout, setSearchTimeout] = useState(null); //this state controls the debounce function (resets the timer after each key stroke in the search input)
	const [searchedResults, setSearchedResults] = useState([]); //stores the array of the filtered posts

	//function that fetches all the posts
	const fetchPosts = async () => {
		const response = await fetch("/api/prompt"); //this gets defaulted automatically to the GET function in "/api/prompt/route.js"
		const data = await response.json();
		setAllPosts(data);
	};

	//we fetch all the prompts at loading time
	useEffect(() => {
		fetchPosts();
	}, []);

	//Function that filters the promps according to the search input (searchText), returns an array with the filtered prompts
	const filterPrompts = (searchText) => {
		console.log("called");
		//RegExp is a JS function to filter strings with a regular expresion
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
		const regex = new RegExp(searchText, "i"); //in this case the "regular expresion" is just the text we want to search in the string. The "i" flag is for case-insensitive search
		return allPosts.filter(
			(item) =>
				regex.test(item.creator.username) ||
				regex.test(item.tag) ||
				regex.test(item.prompt)
		); //".test(string)" tests the "regular expresion" against the "string", returns true if found
	};

	//this is the function applied on the "onChange" event in the search input
	//it implements the debounce method to avoid unnecessary calls while typing
	const handleSearchChange = (e) => {
		clearTimeout(searchTimeout); //the timer resets on every key stroke
		setSearchText(e.target.value); //this updates the input(it's value is linked to the "searchText" state value)

		setSearchTimeout(
			setTimeout(() => {
				const searcResult = filterPrompts(e.target.value);
				setSearchedResults(searcResult);
			}, 500)
		);
	};

	//Manages the "tag click" event (filters by tag), the "tagName" value is passed to the function when invoked from the "PromptCard" component
	const handleTagClick = (tagName) => {
		setSearchText(tagName);
		const searchResult = filterPrompts(tagName);
		setSearchedResults(searchResult);
	};

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

			{/* */}
			{searchText ? (
				<PromptCardList
					data={searchedResults}
					handleTagClick={handleTagClick}
				/>
			) : (
				<PromptCardList data={allPosts} handleTagClick={handleTagClick} />
			)}
		</section>
	);
};

export default Feed;
