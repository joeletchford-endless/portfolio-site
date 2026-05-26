import { getPayload } from 'payload'
import config from '@payload-config'
import HomeClient from './HomeClient'
import content from '../../../content.json'

type Project = {
  title: string;
  slug: string;
  url: string | null;
  images: string[];
};

const FALLBACK_EMPLOYMENT = [
  "Shopify. 25—Now",
  "Dispatches. 21—Now",
  "Freelance. 22—25",
  "VCU Adjunct. 22—24",
  "Robinhood. 21—22",
  "Dropbox. 19—21",
  "Google. 18—19",
];

const FALLBACK_PROJECTS: Project[] = content.projects.map((p) => ({
  title: p.title,
  slug: p.slug,
  url: p.url ?? null,
  images: p.images,
}));

export default async function Home() {
  let projects = FALLBACK_PROJECTS;
  let employment = FALLBACK_EMPLOYMENT;

  try {
    const payload = await getPayload({ config });

    const [projectsResult, siteSettings] = await Promise.all([
      payload.find({ collection: 'projects', sort: '_order', limit: 100 }),
      payload.findGlobal({ slug: 'site-settings' }),
    ]);

    if (projectsResult.docs.length > 0) {
      projects = projectsResult.docs.map((p) => ({
        title: p.title,
        slug: p.slug,
        url: (p.url as string | null | undefined) ?? null,
        images: ((p.images as { src: string }[] | null) ?? []).map((img) => img.src),
      }));
    }

    const emp = (siteSettings.employment as { label: string }[] | null) ?? [];
    if (emp.length > 0) {
      employment = emp.map((e) => e.label);
    }
  } catch {
    // DB unavailable — fall back to static content.json
  }

  return <HomeClient projects={projects} employment={employment} />;
}
