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
      <h1 className={'header-text ' + JAKARTA_SANS_700.className}>
        <BorderText>onchain</BorderText> wellness<br />
      </h1>
      <p className='header-text mb-2'>
        Powered by <Image className='w-10 h-2 inline-block' width={128} height={128} src={BTCB_128} alt='bitcoin on base' /> Bitcoin on base
      </p>
      <OvalButton
        className='bg-blueGradient py-3 px-6'
        onClick={() => { }}
      >Coming soon</OvalButton>

      <section className='description'>
        <div className='description-header'>
          <h2 className={'text-white ' + JAKARTA_SANS_600}>The Future of Wellness</h2>
          <p>Take control of your mental health with secure, private, and personalized support—designed for today’s world. Onchain Wellness connects you with licensed therapists for 1:1 sessions, expert-led workshops, and TxAI, our revolutionary companion that rewards you for staying on track. Accessible, innovative, and built for you. Start your journey to better wellness today.</p>
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
