import Problem from "../model/problem.js";

export const getProblems = async (req, res) => {
	try {
		const problems = await Problem.find().select(
			"title difficulty tags slug createdBy -_id",
		);

		res.json({
			success: true,
			data: problems,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching problems",
		});
	}
};

export const getProblemBySlug = async (req, res) => {
	try {
		const problem = await Problem.findOne({
			slug: req.params.slug,
		}).select("-testCases");

		if (!problem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found",
			});
		}

		res.json({
			success: true,
			data: problem,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching problem",
		});
	}
};

export const getProblemById = async (req, res) => {
	try {
		const problem = await Problem.findById(req.params.id).select("-testCases");

		if (!problem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found",
			});
		}

		res.json({
			success: true,
			data: problem,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching problem",
		});
	}
};

export const createProblem = async (req, res) => {
	try {
		const problem = await Problem.create({
			...req.body,
			createdBy: req.user._id,
		});

		res.status(201).json({
			success: true,
			data: problem,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating problem",
		});
	}
};

export const updateProblem = async (req, res) => {
	try {
		const problem = await Problem.findById(req.params.id);

		if (!problem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found",
			});
		}

		// 🔥 OWNER CHECK
		if (problem.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				success: false,
				message: "Forbidden: You are not the owner",
			});
		}

		Object.assign(problem, req.body);
		await problem.save();

		res.json({
			success: true,
			data: problem,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating problem",
		});
	}
};

export const deleteProblem = async (req, res) => {
	try {
		const problem = await Problem.findById(req.params.id);

		if (!problem) {
			return res.status(404).json({
				success: false,
				message: "Problem not found",
			});
		}

		// 🔥 OWNER CHECK
		if (problem.createdBy.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				success: false,
				message: "Forbidden: You are not the owner",
			});
		}

		await problem.deleteOne();

		res.json({
			success: true,
			message: "Problem deleted",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting problem",
		});
	}
};

export const bulkCreateProblems = async (req, res) => {
	try {
		const problems = req.body.problems;

		if (!Array.isArray(problems) || problems.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Problems array is required",
			});
		}

		const slugify = (text) =>
			text
				.toLowerCase()
				.trim()
				.replace(/ /g, "-")
				.replace(/[^\w-]+/g, "");

		const formattedProblems = problems.map((p) => {
			if (!p.title || !p.description) {
				throw new Error("Title and description required");
			}

			if (!p.examples || p.examples.length < 2) {
				throw new Error(`${p.title} must have at least 2 examples`);
			}

			if (!p.testCases || p.testCases.length < 5) {
				throw new Error(`${p.title} must have at least 5 test cases`);
			}

			return {
				...p,
				slug: slugify(p.title),
				createdBy: req.user._id,
			};
		});

		const createdProblems = await Problem.insertMany(formattedProblems, {
			ordered: false,
		});

		res.status(201).json({
			success: true,
			count: createdProblems.length,
			data: createdProblems,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: error.message || "Bulk insert failed",
		});
	}
};
