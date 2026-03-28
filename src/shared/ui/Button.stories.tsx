import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Shared UI/Button",
  component: Button,
  args: {
    children: "Primary",
    size: "md",
    variant: "primary",
  },
  argTypes: {
    children: {
      control: "text",
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderButtonStory(args: React.ComponentProps<typeof Button>) {
  return (
    <StorybookCenteredCanvas widthClassName="w-auto" paddingClassName="p-8">
      <Button {...args} />
    </StorybookCenteredCanvas>
  );
}

export const Primary: Story = {
  render: renderButtonStory,
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
  render: renderButtonStory,
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
  render: renderButtonStory,
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
  render: renderButtonStory,
};

export const Sizes: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: () => (
    <StorybookCenteredCanvas widthClassName="w-auto" paddingClassName="p-8">
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </StorybookCenteredCanvas>
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
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: () => <InteractiveButtonDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Натиснути" });

    await userEvent.click(button);

    await expect(canvas.getByText("Натиснуто")).toBeVisible();
  },
};
