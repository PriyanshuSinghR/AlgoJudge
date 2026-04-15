import {
	executeCpp,
	executeJava,
	executeJs,
	executePython,
} from "../utils/executeCode.js";
import generateFile from "../utils/generateFile.js";

export const run = async (req, res) => {
	const { language = "cpp", code, input = "" } = req.body;

	if (!code) {
		return res.status(400).json({
			success: false,
			error: "Code is required",
		});
	}

	try {
		const files = generateFile(language, code, input);

		let output;

		switch (language) {
			case "cpp":
				output = await executeCpp(files.codeFilePath, files.inputFilePath);
				break;

			case "python":
				output = await executePython(files.codeFilePath, files.inputFilePath);
				break;

			case "javascript":
				output = await executeJs(files.codeFilePath, files.inputFilePath);
				break;

			case "java":
				output = await executeJava(files.codeFilePath, files.inputFilePath);
				break;

			default:
				return res.status(400).json({
					success: false,
					error: "Unsupported language",
				});
		}

		return res.json({
			success: true,
			output,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.toString(),
		});
	}
};
