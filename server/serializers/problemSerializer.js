export const serializeProblemList = (problem) => ({
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    tags: problem.tags,
});

export const serializeProblemDetail = (problem) => ({
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    constraints: problem.constraints,
    examples: problem.examples,
});
