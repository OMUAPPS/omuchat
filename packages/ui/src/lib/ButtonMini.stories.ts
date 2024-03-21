import type { Meta, StoryObj } from "@storybook/svelte";
import ButtonMiniView from "./ButtonMiniView.svelte";

const meta = {
    title: "UI/ButtonMini",
    component: ButtonMiniView,
    tags: ["autodocs"],
    argTypes: {
        text: { control: "text" },
        icon: { control: "text" },
    },
} satisfies Meta<ButtonMiniView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "This is a button icon",
        icon: "close",
    },
};
