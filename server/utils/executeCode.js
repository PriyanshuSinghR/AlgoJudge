import path from "path";
import { exec, execSync } from "child_process";

const getContainerName = () => {
	return process.env.CONTAINER_NAME || "algojudge-backend";
};

const ensureImage = (image, dockerfile) => {
	try {
		execSync(`docker image inspect ${image}`, { stdio: "ignore" });
	} catch {
		console.log(`⚡ Image ${image} missing → rebuilding...`);
		execSync(`docker build -t ${image} -f ${dockerfile} .`, {
			stdio: "inherit",
		});
	}
};

const runDocker = (image, codeFilePath, inputFilePath, commandBuilder) => {
	const extension = codeFilePath.split(".").pop();

	const fileMap = {
		cpp: "code.cpp",
		py: "code.py",
		js: "code.js",
		java: "code.java",
	};

	const containerFileName = fileMap[extension];
	const codeFileName = path.basename(codeFilePath);
	const inputFileName = path.basename(inputFilePath);

	const containerName = getContainerName();

	const command = commandBuilder(`/app/codes/${codeFileName}`);

	return new Promise((resolve, reject) => {
		const dockerCmd = `docker run --rm \
--memory="128m" \
--cpus="0.5" \
--network="none" \
--pids-limit=50 \
--volumes-from ${containerName} \
${image} \
sh -c "${command} < /app/inputs/${inputFileName}"`;

		console.log("Running command:\n", dockerCmd);

		exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
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
		(filePath) => `g++ ${filePath} -o /tmp/a.out && /tmp/a.out`,
	);
};

const executePython = (codeFilePath, inputFilePath) => {
	return runDocker(
		"oj-python",
		codeFilePath,
		inputFilePath,
		(filePath) => `python ${filePath}`,
	);
};

const executeJs = (codeFilePath, inputFilePath) => {
	return runDocker(
		"oj-node",
		codeFilePath,
		inputFilePath,
		(filePath) => `node ${filePath}`,
	);
};

const executeJava = (codeFilePath, inputFilePath) => {
	return runDocker(
		"oj-java",
		codeFilePath,
		inputFilePath,
		(filePath) => `java ${filePath}`,
	);
};

const executeByLanguage = async (language, codeFilePath, inputFilePath) => {
	switch (language) {
		case "cpp":
			return executeCpp(codeFilePath, inputFilePath);

		case "python":
			return executePython(codeFilePath, inputFilePath);

		case "javascript":
			return executeJs(codeFilePath, inputFilePath);

		case "java":
			return executeJava(codeFilePath, inputFilePath);

		default:
			throw new Error("Unsupported language");
	}
};

export { executeCpp, executePython, executeJs, executeJava, executeByLanguage };
