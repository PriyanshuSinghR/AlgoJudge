import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// =======================
// CODE EXPLANATION
// =======================
export const explainCodeAI = async ({ code, language }) => {
	const lang = language || "code";

	const prompt = `
You are an expert ${lang} engineer and a great teacher. Analyze the code below and return a structured explanation in Markdown.

Format your response EXACTLY like this:

---

## 🧠 What this code does
One paragraph overview in plain English. No jargon.

---

## 🔍 Step-by-step breakdown

For each meaningful section of the code:

\`\`\`${lang}
// relevant snippet
\`\`\`

> **What's happening:** Short explanation of this part.

(Repeat 3–6 times)

---

## ⚡ Complexity Analysis

| | Complexity | Why |
|---|---|---|
| **Time** | O(?) | Brief reason |
| **Space** | O(?) | Brief reason |

---

## 💡 Key Concepts Used
- **Concept name** — one sentence on why it matters here
(List 2–4 key patterns/data structures/algorithms used)

---

## ✨ Potential Improvements
1–2 suggestions, OR write "This solution is already optimal."

---

Code to analyze (${lang}):
\`\`\`${lang}
${code}
\`\`\`

Rules:
- Use proper Markdown throughout
- Keep explanations beginner-friendly  
- Do NOT add any text before or after the formatted response
`;

	const response = await ai.models.generateContent({
		model: MODEL,
		contents: prompt,
	});
	return response.text;
};

// =======================
// HINT GENERATION
// =======================

const HINT_CONFIGS = {
	1: {
		label: "Level 1 — High-Level Direction",
		tone: "Conceptual nudge only. Suggest what category of algorithm/data structure could help. No code, no specifics.",
		format: `
## 💡 Hint 1 — Think About This

> _A gentle push in the right direction._

[One paragraph: describe the general strategy without naming the exact solution]

### What to ask yourself
- [Guiding question 1]
- [Guiding question 2]

> **Still stuck?** Unlock Hint 2 for a more concrete direction.
`,
	},
	2: {
		label: "Level 2 — Approach Hint",
		tone: "Name the data structure and approach. Mention time complexity target. No actual code.",
		format: `
## 💡 Hint 2 — The Approach

> _You're getting warmer._

[1–2 paragraphs: name the data structure/pattern, explain the insight without revealing full implementation]

### The key insight
\`[pseudocode or plain-English of the core idea — NOT the full solution]\`

### Complexity to aim for
- **Time:** O(?)
- **Space:** O(?)

> **Still stuck?** Hint 3 will show you the skeleton.
`,
	},
	3: {
		label: "Level 3 — Concrete Direction",
		tone: "Show the solution skeleton — what to initialize, loop, check — without writing the full working code.",
		format: `
## 💡 Hint 3 — Almost There

> _One last nudge before you nail it._

[Describe the exact structure: what to initialize, loop over, check/store]

### Skeleton to follow
\`\`\`
// Fill in the logic yourself:
initialize [what]
for each [what] in [input]:
    check if [what] exists in [what]
    if yes → [action]
    else  → [action]
return [what]
\`\`\`

### What your current code is missing
[Specific observation about the user's code — where it goes wrong or what is inefficient]

> You have everything you need. Go write it! 🚀
`,
	},
};

export const generateHintAI = async ({ problem, userCode, level = 1 }) => {
	const config = HINT_CONFIGS[level] || HINT_CONFIGS[1];

	const codeSection = userCode?.trim()
		? `**User's current code:**\n\`\`\`\n${userCode}\n\`\`\``
		: "**User's current code:** Not written yet.";

	const prompt = `
You are a brilliant but patient coding mentor. Give a hint — NOT the solution.

**Hint Level:** ${config.label}
**Tone:** ${config.tone}

---

**Problem:**
${problem}

${codeSection}

---

**Respond in this EXACT Markdown format:**

${config.format}

---

Rules:
- Use proper Markdown (headers, bold, code blocks, blockquotes)
- NEVER reveal the full solution
- Be warm and encouraging
- If user's code has a specific bug/misconception, gently address it
- Do NOT add any text before or after the formatted response
`;

	const response = await ai.models.generateContent({
		model: MODEL,
		contents: prompt,
	});
	return response.text;
};
