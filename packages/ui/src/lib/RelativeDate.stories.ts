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

export const YearsAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    },
};

export const MonthsAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
};

export const WeeksAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
};

export const DaysAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
};

export const HoursAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000 * 60 * 60),
    },
};

export const MinutesAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000 * 60),
    },
};

export const SecondsAgo: Story = {
    args: {
        date: new Date(Date.now() - 1000),
    },
};

export const Now: Story = {
    args: {
        date: new Date(),
    },
};

export const Future: Story = {
    args: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
};
