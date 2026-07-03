"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

const PMA_TERMS = `PRIVATE MEMBERSHIP ASSOCIATION AGREEMENT

By registering as a member of PAAN MINISTRIES Private Membership Association (PMA), you acknowledge and agree to the following:

1. PAAN MINISTRIES is a Private Membership Association operating under the First and Fourteenth Amendments of the United States Constitution.

2. As a private association, we operate outside the jurisdiction of federal and state regulatory agencies, including but not limited to the FDA, FTC, and other government bodies.

3. All members have voluntarily chosen to associate with one another for mutual benefit and have a common goal of spiritual growth, education, and fellowship.

4. Members agree to hold harmless PAAN MINISTRIES, its trustees, officers, and fellow members from any liability arising from participation in association activities.

5. Membership is by invitation only and may be revoked at the discretion of the association's leadership.

6. All information shared within the association is considered private and confidential.

7. Members agree to abide by the bylaws and code of conduct of the association.

8. By joining, you affirm that you are at least 18 years of age and are joining of your own free will.`;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [codeChecking, setCodeChecking] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      inviteCode: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const validateCode = async (code: string) => {
    if (!code) return;
    setCodeChecking(true);
    try {
      const res = await fetch("/api/invite-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setCodeValid(data.valid);
      if (data.valid) {
        setStep(2);
        setError(null);
      } else {
        setError(data.error || "Invalid invite code");
      }
    } catch {
      setError("Failed to validate code");
      setCodeValid(false);
    } finally {
      setCodeChecking(false);
    }
  };

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          {step === 1 && "Enter your invite code to get started"}
          {step === 2 && "Fill in your details"}
          {step === 3 && "Review and accept the PMA terms"}
        </CardDescription>
        <div className="flex gap-2 pt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Step 1: Invite Code */}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your invite code"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.toUpperCase());
                              setCodeValid(null);
                              setError(null);
                            }}
                          />
                          {codeValid === true && (
                            <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                          )}
                          {codeValid === false && (
                            <XCircle className="absolute right-3 top-2.5 h-5 w-5 text-destructive" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  className="w-full"
                  disabled={!form.watch("inviteCode") || codeChecking}
                  onClick={() => validateCode(form.getValues("inviteCode"))}
                >
                  {codeChecking && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify Code
                </Button>
              </>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Min 8 characters"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
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
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => {
                      const values = form.getValues();
                      if (
                        values.firstName &&
                        values.lastName &&
                        values.email &&
                        values.password &&
                        values.password === values.confirmPassword
                      ) {
                        setStep(3);
                        setError(null);
                      } else {
                        setError("Please fill in all fields correctly");
                      }
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Terms Agreement */}
            {step === 3 && (
              <>
                <div className="rounded-md border">
                  <ScrollArea className="h-48 p-4">
                    <pre className="whitespace-pre-wrap text-xs text-muted-foreground font-sans">
                      {PMA_TERMS}
                    </pre>
                  </ScrollArea>
                </div>
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
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I have read and agree to the PMA terms and conditions
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      !form.watch("agreedToTerms") ||
                      form.formState.isSubmitting
                    }
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline ml-1">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
