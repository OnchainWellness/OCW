import './Footer.css'

// import MailIcon from '@/assets/images/MailIcon';
// import LocationIcon from '../../images/LocationIcon';
// import PhoneIcon from '../../images/PhoneIcon';
import Image from 'next/image';
import OnchainWellnessLogo from '@/app/assets/images/logo.svg'

const Footer = () => {




  return (
    <footer>
      <div
        className="footer-wrappr-hotdrops"
      >
        <div>
            <Image
              className='mx-auto mb-16'
              style={{
                width: '150px',
                height: 'auto'
              }}
              src={OnchainWellnessLogo} 
              alt="Evergreen Fund" 
            />
        </div>
        {/* <div>
        <h4>Contact Us</h4>
        <NavFooter className="footer-nav-hotdrops">
          <ul
            className="footer-nav-item"
          >
            <li>
              <MailIcon width={20} height={20} />Development@EvergreenFund.life
            </li>
            <li>
              <LocationIcon width={20} height={20} />14445 Mulholland Dr., Los Angeles, CA 90019
            </li>
            <li>
              <PhoneIcon />818-530-6378
            </li>
          </ul>
        </NavFooter>
        </div> */}
      </div>
      <div className='my-4 p-6 border-t border-zinc-600 max-w-6xl mx-auto flex justify-center'>
        {new Date().getFullYear()} All rights reserved. Onchain Wellness
      </div>
    </footer>
  );
};

export default Footer;
