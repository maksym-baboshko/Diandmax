import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeaderboardState } from "./LeaderboardState";

const meta = {
  title: "Widgets/Activity Feed/LeaderboardState",
  component: LeaderboardState,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LeaderboardState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => (
    <div className="w-[min(28rem,92vw)] bg-bg-primary p-6">
      <LeaderboardState />
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="w-[min(28rem,92vw)] bg-bg-primary p-6">
      <LeaderboardState variant="error" />
    </div>
  ),
};
