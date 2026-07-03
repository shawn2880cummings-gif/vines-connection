import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]),
  options: z.array(z.string()).min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const checkAnswersSchema = z.object({
  documentId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      answer: z.string().min(1),
    })
  ),
});

export type DocumentInput = z.infer<typeof documentSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type CheckAnswersInput = z.infer<typeof checkAnswersSchema>;
