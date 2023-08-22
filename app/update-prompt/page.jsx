"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Form from "@components/Form";

const EditPromt = () => {
	const router = useRouter(); //nextjs router
	const searchParams = useSearchParams();
	const promptId = searchParams.get("id");

	const [submitting, setSubmitting] = useState(false);
	const [post, setPost] = useState({
		prompt: "",
		tag: "",
	});

	useEffect(() => {
		const getPromptDetails = async () => {
			const response = await fetch(`/api/prompt/${promptId}`); //this defaults automatically to the GET function defined in "/api/prompt/[id]/route.js"
			const data = await response.json();

			setPost({
				prompt: data.prompt,
				tag: data.tag,
			});
		};

		if (promptId) getPromptDetails(); //we only call the function if prompId exists
	}, [promptId]);

	const updatePrompt = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		if (!promptId) return alert("Prompt ID not found");

		try {
			//this API call automatically redirects to the PATCH method in "/api/prompt/[id]/route.js"
			const response = await fetch(`/api/prompt/${promptId}`, {
				method: "PATCH",
				body: JSON.stringify({
					prompt: post.prompt,
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
			type='Edit'
			post={post}
			setPost={setPost}
			submiting={submitting}
			handleSubmit={updatePrompt}
		/>
	);
};

export default EditPromt;
