"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  applicationSchema,
  type ApplicationInput,
} from "@/lib/validations/application";
import { APP_NAME } from "@/lib/constants";
import { DocumentReviewStep } from "./document-review-step";

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

const STORAGE_KEY = "paan-apply-progress";

export function ApplyForm() {
  const [phase, setPhase] = useState<
    "loading" | "documents" | "form" | "confirmation"
  >("loading");
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [completedDocuments, setCompletedDocuments] = useState<Set<string>>(
    new Set()
  );
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [formSection, setFormSection] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Load documents and restore progress
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/application-documents");
        const data = await res.json();
        const docs = Array.isArray(data) ? data : [];
        setDocuments(docs);

        // Restore progress from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const completed = new Set<string>(parsed.completedDocuments || []);
            setCompletedDocuments(completed);
            // Find next uncompleted document
            const nextIdx = docs.findIndex(
              (d: AppDocument) => !completed.has(d.id)
            );
            if (nextIdx === -1) {
              // All documents completed
              setPhase("form");
            } else {
              setCurrentDocumentIndex(nextIdx);
              setPhase("documents");
            }
          } catch {
            setPhase(docs.length > 0 ? "documents" : "form");
          }
        } else {
          setPhase(docs.length > 0 ? "documents" : "form");
        }
      } catch {
        // If we can't load documents, skip to form
        setPhase("form");
      }
    }

    load();
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (phase === "loading") return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedDocuments: Array.from(completedDocuments),
      })
    );
  }, [completedDocuments, phase]);

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      preferredName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      dateOfBirth: "",
      reason: "",
      referredBy: "",
      agreedToTerms: false,
      agreedToBylaws: false,
      agreedToMc1r: false,
      agreedToStatementOfFaith: false,
      agreedToPrivateStatus: false,
      agreedToPrivacyPolicy: false,
      agreedVoluntary: false,
      signature: "",
    },
  });

  // Handle document quiz pass
  const handleDocumentPass = () => {
    const doc = documents[currentDocumentIndex];
    const newCompleted = new Set(completedDocuments);
    newCompleted.add(doc.id);
    setCompletedDocuments(newCompleted);

    // Find next uncompleted document
    const nextIdx = documents.findIndex(
      (d, i) => i > currentDocumentIndex && !newCompleted.has(d.id)
    );

    if (nextIdx === -1) {
      // All documents completed
      setPhase("form");
    } else {
      setCurrentDocumentIndex(nextIdx);
    }
  };

  // Submit application form
  const onSubmitApplication = async (data: ApplicationInput) => {
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to submit application");
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      setPhase("confirmation");
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  // Validate and advance form sections
  const validateAndAdvance = async () => {
    setError(null);
    if (formSection === 1) {
      const valid = await form.trigger([
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
        "dateOfBirth",
      ]);
      if (valid) setFormSection(2);
    } else if (formSection === 2) {
      const valid = await form.trigger(["reason"]);
      if (valid) setFormSection(3);
    } else if (formSection === 3) {
      const valid = await form.trigger([
        "agreedToTerms",
        "agreedToBylaws",
        "agreedToMc1r",
        "agreedToStatementOfFaith",
        "agreedToPrivateStatus",
        "agreedToPrivacyPolicy",
        "agreedVoluntary",
      ]);
      if (valid) setFormSection(4);
    }
  };

  // Calculate progress
  const totalSteps = documents.length + 2; // docs + form + confirmation
  const currentStepNumber =
    phase === "documents"
      ? currentDocumentIndex + 1
      : phase === "form"
        ? documents.length + 1
        : documents.length + 2;
  const progressPercent = Math.round((currentStepNumber / totalSteps) * 100);

  const currentStepLabel =
    phase === "documents"
      ? `Document Review: ${documents[currentDocumentIndex]?.title || ""}`
      : phase === "form"
        ? "Application Form"
        : "Confirmation";

  // Loading state
  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Confirmation
  if (phase === "confirmation") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold">
              Application Received
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                Thank you for your interest in joining {APP_NAME}. Your
                application has been received.
              </p>
              <p className="text-sm">
                The Board of Trustees will review your application. You will
                receive an email notification once a decision has been made. This
                process typically takes 3-5 business days.
              </p>
              <div className="rounded-lg bg-muted/50 p-4 text-sm text-left space-y-2">
                <p className="font-medium text-foreground">
                  What happens next:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Board reviews your application</li>
                  <li>You receive an approval notification via email</li>
                  <li>Complete your admission contribution ($180)</li>
                  <li>Receive your Certificate of Beneficial Interest (CBI)</li>
                  <li>Access the members-only portal</li>
                </ol>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <Link
            href="/"
            className="text-2xl font-heading font-bold text-gradient-gold"
          >
            {APP_NAME}
          </Link>
          <p className="text-sm text-muted-foreground">
            Membership Application
          </p>
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Step {currentStepNumber} of {totalSteps}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} />
          <p className="text-sm font-medium text-center">{currentStepLabel}</p>
        </div>

        {/* Document Review Phase */}
        {phase === "documents" && documents[currentDocumentIndex] && (
          <DocumentReviewStep
            key={documents[currentDocumentIndex].id}
            document={documents[currentDocumentIndex]}
            documentIndex={currentDocumentIndex}
            totalDocuments={documents.length}
            onPass={handleDocumentPass}
          />
        )}

        {/* Application Form Phase */}
        {phase === "form" && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">
                {formSection === 1 && "Personal Information"}
                {formSection === 2 && "Statement of Interest"}
                {formSection === 3 && "Agreements & Acknowledgments"}
                {formSection === 4 && "Digital Signature"}
              </CardTitle>
              <CardDescription>Section {formSection} of 4</CardDescription>
              <div className="flex gap-1.5 pt-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full ${
                      s <= formSection ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitApplication)}
                  className="space-y-4"
                >
                  {error && (
                    <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Section 1: Personal Info */}
                  {formSection === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Legal First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Legal Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="preferredName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="How you'd like to be addressed (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="(555) 555-5555"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mailing Address *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Street address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code *</FormLabel>
                              <FormControl>
                                <Input placeholder="ZIP" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={validateAndAdvance}
                      >
                        Continue
                      </Button>
                    </>
                  )}

                  {/* Section 2: Statement of Interest */}
                  {formSection === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Why do you wish to join {APP_NAME}? *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Share your interest in the ministry, your connection to Aboriginal American heritage, and what you hope to contribute to and gain from this fellowship..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="referredBy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Referred by (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Name of the member who referred you"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setFormSection(1)}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          className="flex-1"
                          onClick={validateAndAdvance}
                        >
                          Continue
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Section 3: Required Disclosures & Agreements */}
                  {formSection === 3 && (
                    <>
                      {documents.length > 0 && (
                        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                          <p className="font-medium text-foreground">
                            Document Acknowledgments
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You have read and passed the comprehension quiz for
                            all required documents.
                          </p>
                          <div className="space-y-2">
                            {documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{doc.title}</span>
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-600"
                                >
                                  Quiz Passed
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                        <p className="font-semibold text-foreground text-sm uppercase tracking-wide">
                          Required Disclosures &mdash; Please Review Before Applying
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Before submitting your application, you are required to
                          review the following governing documents of the Ministry.
                          By checking each box below, you confirm that you have read
                          and understood each document and that you are applying for
                          membership voluntarily, without coercion, and with full
                          knowledge of the Ministry&apos;s private status,
                          jurisdictional framework, and membership terms.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="agreedToStatementOfFaith"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I have read and understood the{" "}
                                <Link
                                  href="/statement-of-faith"
                                  target="_blank"
                                  className="text-primary underline underline-offset-4"
                                >
                                  Statement of Faith
                                </Link>{" "}
                                *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreedToPrivateStatus"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I have read and understood the{" "}
                                <Link
                                  href="/private-status"
                                  target="_blank"
                                  className="text-primary underline underline-offset-4"
                                >
                                  Notice of Private Status
                                </Link>{" "}
                                *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreedToPrivacyPolicy"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I have read and understood the{" "}
                                <Link
                                  href="/privacy"
                                  target="_blank"
                                  className="text-primary underline underline-offset-4"
                                >
                                  Privacy Policy &amp; Member Data Protection Covenant
                                </Link>{" "}
                                *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreedToTerms"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I have read and understood the Private Membership
                                Agreement *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreedToBylaws"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I understand that this Ministry is a Private
                                Membership Association and is not a public
                                accommodation *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreedToMc1r"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I acknowledge the MC1R biological verification
                                requirement *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreedVoluntary"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>
                                I am applying for membership voluntarily, without
                                coercion, and of my own free will *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setFormSection(2)}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          className="flex-1"
                          disabled={
                            !form.watch("agreedToTerms") ||
                            !form.watch("agreedToBylaws") ||
                            !form.watch("agreedToMc1r") ||
                            !form.watch("agreedToStatementOfFaith") ||
                            !form.watch("agreedToPrivateStatus") ||
                            !form.watch("agreedToPrivacyPolicy") ||
                            !form.watch("agreedVoluntary")
                          }
                          onClick={validateAndAdvance}
                        >
                          Continue
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Section 4: Signature & Submit */}
                  {formSection === 4 && (
                    <>
                      <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                        <p className="font-medium text-foreground">
                          Before you sign:
                        </p>
                        <p>
                          By providing your digital signature below, you confirm
                          that all information provided is true and accurate, and
                          you agree to the PMA Agreement, Bylaws, and MC1R
                          Biological Verification Acknowledgment.
                        </p>
                        <p>
                          After submitting, your application will be sent to the
                          Board of Trustees for review.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="signature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Digital Signature (type your full legal name) *
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="font-heading italic text-lg"
                                placeholder="Your full legal name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-muted-foreground">
                              By typing your name above, you are executing a
                              legally binding digital signature confirming your
                              voluntary agreement to all terms set forth in this
                              application.
                            </p>
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setFormSection(3)}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={
                            !form.watch("signature") ||
                            form.formState.isSubmitting
                          }
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline ml-1"
              >
                Sign in
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* Privacy notice */}
        <p className="text-xs text-center text-muted-foreground max-w-md mx-auto">
          Your information is protected under our{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          . {APP_NAME} is a Private Membership Association — your data is never
          shared with third parties.
        </p>
      </div>
    </div>
  );
}
