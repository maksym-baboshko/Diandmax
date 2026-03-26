import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Textarea } from "./Textarea";

const meta = {
  title: "Shared UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="w-[min(32rem,90vw)] space-y-4 bg-bg-primary p-8">
      <Textarea placeholder="Побажання для пари" />
      <Textarea error defaultValue="Поле з помилкою" />
      <Textarea disabled defaultValue="Недоступне поле" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="w-[min(24rem,90vw)] bg-bg-primary p-8">
      <Textarea placeholder="Побажання для пари" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Побажання для пари");

    await userEvent.type(textarea, "Нехай цей день буде незабутнім");

    await expect(textarea).toHaveValue("Нехай цей день буде незабутнім");
    await expect(textarea).toHaveFocus();
  },
};
