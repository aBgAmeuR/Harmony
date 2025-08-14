"use client";

import { ArrowRight, Github, Shield, Zap } from "lucide-react";
import Balancer from "react-wrap-balancer";

import { Badge } from "@repo/ui/badge";

import { config } from "~/lib/config";

import { GetDemoBtn } from "../get-demo-btn";
import { GetStartedBtn } from "./get-started-btn";

export const ClosingCTASection = () => {
    return (

        <section className="relative flex w-full flex-col items-center justify-center overflow-visible px-5 pt-20 pb-10 md:pt-32 md:pb-20 lg:pt-40">
            <div className="absolute inset-0 top-[-90px]">
                <svg
                    className="h-full w-full"
                    viewBox="0 0 1388 825"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <mask
                        id="mask0_182_1049"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="269"
                        y="27"
                        width="850"
                        height="493"
                    >
                        <rect x="269.215" y="27.4062" width="849.57" height="492.311" fill="url(#paint0_linear_182_1049)" />
                    </mask>
                    <g mask="url(#mask0_182_1049)">
                        <g filter="url(#filter0_f_182_1049)">
                            <ellipse
                                cx="694"
                                cy="-93.0414"
                                rx="670.109"
                                ry="354.908"
                                fill="url(#paint1_radial_182_1049)"
                                fillOpacity="0.8"
                            />
                        </g>
                        <ellipse cx="694" cy="-91.5385" rx="670.109" ry="354.908" fill="url(#paint2_linear_182_1049)" />
                        <ellipse cx="694" cy="-93.0414" rx="670.109" ry="354.908" fill="url(#paint3_linear_182_1049)" />
                    </g>
                    <defs>
                        <filter
                            id="filter0_f_182_1049"
                            x="-234.109"
                            y="-705.949"
                            width="1856.22"
                            height="1225.82"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="129" result="effect1_foregroundBlur_182_1049" />
                        </filter>
                        <linearGradient
                            id="paint0_linear_182_1049"
                            x1="1118.79"
                            y1="273.562"
                            x2="269.215"
                            y2="273.562"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="var(--background)" stopOpacity="0" />
                            <stop offset="0.2" stopColor="var(--background)" stopOpacity="0.8" />
                            <stop offset="0.8" stopColor="var(--background)" stopOpacity="0.8" />
                            <stop offset="1" stopColor="var(--background)" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient
                            id="paint1_radial_182_1049"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(683.482 245.884) rotate(-3.78676) scale(469.009 248.4)"
                        >
                            <stop offset="0.1294" stopColor="var(--primary)" />
                            <stop offset="0.2347" stopColor="var(--primary)" />
                            <stop offset="0.3" stopColor="var(--primary)" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient
                            id="paint2_linear_182_1049"
                            x1="694"
                            y1="-446.446"
                            x2="694"
                            y2="263.369"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="white" stopOpacity="0" />
                            <stop offset="1" stopColor="white" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient
                            id="paint3_linear_182_1049"
                            x1="694"
                            y1="-447.949"
                            x2="694"
                            y2="261.866"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="var(--background)" />
                            <stop offset="1" stopColor="var(--background)" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-start text-center">
                <div className="mb-4">
                    <a href={config.githubRepo} target="_blank" rel="noopener noreferrer">
                        <Badge variant="secondary" className="mb-4">
                            <Github className="mr-2 size-4" />
                            Open-source (GPL-3.0)
                        </Badge>
                    </a>
                    <h2 className="mb-4 font-bold text-4xl leading-tight md:text-5xl">
                        Unlock Your Musical Journey
                    </h2>
                    <Balancer className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                        Turn your listening history into insights you'll love.
                    </Balancer>
                </div>

                <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <GetStartedBtn variant="gradient" size="lg" className="group px-4">
                        Get Started Free
                        <ArrowRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
                    </GetStartedBtn>
                    <GetDemoBtn label="View Demo" variant="outline" size="lg" />
                </div>

                <div className="flex flex-col items-center gap-4 text-muted-foreground text-sm sm:flex-row sm:justify-center">
                    <div className="flex items-center gap-2">
                        <Zap className="size-4" />
                        <span>Self-host or deploy fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="size-4" />
                        <span>Full control, delete anytime</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
