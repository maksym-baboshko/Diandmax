import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Shared UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  args: {
    children: "Primary",
  },
  render: () => (
    <div className="flex flex-col gap-6 bg-bg-primary p-8">
      <div className="flex flex-wrap gap-4">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
};

function InteractiveButtonDemo() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 bg-bg-primary p-8">
      <Button onClick={() => setClicked(true)}>Натиснути</Button>
      <p className="text-sm text-text-secondary">{clicked ? "Натиснуто" : "Очікує дії"}</p>
    </div>
  );
}

export const Interactive: Story = {
  args: {
    children: "Натиснути",
  },
  render: () => <InteractiveButtonDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Натиснути" });

    await userEvent.click(button);

    await expect(canvas.getByText("Натиснуто")).toBeVisible();
  },
};
