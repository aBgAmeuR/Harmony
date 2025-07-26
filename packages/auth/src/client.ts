import { redirect } from "next/navigation";

export const signOutClient = async () => {
	redirect("/signout");
};

export const signInClient = async () => {
	redirect("/signin");
};

export const signInDemoClient = async () => {
	redirect("/signin-demo");
};
