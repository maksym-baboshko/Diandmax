import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Personalized invite — full implementation in PR 9
export default async function InvitePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      <p>Invite: {slug} — coming soon</p>
    </main>
  );
}
