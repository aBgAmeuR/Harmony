import { ArrowRight, GithubIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";

import { GetDemoBtn } from "../get-demo-btn";
import { Announcement } from "./announcement";
import { GetStartedBtn } from "./get-started-btn";
import {
	PageActions,
	PageHeader,
	PageHeaderDescription,
	PageHeaderHeading,
} from "./page-header";

export const Hero = () => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";

	return (
		<PageHeader>
			{/* <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,rgba(255,255,255,0.8),transparent)]",
          "animate-appear-zoom opacity-0 delay-600",
        )}
        width={50}
        height={50}
        squares={[80, 80]}
        strokeDasharray={"4 2"}
        squaresClassName="hover:fill-chart-1"
      /> */}
			<Announcement className="z-10 animate-appear" />
			<div
				aria-hidden="true"
				className="-top-96 -translate-x-1/2 absolute start-1/2 flex max-w-full overflow-hidden"
			>
				<div className="-translate-x-40 h-[44rem] w-[25rem] max-w-full rotate-[-60deg] bg-gradient-to-r from-background/50 to-background blur-3xl" />
				<div className="-rotate-12 -translate-x-60 h-[50rem] w-[90rem] max-w-full origin-top-left rounded-full bg-gradient-to-tl from-primary-foreground via-primary-foreground to-background blur-3xl" />
			</div>
			<PageHeaderHeading className="animate-appear opacity-0 delay-100">
				Discover Your Listening Story
			</PageHeaderHeading>
			<PageHeaderDescription className=" animate-appear opacity-0 delay-200">
				Get statistics on your Spotify account. Upload your Spotify data and get
				insights on your listening habits and more detailed information about
				your account.
			</PageHeaderDescription>
			<PageActions className="animate-appear flex-col opacity-0 delay-300">
				<div className="flex items-center justify-center space-x-4">
					<GetStartedBtn>Get Started</GetStartedBtn>
					<Link
						target="\_blank"
						rel="noreferrer"
						href="https://github.com/aBgAmeuR/Harmony"
						className={cn("group", buttonVariants({ variant: "outline" }))}
					>
						<GithubIcon className="size-4" />
						Github
						<ArrowRight
							className="opacity-60 transition-transform group-hover:translate-x-0.5"
							size={16}
							strokeWidth={2}
							aria-hidden="true"
						/>
					</Link>
				</div>
				{!isMaintenance ? (
					<GetDemoBtn label="Get a demo of Harmony" className="mt-2" />
				) : null}
			</PageActions>
		</PageHeader>
	);

	// return (
	//   <section className="relative overflow-hidden py-32">
	//     <div className="container">
	//       <div className="magicpattern absolute inset-x-0 top-0 -z-10 flex size-full items-center justify-center opacity-100" />
	//       <div className="mx-auto flex max-w-5xl flex-col items-center">
	//         <div className="z-10 flex flex-col items-center gap-6 text-center">
	//           {/* <Icons.logo className="size-12 md:size-16" /> */}
	//           <Badge variant="outline">UI Blocks</Badge>
	//           <div>
	//             <h1 className="mb-6 text-pretty text-2xl font-bold lg:text-5xl">
	//               Build your next project with Blocks
	//             </h1>
	//             <p className="text-muted-foreground lg:text-xl">
	//               Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
	//               doloremque mollitia fugiat omnis! Porro facilis quo animi
	//               consequatur. Explicabo.
	//             </p>
	//           </div>
	//           <div className="mt-4 flex gap-2 items-center flex-col">
	//             <div className="flex gap-2 justify-center">
	//               {isMaintenance ? (
	//                 <Button
	//                   aria-label="Disabled Get Started"
	//                   disabled
	//                   data-testid="get-started-btn"
	//                 >
	//                   <Icons.spotify />
	//                   Get Started
	//                 </Button>
	//               ) : (
	//                 <Button
	//                   aria-label="Get Started"
	//                   asChild
	//                   data-testid="get-started-btn"
	//                 >
	//                   <Link href="/overview">
	//                     <Icons.spotify />
	//                     Get Started
	//                   </Link>
	//                 </Button>
	//               )}
	//               <Button
	//                 className="group"
	//                 variant="ghost"
	//                 aria-label="View on Github"
	//                 asChild
	//               >
	//                 <a href="https://github.com/aBgAmeuR/Harmony">
	//                   Github
	//                   <ArrowRight
	//                     className="opacity-60 transition-transform group-hover:translate-x-0.5"
	//                     size={16}
	//                     strokeWidth={2}
	//                     aria-hidden="true"
	//                   />
	//                 </a>
	//               </Button>
	//             </div>
	//             {!isMaintenance ? (
	//               <GetDemoBtn label="Get a demo of Harmony" />
	//             ) : null}
	//           </div>
	//           <div className="mt-20 flex flex-col items-center gap-4">
	//             <p className="text-center: text-muted-foreground lg:text-left">
	//               Built with open-source technologies
	//             </p>
	//             <div className="flex flex-wrap items-center justify-center gap-4">
	//               <a
	//                 href="#"
	//                 className={cn(
	//                   buttonVariants({ variant: "outline" }),
	//                   "group px-3",
	//                 )}
	//               >
	//                 <Icons.shadcnui className="h-6 saturate-0 transition-all group-hover:saturate-100" />
	//               </a>
	//               <a
	//                 href="#"
	//                 className={cn(
	//                   buttonVariants({ variant: "outline" }),
	//                   "group px-3",
	//                 )}
	//               >
	//                 <Icons.typescript className="h-6 saturate-0 transition-all group-hover:saturate-100" />
	//               </a>

	//               <a
	//                 href="#"
	//                 className={cn(
	//                   buttonVariants({ variant: "outline" }),
	//                   "group px-3",
	//                 )}
	//               >
	//                 <Icons.nextjs className="h-6 saturate-0 transition-all group-hover:saturate-100" />
	//               </a>
	//               <a
	//                 href="#"
	//                 className={cn(
	//                   buttonVariants({ variant: "outline" }),
	//                   "group px-3",
	//                 )}
	//               >
	//                 <Icons.tailwindcss className="h-6 saturate-0 transition-all group-hover:saturate-100" />
	//               </a>
	//             </div>
	//           </div>
	//         </div>
	//       </div>
	//     </div>
	//   </section>
	// );
};
