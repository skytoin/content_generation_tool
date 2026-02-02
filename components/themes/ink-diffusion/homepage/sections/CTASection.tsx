'use client';

/**
 * CTA SECTION - Ink Diffusion Homepage
 *
 * Burgundy background with elegant typography.
 */

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../primitives/design-tokens';

export const CTASection: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-8 relative overflow-hidden" style={{ background: tokens.colors.ink[700] }}>
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 sm:mb-6"
          style={{ fontFamily: tokens.fonts.serif, color: '#fff' }}
        >
          Ready to transform
          <br className="hidden sm:block" />
          your content?
        </h2>
        <p
          className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-80 max-w-2xl mx-auto"
          style={{ fontFamily: tokens.fonts.serif, color: '#fff' }}
        >
          Share your voice with us. We'll match it in everything we create.
        </p>
        <button
          onClick={() => session ? router.push('/dashboard/projects/new') : router.push('/signup')}
          className="px-8 sm:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-medium transition-all hover:scale-105"
          style={{
            background: '#fff',
            color: tokens.colors.ink[700],
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {session ? 'Create New Project' : 'Start Creating'}
        </button>
      </div>
    </section>
  );
};

export default CTASection;
