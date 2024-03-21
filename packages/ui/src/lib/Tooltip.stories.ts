import type { Meta, StoryObj } from "@storybook/svelte";
import type TooltipView from "./TooltipView.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
    title: "UI/Tooltip",
    tags: ["autodocs"],
    argTypes: {
        text: { control: "text" },
        image: { control: "text" },
    },
} satisfies Meta<TooltipView>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Future: Story = {
    args: {
    },
};
