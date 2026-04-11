import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
	input: String,
	output: String,
	explanation: String,
});

const testCaseSchema = new mongoose.Schema({
	input: String,
	output: String,
	isHidden: {
		type: Boolean,
		default: true,
	},
});

const problemSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		slug: {
			type: String,
			required: true,
			unique: true,
		},

		description: {
			type: String,
			required: true,
		},

		difficulty: {
			type: String,
			enum: ["easy", "medium", "hard"],
			required: true,
		},

		tags: [String],

		constraints: {
			type: String,
		},

		examples: [exampleSchema],

		testCases: [testCaseSchema],

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AuthUser",
		},
	},
	{ timestamps: true },
);

export default mongoose.model("Problem", problemSchema);
