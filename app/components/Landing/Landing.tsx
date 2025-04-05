import React from 'react'
import Hero from '../Hero/Hero'
import './Landing.css';

const Landing = () => {
  return (
    <div
      className='home'
      style={{
        marginTop: "100px"
    }}>
      <section className='home-section hero'>
        <Hero />
      </section>
    </div>
  )
}

export default Landing