import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Countdown } from "./Countdown";

const STORYBOOK_FIXED_NOW = Date.UTC(2026, 2, 1, 12, 0, 0);

const meta = {
  title: "Features/Countdown",
  component: Countdown,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Countdown>;

export default meta;

type Story = StoryObj<typeof meta>;

// TODO(a11y): light-theme countdown palette still misses contrast on the numeric display and unit labels.
export const Default: Story = {
  globals: {
    motion: "reduce",
  },
  parameters: {
    a11y: {
      test: "todo",
    },
  },
  render: () => (
    <div className="bg-bg-primary px-8 py-12">
      <Countdown nowMs={STORYBOOK_FIXED_NOW} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const countdown = canvas.getByTestId("countdown");

    await expect(countdown).toBeVisible();
    await expect(countdown).toHaveTextContent(/days|днів/i);
    await expect(countdown).toHaveTextContent(/hours|годин/i);
    await expect(countdown).toHaveTextContent(/mins|хвилин/i);
    await expect(countdown).toHaveTextContent(/secs|секунд/i);
  },
};
