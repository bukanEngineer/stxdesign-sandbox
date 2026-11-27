import React from "react";
import { expect } from "storybook/test";
import { CardAsset } from "./CardAsset";

export default {
  title: "Patterns/Card/Asset",
  component: CardAsset,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    banner: { control: "text" },
    className: { control: "text" },
    onRefresh: { action: "onRefresh" },
    onAdd: { action: "onAdd" },
    onSend: { action: "onSend" },
  },
  args: {
    title: "My Assets",
    banner: "",
  },
};

const assets = [
  {
    symbol: "XSGD",
    subtitle: "1:1 to SGD",
    balance: "1,123,456.00",
    fiat: "~2,032 SGD",
    networks: [{ name: "Ethereum" }, { name: "Polygon" }, { name: "Avalanche" }, { name: "Solana" }, { name: "Base" }],
  },
  {
    symbol: "XUSD",
    subtitle: "1:1 to USD",
    balance: "1,123,456.00",
    fiat: "~2,032 SGD",
    networks: [{ name: "Ethereum" }, { name: "BSC" }],
  },
  {
    symbol: "USDC",
    balance: "1,123,456.00",
    fiat: "~2,032 SGD",
    networks: [{ name: "Ethereum" }, { name: "Polygon" }],
  },
  {
    symbol: "USDT",
    balance: "1,123,456.00",
    fiat: "~2,032 SGD",
    networks: [{ name: "Ethereum" }, { name: "Tron" }, { name: "BSC" }],
  },
];

export const StablecoinWallet = {
  args: { title: "My Assets", assets, onRefresh: () => {}, onAdd: () => {}, onSend: () => {} },
  decorators: [(S) => <div style={{ maxWidth: 684 }}><S /></div>],
};

export const WithBanner = {
  args: {
    title: "My Assets",
    assets: assets.slice(0, 2),
    banner: "XSGD and XUSD are StraitsX-issued stablecoins regulated by MAS. They are backed 1:1 by SGD and USD respectively.",
    onRefresh: () => {},
  },
  decorators: [(S) => <div style={{ maxWidth: 684 }}><S /></div>],
};

export const SingleAsset = {
  args: { title: "Cash Wallet", assets: [assets[0]] },
  decorators: [(S) => <div style={{ maxWidth: 684 }}><S /></div>],
};

/** Phone width: rows show a chevron instead of Add / Send so the name and balance fit. */
export const Mobile = {
  args: { title: "My Assets", assets, platform: "mobile", onSelect: () => {} },
  decorators: [(S) => <div style={{ width: 390 }}><S /></div>],
  play: async ({ canvasElement }) => {
    for (const title of canvasElement.querySelectorAll(".list-asset .list-item__title")) {
      await expect(title.getBoundingClientRect().width).toBeGreaterThan(40);
    }
    await expect(canvasElement.querySelector(".list-asset__actions")).toBeNull();
  },
};

/** `platform="auto"` switches to the mobile rows at viewport widths up to 599px. */
export const Auto = {
  args: { title: "My Assets", assets, platform: "auto", onAdd: () => {}, onSend: () => {}, onSelect: () => {} },
};

