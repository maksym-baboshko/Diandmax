import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./Input";

const meta = {
  title: "Shared UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="w-[min(32rem,90vw)] space-y-4 bg-bg-primary p-8">
      <Input placeholder="Ім'я гостя" />
      <Input error defaultValue="Поле з помилкою" />
      <Input disabled defaultValue="Недоступне поле" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="w-[min(24rem,90vw)] bg-bg-primary p-8">
      <Input placeholder="Ім'я гостя" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Ім'я гостя");

    await userEvent.type(input, "Олена");

    await expect(input).toHaveValue("Олена");
    await expect(input).toHaveFocus();
  },
};
