import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ThemeSwitcher } from "./ThemeSwitcher";

const meta = {
  title: "Features/ThemeSwitcher",
  component: ThemeSwitcher,
  argTypes: {
    className: {
      control: false,
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: {
    locale: "uk",
  },
  render: () => (
    <StorybookCenteredCanvas widthClassName="w-auto" paddingClassName="p-8">
      <ThemeSwitcher />
    </StorybookCenteredCanvas>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole("button");
    await expect(button).toBeEnabled();
    const initialLabel = button.getAttribute("aria-label");

    expect(initialLabel).toMatch(/Перемкнути на (темну|світлу) тему/);

    await userEvent.click(button);

    await waitFor(() =>
      expect(canvas.getByRole("button")).not.toHaveAccessibleName(initialLabel ?? ""),
    );
  },
};
