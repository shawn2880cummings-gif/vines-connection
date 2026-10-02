import CommunityProvider from "@/components/community/CommunityProvider";
import CommunityNav from "@/components/community/CommunityNav";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 pt-24 pb-28 [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]">
      <CommunityProvider>
        <CommunityNav />
        {children}
      </CommunityProvider>
    </div>
  );
}
