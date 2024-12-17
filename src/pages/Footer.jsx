const Footer = () => {
    return (
      <footer className=" text-white py-10 z-200">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-4 gap-10">
          <div>
            <h5 className="font-bold mb-4">SOLUTIONS</h5>
            <ul className="space-y-2">
              <li>Future Fit Hiring</li>
              <li>Graduate Hiring</li>
              <li>Campus Hiring</li>
              <li>Early Careers Hiring</li>
              <li>Professional Hiring</li>
              <li>Large Volume Hiring</li>
              <li>Low Volume Hiring</li>
              <li>Volunteers Hiring</li>
              <li>End-to-End Hiring</li>
              <li>Career Mapping</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">ASSESSMENTS</h5>
            <ul className="space-y-2">
              <li>Aptitude</li>
              <li>Job-Focused</li>
              <li>Cognitive Ability</li>
              <li>Culture & Future Fit</li>
              <li>Situational Judgement</li>
              <li>Assessment Centers</li>
              <li>Team Building</li>
              <li>Change Readiness</li>
              <li>Emotional Intelligence</li>
              <li>Leadership Development</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">COMPANY</h5>
            <ul className="space-y-2">
              <li>Clients</li>
              <li>Partners</li>
              <li>Science</li>
              <li>Team</li>
              <li>Careers</li>
              <li>Privacy</li>
              <li>Awards</li>
              <li>Press & News</li>
              <li>Client Reviews</li>
              <li>Candidate Reviews</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">RESOURCES</h5>
            <ul className="space-y-2">
              <li>Blogs</li>
              <li>Videos</li>
              <li>Webinars</li>
              <li>Case Studies</li>
              <li>White Papers</li>
            </ul>
            <h5 className="font-bold mt-6 mb-4">CONTACT</h5>
            <ul className="space-y-2">
              <li>Sales Inquiry</li>
              <li>Media Inquiry</li>
              <li>Partnership Inquiry</li>
              <li>Candidate Support</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center mt-10 border-t border-gray-700 pt-5">
          <p> © 2024 The JobeeTech. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-white">YouTube</a>
            <a href="#" className="text-white">Facebook</a>
            <a href="#" className="text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  