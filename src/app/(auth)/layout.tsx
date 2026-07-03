import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            {APP_NAME}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Private Membership Association
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
