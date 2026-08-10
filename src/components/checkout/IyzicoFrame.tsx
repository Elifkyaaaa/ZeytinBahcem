'use client';

import { useEffect, useRef } from 'react';
import { iyzicoFrameText } from '@/lib/data/text/checkout';

/**
 * iyzico Checkout Form içeriği bir `<script>` bloğudur; `dangerouslySetInnerHTML`
 * ile basıldığında tarayıcı bunu çalıştırmaz. Script etiketlerini yeniden
 * oluşturup DOM'a eklememiz gerekiyor.
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

      {/* iyzico kendi formunu bu kabın içine basar */}
      <div id="iyzipay-checkout-form" className="responsive rounded-2xl bg-surface p-2">
        <div ref={hostRef} />
      </div>
    </div>
  );
}
