import problem from "../model/problem.js";
import { explainCodeAI, generateHintAI } from "../utils/aiService.js";

export const explainCode = async (req, res) => {
	try {
		const { code, language } = req.body;

		if (!code?.trim()) {
			return res
				.status(400)
				.json({ success: false, message: "Code is required" });
		}

		if (code.trim().length < 10) {
			return res
				.status(400)
				.json({ success: false, message: "Code is too short to explain" });
		}

		const explanation = await explainCodeAI({
			code: code.trim(),
			language: language || "code",
		});
		return res.status(200).json({ success: true, data: explanation });
	} catch (error) {
		console.error("[explainCode]", error);
		return res.status(500).json({
			success: false,
			message: "Failed to generate explanation. Please try again.",
		});
	}
};

export const getHint = async (req, res) => {
	try {
		const { problemId, userCode, level } = req.body;

		if (!problemId) {
			return res
				.status(400)
				.json({ success: false, message: "Problem ID is required" });
		}

		const hintLevel = parseInt(level, 10);
		if (isNaN(hintLevel) || hintLevel < 1 || hintLevel > 3) {
			return res
				.status(400)
				.json({ success: false, message: "Hint level must be 1, 2, or 3" });
		}

		const problemDoc = await problem.findById(problemId);

		if (!problemDoc) {
			return res
				.status(404)
				.json({ success: false, message: "Problem not found" });
		}

		const hint = await generateHintAI({
			problem: problemDoc.description,
			userCode: userCode?.trim() || "",
			level: hintLevel,
		});

		return res.status(200).json({ success: true, data: hint });
	} catch (error) {
		console.error("[getHint]", error);
		return res.status(500).json({
			success: false,
			message: "Failed to generate hint. Please try again.",
		});
	}
};
