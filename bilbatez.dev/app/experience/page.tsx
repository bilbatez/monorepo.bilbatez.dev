"use-client";

import Link from "next/link";

type Experience = {
  company: string;
  link?: string;
  skills: string;
  location: string;
  positions: Position[];
};

type Position = {
  title: string;
  period: string;
};

export default function Experience() {
  const experiences: Experience[] = [
    {
      company: "Bank of America",
      link: "/bofa",
      skills: "Scala · Rx · React · HTML/CSS/JS · Mockito · Cucumber",
      location: "Singapore",
      positions: [
        {
          title: "Assistant Vice President (Software Engineer II)",
          period: "Nov 2022 - Present",
        },
      ],
    },
    {
      company: "Shopee",
      link: "/shopee",
      skills: "Golang · Protobuf · Docker",
      location: "Singapore",
      positions: [
        {
          title: "Software Engineer",
          period: "Sep 2021 - Nov 2022",
        },
      ],
    },
    {
      company: "Global Digital Niaga (Blibli.com)",
      link: "/blibli",
      skills:
        "Java · Spring Ecosystem · Rx · RabbitMQ · Kafka · Redis · Docker · Mockito · Cucumber",
      location: "Indonesia",
      positions: [
        {
          title: "Senior Software Design Engineer",
          period: "Mar 2021 - Sep 2021",
        },
        {
          title: "Software Design Engineer",
          period: "Sep 2019 - Feb 2021",
        },
        {
          title: "Software Development Engineer",
          period: "Jan 2019 - Aug 2019",
        },
        {
          title: "Associate Software Development Engineer",
          period: "Mar 2018 - Dec 2018",
        },
        {
          title: "Student Intership",
          period: "Mar 2017 - Dec 2018",
        },
      ],
    },
    {
      company: "Panca Intan Borneo (Lazato.com) - Defunct",
      skills: "PHP · Laravel · MySQL · HTML/CSS/JS",
      location: "Indonesia",
      positions: [
        {
          title: "Web Developer (Part-Time)",
          period: "May 2016 - Dec 2016",
        },
      ],
    },
  ];

  function ExperiencePositionsComponent({ positions }) {
    return positions.map((position: Position) => {
      return (
        <li key={position.title} className="ml-6 mt-1">
          <span>
            <i>{position.period}</i> ~ {position.title}
          </span>
        </li>
      );
    });
  }

  function ExperiencesComponent() {
    return experiences.map((experience) => {
      return (
        <>
          <li key={experience.company} className="mt-4">
            <Link
              className={`${experience.link ? "pointer-events-auto" : "cursor-text"}`}
              href={`${experience.link ? experience.link : ""}`}
              target="_blank"
            >
              <span className="font-bold">{experience.company}</span>
            </Link>
            <br />
            <span className="text-sm">{experience.location}</span>
            <br />
            <span className="font-italic">{experience.skills}</span>
            <br />
            <ul>
              <ExperiencePositionsComponent positions={experience.positions} />
            </ul>
          </li>
        </>
      );
    });
  }

  return (
    <article id="experience">
      <p>Summary of my corpo experience, more details on linkedin.</p>
      <ul className="mt-4 list-disc list-inside">
        <ExperiencesComponent />
      </ul>
    </article>
  );
}
