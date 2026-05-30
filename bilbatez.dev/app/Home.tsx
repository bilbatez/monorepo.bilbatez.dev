import { homeHTML } from './content';

export function Home() {
  return <article id="intro" dangerouslySetInnerHTML={{ __html: homeHTML }} />;
}
