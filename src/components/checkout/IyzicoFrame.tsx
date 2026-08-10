'use client';

import { useEffect, useRef } from 'react';
import { iyzicoFrameText } from '@/lib/data/text/checkout';

/**
 * The iyzico Checkout Form payload is a `<script>` block, and the browser will
 * not execute it when inserted through `dangerouslySetInnerHTML`. We have to
 * recreate the script tags and append them to the DOM ourselves.
 */
export function IyzicoFrame({ content }: { content: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const fragment = document.createRange().createContextualFragment(content);
    host.appendChild(fragment);

    return () => {
      host.replaceChildren();
    };
  }, [content]);

  return (
    <div className="mx-auto max-w-3xl py-10">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl text-foreground">{iyzicoFrameText.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {iyzicoFrameText.description}
        </p>
      </div>

      {/* iyzico renders its own form into this container */}
      <div id="iyzipay-checkout-form" className="responsive rounded-2xl bg-surface p-2">
        <div ref={hostRef} />
      </div>
    </div>
  );
}
