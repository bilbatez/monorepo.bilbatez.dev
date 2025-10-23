'use-client';

import Link from 'next/link';

type Experience = {
  company: string;
  link?: string;
  skills: string[];
  location: string;
  positions: Position[];
};

type Position = {
  title: string;
  period: string;
  descriptions: string[];
};

export default function Experience() {
  const experiences: Experience[] = [
    {
      company: 'Bank of America',
      link: '/bofa',
      skills: [
        'Scala',
        'Scalatra',
        'React',
        'HTML/CSS/JS',
        'Mockito',
        'Cucumber',
      ],
      location: 'Singapore',
      positions: [
        {
          title: 'Assistant Vice President (Software Engineer II)',
          period: 'Nov 2022 - Present',
          descriptions: [
            'Developed and maintained the Workflow Management System.',
            'Developed and maintained the Trade Booking System.',
            'Developed and maintained the Trade Booking UI for Operations users.',
          ],
        },
      ],
    },
    {
      company: 'Shopee',
      link: '/shopee',
      skills: ['Golang', 'Protobuf', 'Docker'],
      location: 'Singapore',
      positions: [
        {
          title: 'Software Engineer',
          period: 'Sep 2021 - Nov 2022',
          descriptions: [
            'Developed and maintained Custom Linter Systems for Return Team',
            'Developed and maintained Return System for Shopee',
            'Developed return system to allow agent raise return refund feature for all region to simplify return process.',
            'Revamped return refund request page.',
            'Developed return system to allow buyer to raise return refund request after order is completed.',
            'Designed the SOP for the disaster recovery flow in return services.',
          ],
        },
      ],
    },
    {
      company: 'Global Digital Niaga (Blibli.com)',
      link: '/blibli',
      skills: [
        'Java',
        'Spring Ecosystem',
        'Rx',
        'RabbitMQ',
        'Kafka',
        'Redis',
        'Docker',
        'Mockito',
        'Cucumber',
      ],
      location: 'Indonesia',
      positions: [
        {
          title: 'Senior Software Design Engineer',
          period: 'Mar 2021 - Sep 2021',
          descriptions: [
            'Developed and maintained Commerce Checkout & Promotion system.',
            'Upgraded cart service tech stack from the legacy Spring framework to Spring Boot to improve system maintainability and performance.',
            'Revamped Bulk Assign Coupon Feature to improve coupon distribution to millions of users.',
            "Participated in Blibli's Future Program to provide mentorship for undergraduate interns.",
          ],
        },
        {
          title: 'Software Design Engineer',
          period: 'Sep 2019 - Feb 2021',
          descriptions: [
            'Developed and maintained Commerce Checkout & Promotion system.',
            'Responsible for Cashback Scoreboard for 11.11 promotion event.',
            'Responsible for Contextual Promotion & Coupon feature for Checkout page.',
            'Responsible for Ramadhan Coupon Claim feature for Ramadhan promotion event.',
            'Responsible for User Coupon Restructuring Project.',
            "Blibli's Future Program Mentor.",
            "Blibli's Binus 3+1 Program Lecturer.",
            'Upgraded Microservices Tech Stack.',
          ],
        },
        {
          title: 'Software Development Engineer',
          period: 'Jan 2019 - Aug 2019',
          descriptions: [
            'Developed and maintained Blibli Core Commerce Applications.',
            'Contributed to the development of Checkout Revamp.',
          ],
        },
        {
          title: 'Associate Software Development Engineer',
          period: 'Mar 2018 - Dec 2018',
          descriptions: [
            'Maintained Blibli Core Commerce Applications.',
            'Contributed to the development of 2018 Asian Games Closing Ceremony.',
            'Contributed to the development of 10.10 Promo Deals.',
            'Create automations for backend Commerce Applications to support regression testing.',
          ],
        },
        {
          title: 'Student Intership',
          period: 'Mar 2017 - Dec 2018',
          descriptions: [
            'Developed and maintained Blibli Core Commerce & Travel application.',
            'Contributed to International Hotel feature for Blibli Hotel service.',
            'Rewrite a Blibli Core Commerce Application that handles third-party voucher stock.',
          ],
        },
      ],
    },
    {
      company: 'Freelance Web Developer',
      skills: ['PHP', 'Laravel', 'MySQL', 'HTML/CSS/JS'],
      location: 'Indonesia',
      positions: [
        {
          title: 'Fullstack Developer',
          period: 'Jul 2016 - Mar 2020',
          descriptions: [
            'Created websites for clients such as company profiles or e-catalogs.',
            'Created web services for mobile applications.',
            'Created web based internal application.',
          ],
        },
      ],
    },
    {
      company: 'Panca Intan Borneo (Lazato.com) - Defunct',
      skills: ['PHP', 'Laravel', 'MySQL', 'HTML/CSS/JS'],
      location: 'Indonesia',
      positions: [
        {
          title: 'Web Developer (Part-Time)',
          period: 'May 2016 - Dec 2016',
          descriptions: [
            'Managed some web projects such as e-catalogue, inventory application. Keep the development on time and manage the developer to keep on the scope while maintaining the quality of the product.',
            'Developed and maintaining company products. Develop new features for the products and bug fixing on web services.',
            'Developed new web applications such as company profiles.',
          ],
        },
      ],
    },
  ];

  function ExperiencePositionsComponent({
    positions,
  }: {
    positions: Position[];
  }) {
    return positions.map((position: Position) => {
      return (
        <li key={position.title} className="ml-6 mt-1 mb-6">
          <div className="mb-1 mt-3">
            <b>{position.title}</b>
            <br />
            <i className="text-sm">{position.period}</i>
          </div>
          <ul className="list-disc list-inside">
            {position.descriptions.map((description) => (
              <li key={position.title + description}>{description}</li>
            ))}
          </ul>
        </li>
      );
    });
  }

  function ExperiencesComponent() {
    return experiences.map((experience) => {
      return (
        <li key={experience.company} className="mt-4">
          <Link
            className={`${experience.link ? 'pointer-events-auto' : 'cursor-text'}`}
            href={`${experience.link ? experience.link : ''}`}
            target="_blank"
          >
            <span className="font-bold">{experience.company}</span>
          </Link>
          <br />
          <span className="text-sm">{experience.location}</span>
          <br />
          <span className="font-italic text-sm">
            {experience.skills.join(' · ')}
          </span>
          <br />
          <ul>
            <ExperiencePositionsComponent positions={experience.positions} />
          </ul>
        </li>
      );
    });
  }

  return (
    <article id="experience">
      <ul className="mt-4 list-inside">
        <ExperiencesComponent />
      </ul>
    </article>
  );
}
