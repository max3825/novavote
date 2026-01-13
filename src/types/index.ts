export type QuestionOption = { id: string; title: string; subtitle?: string };
export type Question = { id: string; label: string; options: QuestionOption[] };
export type BallotSubmission = { answers: Record<string, string>; timestamp: string };
