import React from 'react'
import './DeliveryPage.scss'
import BoltLogo from '../../../public/assets/delivery/bolt.png'
import YangoLogo from '../../../public/assets/delivery/yango.png'
import WoltLogo from '../../../public/assets/delivery/wolt.png'

function DeliveryPage() {
  return (
    <div className="deliveryContainer">
      <h2 className="title">Fast & Reliable Delivery</h2>
      <p className="deliveryDescription">
        Your order will be delivered right to your doorstep in no time. Enjoy a smooth and secure delivery experience with us.
      </p>
      <div className="deliveryOptions">
        <div className="logoCard">
          <a href="[example-url]" target="_blank" rel="noopener noreferrer">
            <img src={WoltLogo} alt="Wolt" className="logoImage" />
          </a>
        </div>
        <div className="logoCard">
          <a href="[example-url]" target="_blank" rel="noopener noreferrer">
            <img src={BoltLogo} alt="Bolt" className="logoImage" />
          </a>
        </div>
        <div className="logoCard">
          <a href="[example-url]" target="_blank" rel="noopener noreferrer">
            <img src={YangoLogo} alt="Yango" className="logoImage" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default DeliveryPage
