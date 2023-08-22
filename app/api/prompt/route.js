import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request) => {
	try {
		await connectToDB();

		const prompts = await Prompt.find({}).populate("creator"); //what the populate does is also fetches the info of the creator of each prompt(is like making and intersection with the creator table for each prompt)

		return new Response(JSON.stringify(prompts), { status: 200 });
	} catch (error) {
		return new Response("Failed to fetch all prompts", { status: 500 });
	}
};
