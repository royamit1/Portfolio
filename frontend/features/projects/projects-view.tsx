"use client";

import {ProjectsCarousel} from "./components/projects-carousel";
import {projects} from "./projects";

export function ProjectsView() {
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ProjectsCarousel
                items={projects}
                autoRotate={false}
            />
        </div>
    );
}