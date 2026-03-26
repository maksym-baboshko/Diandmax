import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LanguageSwitcher } from "./LanguageSwitcher";

const meta = {
  title: "Features/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-bg-primary p-8">
      <LanguageSwitcher />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await expect(button).toBeEnabled();
    await expect(button).toHaveTextContent(/EN|UA/);
  },
};
