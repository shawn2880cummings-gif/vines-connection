"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DonationForm() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const num = parseFloat(amount);
    if (!num || num < 1) {
      setError("Please enter an amount of at least $1");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num, email: email || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Failed to connect. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contribution-amount" className="text-sm font-medium">
          Contribution Amount (USD)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            $
          </span>
          <Input
            id="contribution-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-7"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contribution-email" className="text-sm font-medium">
          Email <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="contribution-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-paan-gold hover:bg-paan-gold-light text-paan-earth font-semibold"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="mr-2 h-4 w-4" />
        )}
        Submit Contribution
      </Button>
    </form>
  );
}
