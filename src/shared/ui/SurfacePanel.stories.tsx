import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SurfacePanel } from "./SurfacePanel";

const meta = {
  title: "Shared UI/SurfacePanel",
  component: SurfacePanel,
  args: {
    children: null,
    hoverable: true,
    tone: "default",
  },
  argTypes: {
    children: {
      control: false,
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SurfacePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

function ExampleSurface({
  hoverable,
  tone,
}: {
  hoverable: boolean;
  tone: "default" | "subtle" | "highlighted";
}) {
  return (
    <StorybookCenteredCanvas widthClassName="w-[min(40rem,92vw)]" paddingClassName="p-8">
      <SurfacePanel tone={tone} hoverable={hoverable} contentClassName="p-8">
        <p className="surface-panel-label">Canonical surface</p>
        <h3 className="heading-serif mt-4 text-3xl text-text-primary">
          {tone === "default" ? "Default" : tone === "subtle" ? "Subtle" : "Highlighted"} panel
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          Use this as the shared invitation-first surface language instead of introducing another
          one-off card recipe.
        </p>
      </SurfacePanel>
    </StorybookCenteredCanvas>
  );
}

export const Default: Story = {
  render: (args) => <ExampleSurface hoverable={args.hoverable ?? true} tone="default" />,
};

export const Subtle: Story = {
  args: {
    tone: "subtle",
  },
  render: (args) => <ExampleSurface hoverable={args.hoverable ?? true} tone="subtle" />,
};

export const Highlighted: Story = {
  args: {
    tone: "highlighted",
  },
  render: (args) => <ExampleSurface hoverable={args.hoverable ?? true} tone="highlighted" />,
};

export const DarkSurface: Story = {
  args: {
    tone: "subtle",
  },
  globals: {
    theme: "dark",
  },
  render: (args) => <ExampleSurface hoverable={args.hoverable ?? true} tone="subtle" />,
};
