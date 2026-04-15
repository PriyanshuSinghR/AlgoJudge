import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuid } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dirCodes = path.join(__dirname, "../codes");
const dirInputs = path.join(__dirname, "../inputs");

if (!fs.existsSync(dirCodes)) {
	fs.mkdirSync(dirCodes, { recursive: true });
}

if (!fs.existsSync(dirInputs)) {
	fs.mkdirSync(dirInputs, { recursive: true });
}

const languageExtension = {
	cpp: "cpp",
	python: "py",
	javascript: "js",
	java: "java",
};

export const generateFile = (language, code, input) => {
	const jobId = uuid();

	const codeFileName = `${jobId}.${languageExtension[language]}`;
	const inputFileName = `${jobId}.txt`;

	const codeFilePath = path.join(dirCodes, codeFileName);
	const inputFilePath = path.join(dirInputs, inputFileName);

	fs.writeFileSync(codeFilePath, code);
	fs.writeFileSync(inputFilePath, input);

	return {
		jobId,
		codeFilePath,
		inputFilePath,
	};
};

export const cleanupFiles = (...filePaths) => {
	for (const filePath of filePaths) {
		if (filePath && fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	}
};
