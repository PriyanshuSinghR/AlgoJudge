import { exec } from "child_process";
import path from "path";

const runDocker = (image, codeFilePath, inputFilePath, command) => {
	const fileName = path.basename(codeFilePath);

	return new Promise((resolve, reject) => {
		const dockerCmd = `
		docker run --rm \
		--memory="128m" \
		--cpus="0.5" \
		--network="none" \
		--pids-limit=50 \
		--read-only \
		-v "${codeFilePath}:/app/${fileName}" \
		-v "${inputFilePath}:/app/input.txt" \
		${image} \
		sh -c "${command} < /app/input.txt"
		`;

		exec(dockerCmd, { timeout: 5000 }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			if (stderr) return reject(stderr);

			resolve(stdout);
		});
	});
};

const executeCpp = (codeFilePath, inputFilePath) => {
	return runDocker(
		"oj-cpp",
		codeFilePath,
		inputFilePath,
		"g++ /app/code.cpp -o /app/a && /app/a",
	);
};

const executePython = (codeFilePath, inputFilePath) => {
	return runDocker(
		"oj-python",
		codeFilePath,
		inputFilePath,
		"python /app/code.py",
	);
};

const executeJs = (codeFilePath, inputFilePath) => {
	return runDocker("oj-node", codeFilePath, inputFilePath, "node /app/code.js");
};

const executeJava = (codeFilePath, inputFilePath) => {
	return runDocker(
		"oj-java",
		codeFilePath,
		inputFilePath,
		"java /app/code.java",
	);
};

const executeByLanguage = async (language, codeFilePath, inputFilePath) => {
	switch (language) {
		case "cpp":
			return await executeCpp(codeFilePath, inputFilePath);

		case "python":
			return await executePython(codeFilePath, inputFilePath);

		case "javascript":
			return await executeJs(codeFilePath, inputFilePath);

		case "java":
			return await executeJava(codeFilePath, inputFilePath);

		default:
			throw new Error("Unsupported language");
	}
};

export { executeCpp, executePython, executeJs, executeJava, executeByLanguage };
