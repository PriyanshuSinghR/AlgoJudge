import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AuthUser",
			required: true,
		},
		problem: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Problem",
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["Accepted", "Wrong Answer", "Runtime Error"],
			required: true,
		},
		failedTestCase: {
			type: Number,
			default: null,
		},
		runtime: {
			type: String,
			default: null,
		},
		memory: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Submission", submissionSchema);
