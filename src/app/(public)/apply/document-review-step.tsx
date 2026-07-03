"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  options: string[];
  sortOrder: number;
}

interface AppDocument {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
  questions: Question[];
}

interface Props {
  document: AppDocument;
  documentIndex: number;
  totalDocuments: number;
  onPass: () => void;
}

export function DocumentReviewStep({
  document,
  documentIndex,
  totalDocuments,
  onPass,
}: Props) {
  const [subPhase, setSubPhase] = useState<"reading" | "quiz">("reading");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<
    { questionId: string; correct: boolean }[] | null
  >(null);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setFailed(false);
    setQuizResults(null);

    try {
      const answerArray = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const res = await fetch("/api/application-documents/check-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: document.id,
          answers: answerArray,
        }),
      });

      const data = await res.json();

      if (data.passed) {
        onPass();
      } else {
        setQuizResults(data.results);
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReread = () => {
    setSubPhase("reading");
    setAnswers({});
    setQuizResults(null);
    setFailed(false);
  };

  const allAnswered = document.questions.every((q) => answers[q.id]);

  const getQuestionResult = (questionId: string) => {
    if (!quizResults) return null;
    return quizResults.find((r) => r.questionId === questionId);
  };

  // Reading phase
  if (subPhase === "reading") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <BookOpen className="h-4 w-4" />
            Document {documentIndex + 1} of {totalDocuments}
          </div>
          <CardTitle className="font-heading">{document.title}</CardTitle>
          <CardDescription>
            Please read this document carefully. You will be quizzed on its
            content before you can proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <ScrollArea className="h-[60vh] p-4 md:p-6">
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                {document.content}
              </pre>
            </ScrollArea>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => setSubPhase("quiz")}
          >
            I&apos;ve Read This Document — Continue to Quiz
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Quiz phase
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <BookOpen className="h-4 w-4" />
          Document {documentIndex + 1} of {totalDocuments}
        </div>
        <CardTitle className="font-heading">Quiz: {document.title}</CardTitle>
        <CardDescription>
          Answer all questions correctly to proceed. You must get every question
          right.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {failed && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                You did not pass the quiz. Please re-read the document and try
                again.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleReread}
              >
                <BookOpen className="mr-1 h-3 w-3" />
                Re-read Document
              </Button>
            </div>
          </div>
        )}

        {document.questions.map((q, idx) => {
          const result = getQuestionResult(q.id);
          const isWrong = result && !result.correct;
          const options =
            q.questionType === "TRUE_FALSE"
              ? ["True", "False"]
              : (q.options as string[]);

          return (
            <div
              key={q.id}
              className={`space-y-3 rounded-lg border p-4 ${
                isWrong ? "border-destructive bg-destructive/5" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-muted-foreground shrink-0">
                  {idx + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.questionText}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {q.questionType === "TRUE_FALSE"
                      ? "True/False"
                      : "Multiple Choice"}
                  </Badge>
                </div>
                {result && (
                  <span className="shrink-0">
                    {result.correct ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </span>
                )}
              </div>
              <RadioGroup
                value={answers[q.id] || ""}
                onValueChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: value }))
                }
                disabled={failed}
              >
                {options.map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                    <Label
                      htmlFor={`${q.id}-${opt}`}
                      className="text-sm cursor-pointer"
                    >
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}

        {!failed && (
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmitQuiz}
            disabled={!allAnswered || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Answers...
              </>
            ) : (
              "Submit Answers"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
