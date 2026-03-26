import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Countdown } from "./Countdown";

const meta = {
  title: "Features/Countdown",
  component: Countdown,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
    layout: "centered",
  },
} satisfies Meta<typeof Countdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-bg-primary px-8 py-12">
      <Countdown />
    </div>
  ),
};
