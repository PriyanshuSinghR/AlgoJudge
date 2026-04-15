import Problem from "../model/problem.js";
import { executeByLanguage } from "../utils/executeCode.js";
import { generateFile, cleanupFiles } from "../utils/utils.js";

export const run = async (req, res) => {
	const { language = "cpp", code, input = "" } = req.body;

	if (!code) {
		return res.status(400).json({
			success: false,
			error: "Code is required",
		});
	}

	let files;

	try {
		files = generateFile(language, code, input);

		const output = await executeByLanguage(
			language,
			files.codeFilePath,
			files.inputFilePath,
		);

		return res.status(200).json({
			success: true,
			output: output.trim(),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.toString(),
		});
	} finally {
		if (files) {
			cleanupFiles(files.codeFilePath, files.inputFilePath);
		}
	}
};

export const submit = async (req, res) => {
	try {
		const { problemId, language = "javascript", code } = req.body;

		if (!problemId || !code) {
			return res.status(400).json({
				success: false,
				error: "problemId and code are required",
			});
		}

		const problem = await Problem.findById(problemId);

		if (!problem) {
			return res.status(404).json({
				success: false,
				error: "Problem not found",
			});
		}

		const testCases = problem.testCases || [];

		if (testCases.length === 0) {
			return res.status(400).json({
				success: false,
				error: "No test cases found for this problem",
			});
		}

		for (let i = 0; i < testCases.length; i++) {
			const testCase = testCases[i];

			let files;

			try {
				files = generateFile(language, code, testCase.input);

				const output = await executeByLanguage(
					language,
					files.codeFilePath,
					files.inputFilePath,
				);

				const actualOutput = output.trim();
				const expectedOutput = String(testCase.output).trim();

				if (actualOutput !== expectedOutput) {
					return res.status(200).json({
						success: true,
						status: "Wrong Answer",
						failedTestCase: i + 1,
						input: testCase.input,
						expectedOutput,
						actualOutput,
					});
				}
			} catch (runtimeError) {
				return res.status(200).json({
					success: true,
					status: "Runtime Error",
					failedTestCase: i + 1,
					error: runtimeError.toString(),
				});
			} finally {
				if (files) {
					cleanupFiles(files.codeFilePath, files.inputFilePath);
				}
			}
		}

		return res.status(200).json({
			success: true,
			status: "Accepted",
			message: "All test cases passed successfully",
			totalTestCases: testCases.length,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.toString(),
		});
	}
};
