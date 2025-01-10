import React, { useEffect, useRef } from 'react';
import Flickity from 'flickity';
import 'flickity/css/flickity.css'; // Import Flickity CSS

import image4 from './images/nav1.jpg';
import image5 from './images/nav2.jpg';
import image6 from './images/nav3.jpg';
import '../ui/new_carasuel.css';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const Carousel2 = () => {
  const flickityRef = useRef(null);

  useEffect(() => {
    const flickityInstance = new Flickity(flickityRef.current, {
      cellAlign: 'left',
      contain: true,
      autoPlay: true,
      imagesLoaded: true, // Ensure images are loaded before carousel initializes
    });

    // Cleanup on unmount
    return () => {
      flickityInstance.destroy();
    };
  }, []);

  return (
    <section className="carousel-section  ">
      {/* Carousel Background */}
      <div className="carousel1" ref={flickityRef}>
        <div className="carousel-cell1">
          <img src={image4} alt="Carousel 1" className="img-fluid" />
        </div>
        <div className="carousel-cell1">
          <img src={image5} alt="Carousel 2" className="img-fluid" />
        </div>
        <div className="carousel-cell1">
          <img src={image6} alt="Carousel 3" className="img-fluid" />
        </div>
      </div>

      {/* Static Text Overlay */}
      <div className="text-overlay">
        <div className="bello">
          <h1>Welcome to Our Job Portal</h1>
          <p>
            Your dream job is just a click away. Explore countless opportunities tailored to your
            skills and aspirations. Start your journey towards a fulfilling career today!
          </p>
          
        </div>
      </div>
      <div className="text-overlay1">
      <div className="flex gap-6 justify-center button-container">
            <Link to={"/jobs"}>
              <Button className="bg-blue-700 bg-opacity-30 text-blue-700 border border-blue-700 rounded-lg hover:bg-opacity-50" size="xl">
                Find Jobs
              </Button>
            </Link>
            <Link to={"/post-job"}>
              <Button className="bg-red-700 bg-opacity-30 text-red-700 border border-red-700  rounded-lg hover:bg-opacity-50" size="xl">
                Post a Job
              </Button>
            </Link>
          </div>
      </div>
    </section>
  );
};

export default Carousel2;
