import OvalButton from '../OvalButton/OvalButton';
import './Hero.css';
import ExternalLinkGradient from '../ExternalLinkGradient';
import BTCB_128 from '@/app/assets/images/btcb-128.png';
import Image from 'next/image';
import { Plus_Jakarta_Sans } from 'next/font/google'

const JAKARTA_SANS_700 = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: '700',
})

const JAKARTA_SANS_600 = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: '600',
})

const articles = [
  {
    title: '1:1 Individual Therapy',
    body: 'Personalized, confidential support with licensed professionals to address your unique needs.'
  }, {
    title: 'AI Assisted Therapy',
    body: 'Introducing TxAI, your customizable wellness companion, offering on-demand, private mental health support while rewarding you with incentives for building and maintaining healthy habits.'
  }, {
    title: 'Workshops',
    body: 'Expert-led sessions focused on resilience, healing, and growth in a collaborative environment.'
  }
]


const BorderText = ({ children }: { children: string }) => (
  <span className='border-only'>
    <span aria-hidden={true} className='over'>{children}</span>
    {children}
  </span>
);

export default function Hero() {

  return (
    <div className='hero'>
      <h1 className={'header-text mb-2' + JAKARTA_SANS_700.className}>
        <BorderText>onchain</BorderText> wellness<br />
      </h1>
      <p className='header-text mb-2'>
        Powered by <Image className='aspect-square inline-block w-max' src={BTCB_128} alt='bitcoin on base' /> Bitcoin on base
      </p>
      <OvalButton
        className='bg-blueGradient py-3 px-6'
        onClick={() => { }}
      >Coming soon</OvalButton>

      <section className='description'>
        <div className='description-header'>
          <h2 className={'text-white ' + JAKARTA_SANS_600}>The Future of Wellness</h2>
          <p>Empowering individuals with secure, private, and personalized mental health support, Onchain Wellness redefines care for the modern, decentralized world. Our platform offers 1:1 individual therapy with licensed professionals, expert-led workshops by industry thought leaders, as well as TxAl, a groundbreaking digital wellness companion that rewards users for engaging in healthy behaviors. Accessible, innovative, and tailored to your unique journey, we&apos;re here to support you every step of the way.</p>
        </div>
        <div
          className='description-features'
        >
          {
            articles.map((article) => (
            <article key={article.title}>
              <h4 className='mb-4'><ExternalLinkGradient />{article.title}</h4>
              <p>{article.body}</p>
            </article>
            ))
          }
        </div>
      </section>

    </div>
  );
};
