import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req, res) => {
	//we can inmediatelly grab the info we need from the POST request
	const { userId, prompt, tag } = await req.json();

	try {
		await connectToDB(); //we need to do this every time, this is a "lambda" function which means it will "die" once it's job is done
		const newPrompt = new Prompt({ creator: userId, prompt, tag });

		await newPrompt.save(); //we save it to the DB (a.k.a we insert the value in the DB)

		return new Response(JSON.stringify(newPrompt), { status: 201 });
	} catch (error) {
		return new Response("Failed to create a new prompt", { status: 500 });
	}
};
