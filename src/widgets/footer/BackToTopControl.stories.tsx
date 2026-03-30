import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackToTopControl } from "./BackToTopControl";

const meta = {
  title: "Widgets/Footer/BackToTopControl",
  component: BackToTopControl,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BackToTopControl>;

export default meta;

type Story = StoryObj<typeof meta>;

// TODO(a11y): footer microcopy in the secondary surface needs stronger contrast before this can block.
export const Default: Story = {
  args: {
    label: "Наверх",
  },
  globals: {
    motion: "reduce",
  },
  parameters: {
    a11y: {
      test: "todo",
    },
  },
  render: (args) => (
    <StorybookCenteredCanvas widthClassName="w-auto" tone="secondary" paddingClassName="p-8">
      <BackToTopControl {...args} />
    </StorybookCenteredCanvas>
  ),
};
