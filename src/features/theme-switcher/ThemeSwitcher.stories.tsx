import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ThemeSwitcher } from "./ThemeSwitcher";

const meta = {
  title: "Features/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-bg-primary p-8">
      <ThemeSwitcher />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(document.documentElement.classList.contains("dark")).toBe(false);

    await userEvent.click(button);

    await expect(document.documentElement.classList.contains("dark")).toBe(true);
  },
};
