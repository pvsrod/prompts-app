"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

function MyProfile() {
	const { data: session } = useSession();
	const [posts, setPosts] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch(`/api/users/${session?.user.id}/posts`);
			const data = await response.json();
			setPosts(data);
		};
		if (session?.user.id) fetchPosts();
	}, []);

	const handleEdit = (post) => {
		router.push(`/update-prompt?id=${post._id}`);
	};
	const handleDelete = async (post) => {
		const hasConfirmed = confirm(
			"Are you sure you want to delete this prompt?"
		); //this is just a browser built in function
		if (hasConfirmed) {
			try {
				await fetch(`/api/prompt/${post._id.toString()}`, {
					method: "DELETE",
				}); //this API call automatically redirects to the DELETE method in "/api/prompt/[id]/route.js"

				const filteredPosts = posts.filter((p) => p._id !== post.id);
				setPosts(filteredPosts);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<Profile
			name='My'
			desc='Welcome to your personalized profile page'
			data={posts}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	);
}

export default MyProfile;
