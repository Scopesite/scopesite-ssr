import Image from 'next/image';
import Link from 'next/link';
import type { GhostAuthor } from '@/lib/ghost';
import { generateFounderPersonSchema } from '@/lib/schema';

const DAN_LINKEDIN_URL = 'https://www.linkedin.com/in/scopesite/';

interface AuthorBioProps {
  author: GhostAuthor;
}

function isDanCartwright(author: GhostAuthor): boolean {
  return author.name.trim().toLowerCase() === 'dan cartwright';
}

function getLinkedInUrl(author: GhostAuthor): string | null {
  const possibleUrls = [
    author.linkedin,
    author.website?.includes('linkedin.com') ? author.website : undefined,
    author.facebook?.includes('linkedin.com') ? author.facebook : undefined,
  ];

  return possibleUrls.find((url): url is string => Boolean(url?.startsWith('http'))) || null;
}

export function AuthorBio({ author }: AuthorBioProps) {
  const founderSchema = generateFounderPersonSchema();
  const isDan = isDanCartwright(author);
  const linkedInUrl = isDan ? DAN_LINKEDIN_URL : getLinkedInUrl(author);
  const bio = author.bio || (isDan ? founderSchema.description : '');
  const credentialLine = isDan
    ? 'British Army veteran (REME) | V.O.I.C.E methodology creator'
    : null;

  if (!bio && !author.name) {
    return null;
  }

  return (
    <section className="section-white border-t border-brand-navy/10">
      <div className="container-content">
        <div className="mx-auto max-w-3xl rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-[0_4px_24px_rgba(10,27,54,0.06)] md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex-shrink-0">
              {author.profile_image ? (
                <Image
                  src={author.profile_image}
                  alt={author.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-navy text-2xl font-headline text-brand-gold"
                >
                  {author.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-gold">
                Written By
              </p>
              {isDan ? (
                <Link
                  href="/about"
                  className="text-xl font-bold text-brand-navy transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {author.name}
                </Link>
              ) : (
                <h2 className="text-xl font-bold text-brand-navy">{author.name}</h2>
              )}

              {bio && (
                <p className="mt-3 leading-relaxed text-brand-navy/75">
                  {bio}
                </p>
              )}

              {credentialLine && (
                <p className="mt-3 text-sm font-medium text-brand-navy/70">
                  {credentialLine}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {linkedInUrl && (
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-brand-navy text-brand-gold border-2 border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
                  >
                    Connect on LinkedIn
                  </a>
                )}
                <Link href="/book" className="btn-primary">
                  Book a Strategy Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthorBio;
