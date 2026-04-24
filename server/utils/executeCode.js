import path from "path";
import { exec, execSync } from "child_process";

// Get the backend container's own ID/name so sibling containers can share its volumes
const getContainerName = () => {
	// When running in Docker, use the container name from env or default
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

const runDocker = (image, codeFilePath, inputFilePath, command) => {
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

	return new Promise((resolve, reject) => {
		// ✅ --volumes-from shares the exact same mounted filesystem
		// No path translation needed — sibling sees /app/codes just like backend does
		const dockerCmd = `docker run --rm \
--memory="128m" \
--cpus="0.5" \
--network="none" \
--pids-limit=50 \
--volumes-from ${containerName} \
${image} \
sh -c "${command.replace("/app/code", `/app/codes/${codeFileName}`)} < /app/inputs/${inputFileName}"`;

		console.log("Running command:\n", dockerCmd);

		exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			if (stderr) return reject(stderr);
			resolve(stdout);
		});
	});
};

// Each executor passes a self-contained command using the actual file path directly
const executeCpp = (codeFilePath, inputFilePath) => {
	const codeFileName = path.basename(codeFilePath);
	const inputFileName = path.basename(inputFilePath);
	const containerName = getContainerName();

	return new Promise((resolve, reject) => {
		const dockerCmd = `docker run --rm \
--memory="128m" \
--cpus="0.5" \
--network="none" \
--pids-limit=50 \
--volumes-from ${containerName} \
oj-cpp \
sh -c "g++ /app/codes/${codeFileName} -o /tmp/a.out && /tmp/a.out < /app/inputs/${inputFileName}"`;

		exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			if (stderr) return reject(stderr);
			resolve(stdout);
		});
	});
};

const executePython = (codeFilePath, inputFilePath) => {
	const codeFileName = path.basename(codeFilePath);
	const inputFileName = path.basename(inputFilePath);
	const containerName = getContainerName();

	return new Promise((resolve, reject) => {
		const dockerCmd = `docker run --rm \
--memory="128m" \
--cpus="0.5" \
--network="none" \
--pids-limit=50 \
--volumes-from ${containerName} \
oj-python \
sh -c "python /app/codes/${codeFileName} < /app/inputs/${inputFileName}"`;

		exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			if (stderr) return reject(stderr);
			resolve(stdout);
		});
	});
};

const executeJs = (codeFilePath, inputFilePath) => {
	const codeFileName = path.basename(codeFilePath);
	const inputFileName = path.basename(inputFilePath);
	const containerName = getContainerName();

	return new Promise((resolve, reject) => {
		const dockerCmd = `docker run --rm \
--memory="128m" \
--cpus="0.5" \
--network="none" \
--pids-limit=50 \
--volumes-from ${containerName} \
oj-node \
sh -c "node /app/codes/${codeFileName} < /app/inputs/${inputFileName}"`;

		exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			if (stderr) return reject(stderr);
			resolve(stdout);
		});
	});
};

const executeJava = (codeFilePath, inputFilePath) => {
	const codeFileName = path.basename(codeFilePath);
	const inputFileName = path.basename(inputFilePath);
	const containerName = getContainerName();

	return new Promise((resolve, reject) => {
		const dockerCmd = `docker run --rm \
--memory="128m" \
--cpus="0.5" \
--network="none" \
--pids-limit=50 \
--volumes-from ${containerName} \
oj-java \
sh -c "java /app/codes/${codeFileName} < /app/inputs/${inputFileName}"`;

		exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
			if (error) return reject(stderr || error.message);
			if (stderr) return reject(stderr);
			resolve(stdout);
		});
	});
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
