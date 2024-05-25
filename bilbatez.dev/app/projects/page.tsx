'use client'

import Link from "next/link"

type Project = {
    title: string,
    link: string,
    description: string,
}

export default function Projects() {
    const projects: Project[] = [
        {
            title: "KPR for Dummies",
            link: "",
            description: "Home mortgage calculator based on Indonesia.",
        },
        {
            title: "Impractical Python Projects",
            link: "",
            description: "A collection of small python scripts.",
        },
        {
            title: "Miniature Javascripts Projects",
            link: "",
            description: "A collection of small javascript projects.",
        }
    ]

    function ProjectItemComponents() {
        return projects.map(project => {
            return (
                <li key={project.title}>
                    <b><Link href={project.link}>[{project.title}]</Link></b>: {project.description}
                </li>
            )
        })
    }

    return (
        <>
            <p>Here are the tech projects that I&apos;ve worked on!</p>
            <ul className="mt-4 list-disc list-inside">
                <ProjectItemComponents/>
            </ul>
        </>
    )
}