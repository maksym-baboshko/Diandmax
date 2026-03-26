import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";

const meta = {
  title: "Widgets/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[140vh] bg-bg-primary">
      <Navbar />
      <main id="main-content" className="px-6 pt-32">
        <section id="hero" className="h-[60vh]" />
        <section id="our-story" className="h-[20vh]" />
        <section id="timeline" className="h-[20vh]" />
        <section id="location" className="h-[20vh]" />
        <section id="dress-code" className="h-[20vh]" />
        <section id="gifts" className="h-[20vh]" />
        <section id="rsvp" className="h-[20vh]" />
      </main>
      <div id="site-footer" />
    </div>
  ),
};
