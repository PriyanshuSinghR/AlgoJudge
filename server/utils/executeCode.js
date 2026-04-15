import { exec } from "child_process";
import path from "path";

const executeCpp = (codeFilePath, inputFilePath) => {
	const fileName = path.basename(codeFilePath);

	return new Promise((resolve, reject) => {
		const command = `docker run --rm \
      --memory="128m" \
      --cpus="0.5" \
      --network="none" \
      -v "${codeFilePath}:/app/${fileName}" \
      -v "${inputFilePath}:/app/input.txt" \
      gcc:latest \
      sh -c "g++ /app/${fileName} -o /app/program && /app/program < /app/input.txt"`;

		exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
			if (error) {
				return reject(stderr || error.message);
			}

			if (stderr) {
				return reject(stderr);
			}

			resolve(stdout);
		});
	});
};

const executePython = (codeFilePath, inputFilePath) => {
	const fileName = path.basename(codeFilePath);

	return new Promise((resolve, reject) => {
		const command = `docker run --rm \
      --memory="128m" \
      --cpus="0.5" \
      --network="none" \
      -v "${codeFilePath}:/app/${fileName}" \
      -v "${inputFilePath}:/app/input.txt" \
      python:3.11 \
      sh -c "python /app/${fileName} < /app/input.txt"`;

		exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
			if (error) {
				return reject(stderr || error.message);
			}

			if (stderr) {
				return reject(stderr);
			}

			resolve(stdout);
		});
	});
};

const executeJs = (codeFilePath, inputFilePath) => {
	const fileName = path.basename(codeFilePath);

	return new Promise((resolve, reject) => {
		const command = `docker run --rm \
      --memory="128m" \
      --cpus="0.5" \
      --network="none" \
      -v "${codeFilePath}:/app/${fileName}" \
      -v "${inputFilePath}:/app/input.txt" \
      node:20 \
      sh -c "node /app/${fileName} < /app/input.txt"`;

		exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
			if (error) {
				return reject(stderr || error.message);
			}

			if (stderr) {
				return reject(stderr);
			}

			resolve(stdout);
		});
	});
};

const executeJava = (codeFilePath, inputFilePath) => {
	const fileName = path.basename(codeFilePath);

	return new Promise((resolve, reject) => {
		const command = `docker run --rm \
      --memory="128m" \
      --cpus="0.5" \
      --network="none" \
      -v "${codeFilePath}:/app/${fileName}" \
      -v "${inputFilePath}:/app/input.txt" \
      eclipse-temurin:17 \
      sh -c "java /app/${fileName} < /app/input.txt"`;

		exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
			if (error) {
				return reject(stderr || error.message);
			}

			if (stderr) {
				return reject(stderr);
			}

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
