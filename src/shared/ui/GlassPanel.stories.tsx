import { StorybookCenteredCanvas } from "@/testing/storybook/canvas";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlassPanel } from "./GlassPanel";

const meta = {
  title: "Shared UI/GlassPanel",
  component: GlassPanel,
  args: {
    children: null,
  },
  argTypes: {
    children: {
      control: false,
    },
  },
  parameters: {
    controls: {
      disable: true,
    },
    layout: "centered",
  },
} satisfies Meta<typeof GlassPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorybookCenteredCanvas widthClassName="w-[min(40rem,92vw)]" paddingClassName="p-8">
      <GlassPanel contentClassName="p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">Preview shell</p>
        <h3 className="heading-serif mt-4 text-3xl text-text-primary">Glass surface</h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          Reusable elevated panel for RSVP and other interactive surfaces without changing the
          existing visual language.
        </p>
      </GlassPanel>
    </StorybookCenteredCanvas>
  ),
};
