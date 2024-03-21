import type { Meta, StoryObj } from "@storybook/svelte";
import RelativeDate from "./RelativeDate.svelte";

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

export const MonthsLater: Story = {
    args: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
};

export const Future: Story = {
    args: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
};
