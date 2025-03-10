import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Newfooter = () => {
  return (
    <section className="p-10 shadow-lg shadow-white/30 rounded-lg mb-5 bg-gray-800">
      <section className="text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* <!-- About Company --> */}
            <div>
              <h4 className="text-lg font-bold mb-2">About JobeeTech</h4>
              <div className="w-12 h-1 bg-white mb-4"></div>
              <p className="mb-2">
                JobeeTech is revolutionizing the job search and hiring process
                by bridging the gap between talent and opportunity. Our mission
                is to empower job seekers and streamline recruitment for
                companies.
              </p>
              <p>
                We provide tailored career opportunities and cutting-edge tools
                for businesses to discover top talent.
              </p>
            </div>
            {/* <!-- Latest News --> */}
            <div>
              <h4 className="text-lg font-bold mb-2">Latest News</h4>
              <div className="w-12 h-1 bg-white mb-4"></div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white hover:underline">
                    Discover the latest trends in job hiring and talent
                    acquisition.
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline">
                    JobeeTech launches its new AI-powered recruitment tool.
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline">
                    Top strategies for job seekers to excel in 2024.
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white hover:underline">
                    Learn how companies are adapting to remote hiring.
                  </a>
                </li>
              </ul>
            </div>
            {/* <!-- Company Address --> */}
            <div>
              <h4 className="text-lg font-bold mb-2">Company Address</h4>
              <div className="w-12 h-1 bg-white mb-4"></div>
              <p>
                <strong>JobeeTech Headquarters</strong>
              </p>
              <p>13 Wahdat Road, Lahore</p>
              <p>P: (0313-400099)</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <footer className="bg-gray-900 py-4">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white text-center md:text-left mb-4 md:mb-0">
              &copy; 2025 JobeeTech. All rights reserved.
            </div>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-white hover:text-gray-400">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-400">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </section>
    </section>
  );
};
export default Newfooter;
