import Problem from "../model/problem.js";
import Submission from "../model/submission.js";
import { executeByLanguage } from "../utils/executeCode.js";
import { generateFile, cleanupFiles } from "../utils/utils.js";

export const run = async (req, res) => {
	const { language = "cpp", code, input = "" } = req.body;

	if (!code) {
		return res.status(400).json({
			success: false,
			message: "Code is required",
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
			data: output.trim(),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.toString(),
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
				message: "problemId and code are required",
			});
		}

		const userId = req.user.id;

		const problem = await Problem.findById(problemId);

		if (!problem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found",
			});
		}

		const testCases = problem.testCases || [];

		if (testCases.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No test cases found for this problem",
			});
		}

		let submissionStatus = "Accepted";
		let failedTestCase = null;
		let runtimeMessage = null;
		let wrongAnswerDetails = null;

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
					submissionStatus = "Wrong Answer";
					failedTestCase = i + 1;

					wrongAnswerDetails = {
						input: testCase.input,
						expectedOutput,
						actualOutput,
					};

					break;
				}
			} catch (runtimeError) {
				submissionStatus = "Runtime Error";
				failedTestCase = i + 1;
				runtimeMessage = runtimeError.toString();
				break;
			} finally {
				if (files) {
					cleanupFiles(files.codeFilePath, files.inputFilePath);
				}
			}
		}

		// Save submission
		const submission = await Submission.create({
			user: userId,
			problem: problemId,
			language,
			code,
			status: submissionStatus,
			failedTestCase,
			runtime: null,
			memory: null,
		});

		// Keep only latest 5 submissions per user per problem
		const oldSubmissions = await Submission.find({
			user: userId,
			problem: problemId,
		})
			.sort({ createdAt: -1 })
			.skip(5);

		if (oldSubmissions.length > 0) {
			const oldSubmissionIds = oldSubmissions.map((item) => item._id);

			await Submission.deleteMany({
				_id: { $in: oldSubmissionIds },
			});
		}

		if (submissionStatus === "Wrong Answer") {
			return res.status(200).json({
				success: true,
				status: "Wrong Answer",
				failedTestCase,
				...wrongAnswerDetails,
				submissionId: submission._id,
			});
		}

		if (submissionStatus === "Runtime Error") {
			return res.status(200).json({
				success: true,
				status: "Runtime Error",
				failedTestCase,
				message: runtimeMessage,
				submissionId: submission._id,
			});
		}

		return res.status(200).json({
			success: true,
			status: "Accepted",
			message: "All test cases passed successfully",
			totalTestCases: testCases.length,
			submissionId: submission._id,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.toString(),
		});
	}
};

export const getSubmissionHistory = async (req, res) => {
	try {
		const { problemId } = req.params;
		const userId = req.user.id;

		if (!problemId) {
			return res.status(400).json({
				success: false,
				message: "Problem id is required",
			});
		}

		const submissions = await Submission.find({
			user: userId,
			problem: problemId,
		}).sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: submissions.length,
			data: submissions,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.toString(),
		});
	}
};
