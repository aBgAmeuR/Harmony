import { redirect } from "next/navigation";

export const signOutClient = async () => {
	redirect("/api/signout");
};

export const signInClient = async () => {
	redirect("/api/signin");
};

export const signInDemoClient = async () => {
	redirect("/api/signin-demo");
};
