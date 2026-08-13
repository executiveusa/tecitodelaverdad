'use client';

import { useMemo, useState } from 'react';

const HERO = 'https://v3b.fal.media/files/b/0aa63a38/nXn-65x6fx9efjhl3c4qg_8791167e40204b039fa3421fa5a13754.jpg';

const copy = {
  es: {
    nav: ['Ediciones', 'La verdad', 'Para organizaciones'],
    heroEyebrow: 'Ciudad de México · Casa de ediciones',
    heroA: 'Encuentra',
    heroB: 'tu verdad',
    heroNote: 'Tés de edición limitada. Una temporada. Una historia. Una verdad que no vuelve a repetirse.',
    discover: 'Descubrir la casa',
    ritualKicker: 'El ritual',
    ritualTitle: 'No vendemos un catálogo infinito.',
    ritualLead: 'Creamos ediciones finitas que aparecen una vez, viven una temporada y después se retiran. El té es la pausa. La etiqueta es el mensaje. La edición es la memoria.',
    editionKicker: 'Próxima edición',
    editionName: 'Cosecha',
    editionSeason: 'Otoño 2026',
    editionType: 'Edición 01',
    editionOrigin: 'Curada en CDMX',
    editionHeading: 'Una temporada. Una sola oportunidad.',
    editionBody: 'Cosecha será nuestra primera edición de temporada: cálida, especiada y deliberadamente finita. Cada empaque incluirá una serie de verdades bilingües creadas para esta edición. Cuando termina, se retira.',
    seasons: [['Renacimiento','Primavera'],['Fuego','Verano'],['Cosecha','Otoño'],['Refugio','Invierno']],
    quoteKicker: 'La verdad de hoy',
    nextTruth: 'Otra verdad',
    commissionKicker: 'Ediciones por encargo',
    commissionTitle: 'No pongas tu logo en una caja. Crea una edición que la gente quiera conservar.',
    commissions: [
      ['01','Hoteles','Una edición exclusiva para la llegada, el descanso o el ritual de habitación.'],
      ['02','Marcas y equipos','Regalos corporativos con historia, temporada y una identidad propia.'],
      ['03','Fundaciones','Una edición de recaudación con impacto claramente comunicado y trazable.']
    ],
    commissionNote: 'Las ediciones por encargo combinan una selección de té, narrativa, empaque y sistema de verdades. La formulación personalizada depende de la capacidad confirmada del proveedor; no prometemos lo que no esté verificado.',
    waitKicker: 'La primera edición',
    waitTitle: 'Recibe la verdad antes que nadie.',
    email: 'Tu correo',
    join: 'Entrar a la lista',
    formReady: 'Te avisaremos cuando la captura de correos esté conectada.',
    footer: 'Hecho con verdad en la Ciudad de México.'
  },
  en: {
    nav: ['Editions', 'The truth', 'For organizations'],
    heroEyebrow: 'Mexico City · House of editions',
    heroA: 'Find',
    heroB: 'your truth',
    heroNote: 'Limited-edition teas. One season. One story. One truth that never returns in the same form.',
    discover: 'Discover the house',
    ritualKicker: 'The ritual',
    ritualTitle: 'We do not sell an endless catalog.',
    ritualLead: 'We create finite editions that appear once, live for one season, and then retire. Tea is the pause. The tag is the message. The edition is the memory.',
    editionKicker: 'Next edition',
    editionName: 'Harvest',
    editionSeason: 'Autumn 2026',
    editionType: 'Edition 01',
    editionOrigin: 'Curated in CDMX',
    editionHeading: 'One season. One chance.',
    editionBody: 'Harvest will be our first seasonal edition: warm, spiced and deliberately finite. Every package will include a bilingual series of truths created only for this edition. When it ends, it retires.',
    seasons: [['Rebirth','Spring'],['Fire','Summer'],['Harvest','Autumn'],['Refuge','Winter']],
    quoteKicker: 'Today’s truth',
    nextTruth: 'Another truth',
    commissionKicker: 'Commissioned editions',
    commissionTitle: 'Do not put your logo on a box. Create an edition people want to keep.',
    commissions: [
      ['01','Hotels','An exclusive edition for arrival, rest, or the in-room ritual.'],
      ['02','Brands & teams','Corporate gifts with a story, a season, and an identity of their own.'],
      ['03','Nonprofits','A fundraising edition with clearly communicated, traceable impact.']
    ],
    commissionNote: 'Commissioned editions combine tea curation, narrative, packaging and a truth system. Custom formulation depends on confirmed supplier capability; we do not promise what has not been verified.',
    waitKicker: 'The first edition',
    waitTitle: 'Receive the truth before anyone else.',
    email: 'Your email',
    join: 'Join the list',
    formReady: 'We will notify you once email capture is connected.',
    footer: 'Made with truth in Mexico City.'
  }
};

const truths = [
  { es: 'La verdad no siempre grita. A veces espera a que estés en silencio.', en: 'Truth does not always shout. Sometimes it waits for you to become quiet.' },
  { es: 'Lo que cuidas en privado también define quién eres.', en: 'What you protect in private also defines who you are.' },
  { es: 'No todo lo que termina estaba destinado a fracasar.', en: 'Not everything that ends was meant to fail.' },
  { es: 'Tu paz también es una forma de poder.', en: 'Your peace is also a form of power.' },
  { es: 'Hay respuestas que llegan cuando dejas de perseguirlas.', en: 'Some answers arrive when you stop chasing them.' }
];

export default function Experience() {
  const [lang, setLang] = useState('es');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [formNote, setFormNote] = useState('');
  const t = copy[lang];
  const quote = useMemo(() => truths[quoteIndex][lang], [lang, quoteIndex]);

  function submitWaitlist(event) {
    event.preventDefault();
    setFormNote(t.formReady);
  }

  return (
    <main className="site">
      <nav className="nav" aria-label="Navegación principal">
        <a className="wordmark" href="#top">TECITO<small>DE LA VERDAD</small></a>
        <div className="nav-links">
          <a href="#ediciones">{t.nav[0]}</a>
          <a href="#verdad">{t.nav[1]}</a>
          <a href="#encargos">{t.nav[2]}</a>
        </div>
        <div className="nav-side">
          <button className="lang" type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label="Cambiar idioma">
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true"><img src={HERO} alt="" /></div>
        <div className="hero-copy">
          <p className="eyebrow reveal">{t.heroEyebrow}</p>
          <h1 className="reveal">{t.heroA}<span>{t.heroB}</span></h1>
          <div className="hero-bottom reveal">
            <p className="hero-note">{t.heroNote}</p>
            <a className="cta pressable" href="#ediciones">{t.discover} <span aria-hidden="true">↘</span></a>
          </div>
        </div>
      </section>

      <section className="section section-dark" id="verdad">
        <p className="kicker">{t.ritualKicker}</p>
        <h2 className="display">{t.ritualTitle}</h2>
        <p className="lead">{t.ritualLead}</p>
      </section>

      <section className="section section-cream" id="ediciones">
        <div className="edition-grid">
          <article className="edition-card">
            <div className="edition-number">{t.editionType}</div>
            <div className="edition-title">{t.editionName}<em>{t.editionSeason}</em></div>
            <div className="edition-meta"><span>{t.editionOrigin}</span><span>TECITO DE LA VERDAD</span></div>
          </article>
          <div className="edition-copy">
            <p className="kicker">{t.editionKicker}</p>
            <h3>{t.editionHeading}</h3>
            <p>{t.editionBody}</p>
            <div className="rule" />
            <a className="cta pressable" href="#lista">{t.join} <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="seasons" aria-label="Ediciones de temporada">
          {t.seasons.map(([name, season]) => <div className="season" key={name}><strong>{name}</strong><span>{season}</span></div>)}
        </div>
      </section>

      <section className="section section-dark quote-stage" aria-live="polite">
        <div className="quote-inner">
          <p className="kicker">{t.quoteKicker}</p>
          <div className="quote-mark">“</div>
          <div className="quote">{quote}</div>
          <div className="quote-meta">TECITO · VERDAD {String(quoteIndex + 1).padStart(3,'0')}</div>
          <button className="quote-next pressable" type="button" onClick={() => setQuoteIndex((quoteIndex + 1) % truths.length)}>{t.nextTruth}</button>
        </div>
      </section>

      <section className="section section-cream" id="encargos">
        <div className="commission-grid">
          <div>
            <p className="kicker">{t.commissionKicker}</p>
            <h2 className="display">{t.commissionTitle}</h2>
          </div>
          <div>
            <div className="commission-list">
              {t.commissions.map(([n,title,body]) => <div className="commission-row" key={n}><b>{n}</b><div><h3>{title}</h3><p>{body}</p></div></div>)}
            </div>
            <p className="lead" style={{marginLeft:0, fontSize:'14px'}}>{t.commissionNote}</p>
          </div>
        </div>
      </section>

      <section className="section waitlist" id="lista">
        <div className="waitlist-grid">
          <div><p className="kicker" style={{color:'rgba(255,255,255,.7)'}}>{t.waitKicker}</p><h2 className="display">{t.waitTitle}</h2></div>
          <div>
            <form className="waitlist-form" onSubmit={submitWaitlist}>
              <input type="email" name="email" required placeholder={t.email} aria-label={t.email} />
              <button className="pressable" type="submit">{t.join} →</button>
            </form>
            <div className="form-note">{formNote}</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wordmark">TECITO<small>DE LA VERDAD</small></div>
        <small>{t.footer} © 2026</small>
      </footer>
    </main>
  );
}
