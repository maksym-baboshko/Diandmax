import { MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT } from "@/entities/event";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeaderboardList } from "./LeaderboardList";

const meta = {
  title: "Widgets/Activity Feed/LeaderboardList",
  component: LeaderboardList,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LeaderboardList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  args: {
    entries: MOCK_POPULATED_ACTIVITY_FEED_SNAPSHOT.leaderboard,
  },
  render: (args) => (
    <div className="w-[min(28rem,92vw)] bg-bg-primary p-6">
      <LeaderboardList {...args} />
    </div>
  ),
};
