import Problem from "../model/problem.js";

export const getProblems = async (req, res) => {
	try {
		const problems = await Problem.find().select("title difficulty tags slug");

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
		});

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
