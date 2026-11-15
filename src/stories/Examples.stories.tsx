import React from "react";
import { BusinessDashboard } from "../examples/BusinessDashboard.jsx";
import { SignIn } from "../examples/SignIn.jsx";

export default {
  title: "Examples",
  parameters: { layout: "fullscreen" },
};

export const BusinessDashboardScreen = { render: () => <BusinessDashboard /> };
export const SignInScreen = { render: () => <SignIn /> };
