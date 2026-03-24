import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Live projector page — full implementation in PR 8
export default function LivePage() {
  return (
    <main>
      <p>Live feed — coming soon</p>
    </main>
  );
}
