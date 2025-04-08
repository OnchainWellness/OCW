'use client'

import React, { useState } from 'react'
import Hero from '../Hero/Hero'
import OvalButton from '../OvalButton/OvalButton'
import './Home.css';
import BlockButton from '../BlockButton/BlockButton';
import Badge from '../Badge/Badge';
import IndividualTherapyImage from '@/assets/images/individualTherapyImage.png';
import WorkshopsImage from '@/assets/images/workshopImage.png';
import ExternalLink from '../ExternalLink';
import Image from 'next/image';
import { Modal } from '../Modal';
import SubscribeOptions from '../SubscribeOptions';

const secondaryTextColor = '#ffffff'
const blueGradientColor = 'linear-gradient(90deg, #063CA9 0%, #0052FF 100%)';
const secondaryColor = blueGradientColor


const individualTherapyItems = [
  {
    title: 'Personalized Care',
    description: 'Sessions tailored to your unique goals and challenges, ensuring a focused and impactful therapeutic experience.'
  },
  {
    title: 'Privacy First',
    description: 'Leverage blockchain technology for secure and private session bookings, protecting your identity and data.'
  },
  {
    title: 'Earn BTCB tokens',
    description: 'Earn wellness tokens for active participation in therapy, workshops, and other activities, recognizing your commitment to mental well-being.'
  }
]

const workshopsItems = [
  {
    title: 'Expert Led Sessions',
    description: 'Discover valuable insights and transformative strategies from top professionals and visionary thought leaders at the intersection of crypto and wellness.'
  },
  {
    title: 'Interactive Learning',
    description: 'Participate in live, collaborative workshops designed to foster connection, resilience, and personal growth.'
  },
  {
    title: 'Onchain Integration',
    description: 'Access workshops securely through decentralized platforms, ensuring privacy and streamlined participation.'
  },
  {
    title: 'Earn Through Participation',
    description: 'Receive rewards for completing workshops and participating in our Wellness Ecosystem, celebrating your commitment to mental health and continuous learning.'
  }
]

const Home = () => {
  // const { contract, tokenId, blockchain } = useParams<TParamsTitleCollection>();
    const [showModal, setShowModal] = useState(false);

  const subscriptionPlans = [
    {
      price: '30 day Free trial',
      title: 'Standard Plan',
      features: [
        'Full access to Workshop & Courses',
        'Access to TxAI',
        'Unlimited access to Live Group Sessions',
        'Tokenized Rewards for Engagement',
      ],
      onClick: () => {setShowModal(true)}
    },
    {
      price: 'TBD',
      title: 'Premium Plan',
      features: [
        '1:1 Therapy Sessions',
        'Access to TxAI',
        'Full access to all Workshop & Courses',
        'Customized Recovery Plan',
        'Tokenized Rewards for Engagement',
      ],
      onClick: () => {}
    }
  ]

  function sendMail() {
    window.location.href = 'mailto:admin@onchainwellness.com';
  }

  return (
    <div
      className='home'
      style={{
        marginTop: "100px"
    }}>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className='z-40 w-96 h-80 bg-black rounded-lg'>
          <SubscribeOptions />
        </div>
      </Modal>
      <section className='home-section hero'>
        <Hero />
      </section>
      <div
        className='wide-banner'
        style={{
          color: secondaryTextColor
        }}
      >
        <h2>Let’s Personalize Your Wellness Experience</h2>
        <OvalButton
          onClick={sendMail}
          // textColor={primaryColor}
          className='bg-white border-white'
        >
          <span
            style={{
              background: secondaryColor,
              color: 'transparent',
              WebkitBackgroundClip: 'text',
            }}
          >Assessment</span>
        </OvalButton>
      </div>
      <section className='home-section subscription-plans'>
        <header className='plans-header' style={{ color: secondaryTextColor }}>
          <h6>GET ACCESS</h6>
          <h2>Subscription <span style={{
                  background: secondaryColor,
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}>plans</span></h2>
        </header>
        <div className='plans-container'>
          {
            subscriptionPlans.map((plan) => (
              <article key={plan.title} className='plan-item'>
                <div className='plan-card px-12 py-14'>
                  <strong
                    className='plan-price text-5xl text-center mb-4'
                    style={{
                      background: secondaryColor,
                      color: 'transparent',
                      WebkitBackgroundClip: 'text',
                    }}
                  >{plan.price}</strong>
                  <h3
                    className='text-2xl mb-4'
                    style={{
                      color: secondaryTextColor
                    }}
                  >{plan.title}</h3>
                  <ul className='plan-features'>
                    {
                      plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))
                    }
                  </ul>
                </div>
                <div className='plan-card-footer'>
                  <BlockButton onClick={plan.onClick} >
                    <span style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>Join now <ExternalLink width={16} height={16} /></span>
                  </BlockButton>
                </div>
              </article>
            ))
          }
        </div>
      </section>
      <section className='home-section individual-therapy-section'>
        <div className='individual-therapy-container'>
            <h2 style={{ color: secondaryTextColor }}>Individual Therapy</h2>
            <p>Experience personalized, one-on-one support with licensed therapists who specialize in addressing the unique challenges of modern life. Whether you&apos;re navigating stress, trauma, relationships, or career-related issues, our therapists provide a safe, confidential space to explore your concerns and work toward meaningful growth.</p>
            <div
              className='individual-therapy-features'
            >
              {
                individualTherapyItems.map((item) => (
                  <div className='individual-therapy-feature' key={item.title}>
                    <Badge><h4 className='text-secondaryForeground text-center'>{item.title}</h4></Badge> 
                    <p>{item.description}</p>
                  </div>
                ))
              }
            </div>
            <div>
              <Image
                src={IndividualTherapyImage} 
                alt="individual therapy image"
                width={500}
              />
            </div>
        </div>

      </section>
      <section className='home-section workshops-section'>
        <h2 style={{ color: secondaryTextColor }}>Workshops</h2>
        <div className='workshops-container'>
          <div>
            <Image
              src={WorkshopsImage} 
              alt="workshop image"
              width={500}
            />
          </div>
          <div
            className='workshops-steps'
          >
            {workshopsItems.map((item, index) => (
              <div className='step-item' key={index}>
                <div className='mb-6'>
                  <h4 className='text-secondaryForeground mb-1'>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
                <div className= 'badge-container'>
                  {/* <span className='border inline-block aspect-square px-4 text-center rounded-full'> */}
                    <Badge fullRounded><span className='text-4xl flex items-center justify-center h-full text-secondaryForeground'>{index + 1}</span></Badge>
                  {/* </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='home-section q-a-section'>
        <h2 style={{ color: secondaryTextColor }}>Frequently Asked Questions</h2>
        <div className='q-a-container max-w-4xl'>
            {qaItems.map((item) => (
              <details key={item.question}>
                <summary className='text-secondaryForeground'>{item.question}</summary>
                <p className='mb-6'>{item.answer}</p>
              </details>
            ))}
        </div>
      </section>
    </div>
  )
}

const qaItems = [
  {
    question: 'Why are we building Onchain?',
    answer: 'Onchain Wellness is designed to leverage blockchain technology to address critical challenges in mental health care: privacy, accessibility, and trust. By building onchain, we ensure user data is secure, transactions are transparent, and identities remain private, creating a safe space for individuals to seek support without fear of stigma. This decentralized approach empowers users with full control over their mental health journey.'
  },
  {
    question: 'How does Onchain Wellness ensure my privacy and security?',
    answer: 'Our platform prioritizes privacy through decentralized identity systems, blockchain-based authentication, and end-to-end encryption. This means your data stays under your control, and sensitive information is never shared or stored in vulnerable centralized databases. All telehealth and AI therapy sessions adhere to HIPAA compliance for added security.'
  },
  {
    question: 'What makes Onchain Wellness different from traditional therapy platforms?',
    answer: 'Onchain Wellness stands out by combining the best of mental health care with cutting-edge Web3 technology. We prioritize privacy with decentralized identity management, making sure your personal data stays in your control. Our services are designed to meet the needs of modern, decentralized teams and crypto professionals, offering 1:1 therapy, expert-led workshops, and  AI Therapy.'
  }
]

export default Home