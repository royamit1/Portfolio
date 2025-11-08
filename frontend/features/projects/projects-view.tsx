"use client";

import {useMediaQuery} from "@/hooks/use-media-query";
import ThreeDCarousel from "./components/projects-carousel";
import {SimpleCarousel} from "./components/simple-carousel";
import {projects} from "./projects";

export function ProjectsView() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <div className="w-full">
            {isDesktop ? (
                <ThreeDCarousel
                    items={projects}
                    autoRotate={true}
                    rotateInterval={4000}
                    cardHeight={{base: 400, md: 500}}
                    title="Project Showcase"
                    subtitle="Full-Stack Applications & Robust Engineering"
                    tagline="I've worked on various full-stack applications, from AI-powered chatbots to e-commerce platforms. Each project showcases my ability to blend thoughtful design with robust engineering."
                />
            ) : (
                <SimpleCarousel/>
            )}
        </div>
    );
}
