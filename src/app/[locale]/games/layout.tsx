import { GamesShell } from "@/widgets/games-shell";

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GamesShell>{children}</GamesShell>;
}
