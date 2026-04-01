import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Textarea } from "./Textarea";

const meta = {
  title: "Shared UI/Textarea",
  component: Textarea,
  args: {
    placeholder: "Побажання для пари",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderTextareaStory(args: React.ComponentProps<typeof Textarea>) {
  return (
    <StorybookCenteredCanvas widthClassName="w-[min(32rem,90vw)]" paddingClassName="p-8">
      <Textarea {...args} />
    </StorybookCenteredCanvas>
  );
}

export const Default: Story = {
  render: renderTextareaStory,
};

export const ErrorState: Story = {
  args: {
    defaultValue: "Поле з помилкою",
    error: true,
  },
  render: renderTextareaStory,
};

export const Disabled: Story = {
  args: {
    defaultValue: "Недоступне поле",
    disabled: true,
  },
  render: renderTextareaStory,
};

export const Interactive: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: () => (
    <StorybookCenteredCanvas widthClassName="w-[min(24rem,90vw)]" paddingClassName="p-8">
      <Textarea placeholder="Побажання для пари" />
    </StorybookCenteredCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText("Побажання для пари");

    await userEvent.type(textarea, "Нехай цей день буде незабутнім");

    await expect(textarea).toHaveValue("Нехай цей день буде незабутнім");
    await expect(textarea).toHaveFocus();
  },
};
