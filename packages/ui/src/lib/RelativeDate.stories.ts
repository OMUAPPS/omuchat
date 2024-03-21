import type { Meta, StoryObj } from "@storybook/svelte";
import RelativeDate from "./RelativeDate.svelte";

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
    title: "UI/Date",
    component: RelativeDate,
    tags: ["autodocs"],
    argTypes: {
        date: { control: "date" },
    },
} satisfies Meta<RelativeDate>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Future: Story = {
    args: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
};
