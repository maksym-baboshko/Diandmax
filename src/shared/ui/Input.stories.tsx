import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./Input";

const meta = {
  title: "Shared UI/Input",
  component: Input,
  args: {
    placeholder: "Ім'я гостя",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

function renderInputStory(args: React.ComponentProps<typeof Input>) {
  return (
    <StorybookCenteredCanvas widthClassName="w-[min(32rem,90vw)]" paddingClassName="p-8">
      <Input {...args} />
    </StorybookCenteredCanvas>
  );
}

export const Default: Story = {
  render: renderInputStory,
};

export const ErrorState: Story = {
  args: {
    defaultValue: "Поле з помилкою",
    error: true,
  },
  render: renderInputStory,
};

export const Disabled: Story = {
  args: {
    defaultValue: "Недоступне поле",
    disabled: true,
  },
  render: renderInputStory,
};

export const Interactive: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: () => (
    <StorybookCenteredCanvas widthClassName="w-[min(24rem,90vw)]" paddingClassName="p-8">
      <Input placeholder="Ім'я гостя" />
    </StorybookCenteredCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Ім'я гостя");

    await userEvent.type(input, "Олена");

    await expect(input).toHaveValue("Олена");
    await expect(input).toHaveFocus();
  },
};
