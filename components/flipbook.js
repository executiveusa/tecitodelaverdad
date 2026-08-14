'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '../lib/supabase';

const fallbackPages = [
  { sort_order: 1, page_type: 'cover', title_es: 'TECITO DE LA VERDAD', title_en: 'TECITO DE LA VERDAD', body_es: 'Casa de Ediciones · Ciudad de México', body_en: 'House of Editions · Mexico City', image_url: 'https://v3b.fal.media/files/b/0aa63a38/nXn-65x6fx9efjhl3c4qg_8791167e40204b039fa3421fa5a13754.jpg', accent: 'obsidiana' },
  { sort_order: 2, page_type: 'editorial', title_es: 'Una pausa. Una verdad.', title_en: 'A pause. A truth.', body_es: 'El lujo no necesita ruido. Necesita tiempo, intención y algo que valga la pena recordar.', body_en: 'Luxury does not need noise. It needs time, intention, and something worth remembering.', image_url: 'https://v3b.fal.media/files/b/0aa63d0a/KLlSIzjKfoeUiQD-NDJ7n_2c27ac3a4da54a398fdaa0ae4ebb7b3b.jpg', accent: 'oro' },
  { sort_order: 3, page_type: 'ritual', title_es: 'El ritual', title_en: 'The ritual', body_es: 'Dos tazas. Una conversación. Una etiqueta que termina el ritual.', body_en: 'Two cups. One conversation. A tag that completes the ritual.', image_url: 'https://v3b.fal.media/files/b/0aa63d1e/WKz2Oaw-3DDRRE2UoDt0x_3464686dd69c4f9292fa67f08dcb8151.jpg', accent: 'copal' },
  { sort_order: 4, page_type: 'edition', title_es: 'Cosecha · Otoño 2026', title_en: 'Harvest · Autumn 2026', body_es: 'Nuestra primera edición será cálida, especiada y deliberadamente finita. Cuando termina, se retira.', body_en: 'Our first edition will be warm, spiced, and deliberately finite. When it ends, it retires.', image_url: 'https://v3b.fal.media/files/b/0aa63d0d/I7h8K4EiWjmnNDPS488dL_85ef9ba157b54075b4496f3f08fa3577.jpg', accent: 'obsidiana' },
  { sort_order: 5, page_type: 'impact', title_es: 'Ediciones con propósito', title_en: 'Editions with purpose', body_es: 'Creamos ediciones limitadas para fundaciones con una contribución definida, una historia clara y un impacto trazable.', body_en: 'We create limited editions for nonprofits with a defined contribution, a clear story, and traceable impact.', image_url: 'https://v3b.fal.media/files/b/0aa63d22/R3WCVICiYO8_gD35W7Lh9_e440f349ade549b08c78c2a03c138332.jpg', accent: 'nopal' },
  { sort_order: 6, page_type: 'commission', title_es: 'Una edición solo para ti', title_en: 'An edition only for you', body_es: 'Hoteles, marcas y equipos pueden encargar una edición propia: té curado, narrativa, empaque y una serie de verdades.', body_en: 'Hotels, brands, and teams can commission their own edition: curated tea, narrative, packaging, and a truth series.', image_url: 'https://v3b.fal.media/files/b/0aa63d23/WIP4e1mmS_kxvMUqxnTqK_bac21333e6914a6a90381518ee33f3e9.jpg', accent: 'oro' },
  { sort_order: 7, page_type: 'contact', title_es: 'La siguiente edición empieza con una conversación.', title_en: 'The next edition begins with a conversation.', body_es: 'Únete a la lista o habla con la Casa de Ediciones.', body_en: 'Join the list or speak with the House of Editions.', image_url: null, accent: 'copal' }
];

export default function Flipbook({ lang = 'es' }) {
  const [pages, setPages] = useState(fallbackPages);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const supabase = useMemo(() => getSupabase(), []);

  useEffect(() => {
    let alive = true;
    supabase.rpc('tecito_catalog').then(({ data }) => {
      if (alive && Array.isArray(data) && data.length) setPages(data);
    });
    return () => { alive = false; };
  }, [supabase]);

  const page = pages[index] || fallbackPages[0];
  const title = lang === 'en' ? page.title_en : page.title_es;
  const body = lang === 'en' ? page.body_en : page.body_es;
  const atStart = index === 0;
  const atEnd = index === pages.length - 1;

  function go(nextIndex) {
    const clamped = Math.max(0, Math.min(pages.length - 1, nextIndex));
    if (clamped === index) return;
    setDirection(clamped > index ? 'next' : 'prev');
    setIndex(clamped);
  }

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, pages.length]);

  return (
    <section className="catalog-shell" aria-label={lang === 'en' ? 'Interactive tea catalog' : 'Catálogo interactivo de té'}>
      <div className="catalog-heading">
        <div>
          <p className="kicker">{lang === 'en' ? 'The house book' : 'El libro de la casa'}</p>
          <h2 className="display">{lang === 'en' ? 'Turn the pages.' : 'Pasa las páginas.'}</h2>
        </div>
        <p className="catalog-intro">{lang === 'en' ? 'A tactile preview of the editions, rituals, commissions and purpose behind Tecito de La Verdad.' : 'Una mirada táctil a las ediciones, rituales, encargos y propósito detrás de Tecito de La Verdad.'}</p>
      </div>

      <div className={`flipbook ${direction}`}>
        <div className="book-spine" aria-hidden="true" />
        <article className={`book-page accent-${page.accent || 'oro'}`} key={`${page.sort_order}-${lang}`}>
          {page.image_url && <div className="book-image"><img src={page.image_url} alt="" /></div>}
          <div className="book-copy">
            <div className="book-folio">{String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</div>
            <div>
              <p className="book-type">{page.page_type}</p>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
            <div className="book-mark">TECITO <span>DE LA VERDAD</span></div>
          </div>
        </article>
      </div>

      <div className="book-controls">
        <button type="button" onClick={() => go(index - 1)} disabled={atStart} aria-label={lang === 'en' ? 'Previous page' : 'Página anterior'}>←</button>
        <div className="book-dots" aria-hidden="true">{pages.map((_, i) => <i key={i} className={i === index ? 'active' : ''} />)}</div>
        <button type="button" onClick={() => go(index + 1)} disabled={atEnd} aria-label={lang === 'en' ? 'Next page' : 'Página siguiente'}>→</button>
      </div>
    </section>
  );
}
