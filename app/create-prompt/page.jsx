"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Form from "@components/Form";

const CreatePromt = () => {
	const router = useRouter(); //nextjs router
	const { data: session } = useSession(); //gives access to the current session info

	const [submitting, setSubmitting] = useState(false);
	const [post, setPost] = useState({
		prompt: "",
		tag: "",
	});

	const createPrompt = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const response = await fetch("/api/prompt/new", {
				method: "POST",
				body: JSON.stringify({
					prompt: post.prompt,
					userId: session?.user.id,
					tag: post.tag,
				}),
			});
			if (response.ok) {
				router.push("/"); //if successfull redirect to home page
			}
		} catch (error) {
			console.log(error);
		} finally {
			//the "finally" clause, in a "try/catch" statement, gets executed at the end either way
			setSubmitting(false);
		}
	};

	return (
		<Form
			type='Create'
			post={post}
			setPost={setPost}
			submiting={submitting}
			handleSubmit={createPrompt}
		/>
	);
};

export default CreatePromt;
