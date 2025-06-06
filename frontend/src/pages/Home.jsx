import React, { useState } from 'react';
import Typewriter from 'typewriter-effect';
import './Home.css';

const Home = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>
            <Typewriter
              options={{
                strings: ['SmartFin – An AI-based web portal to improve your finance and saving'],
                autoStart: true,
                loop: true,
                delay: 40,
                deleteSpeed: 20,
              }}
            />
          </h1>
      <p>
  Your financial freedom starts here. Experience smart savings, automated insights, and real-time decision-making with SmartFin.
  {showMore && (
    <>
      {' '}With our smart dashboard, you can visualize expenses, monitor habits, and make better choices without stress.
    </>
  )}
</p>

          <button onClick={() => setShowMore(true)}>Learn More</button>
        </div>

        <div className="hero-image">
          <img src="/images/finance-side.png" alt="Finance Illustration" />
        </div>
      </div>

     
    </div>
  );
};

export default Home;
