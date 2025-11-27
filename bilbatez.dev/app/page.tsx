'use client';

import parser from 'html-react-parser';
import data from 'public/data/intro.json';

export default function Home() {
  const descriptions: string[] = data;
  return (
    <article id="intro">
      {descriptions.map((description) => (
        <p className="mt-2">{parser(description)}</p>
      ))}
    </article>
  );
}
