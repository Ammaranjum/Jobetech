// import { Button } from "@/components/ui/button";
// import Footer from "./Footer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";
// import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'; // Import the faBomb icon
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import Carousel2 from "@/components/ui/new_carasuel";
import Testmonials from "@/components/testmonsials";
import Newfooter from "./new_footer";


const NestedAccordion = ({ faqs }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {/* Questions Mostly asked*/}
      <AccordionItem value="Questions-Mostly-asked">
        <AccordionTrigger>Questions Mostly Asked?</AccordionTrigger>
        <AccordionContent>
          {/* Nested Accordion for Sub-Questions */}
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`nested-item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
const LandingPage = () => {
  return (
    <>
   
      <main className="flex flex-col gap-10  landing_main ">
        <section  >
        <Carousel2 />

        </section>
        <section>
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8">
              <div className="animate-pulse">
                <h1 className="text-center text-4xl font-bold custom_underline">Our Aims</h1>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6  shadow-[0_4px_6px_rgba(255,255,255,0.5)] rounded-lg">
                <FontAwesomeIcon icon={faBriefcase} className="text-7xl	 color_my mb-4" />
                <h2 className="text-xl color_my font-semibold mb-2">Empowering Job Seekers</h2>
                <p className="color_my">
                  Connecting individuals with tailored opportunities to advance their careers effectively.
                </p>
              </div>
              <div className="text-center p-6  shadow-[0_4px_6px_rgba(255,255,255,0.5)] rounded-lg">
                <FontAwesomeIcon icon={faBullseye} className="text-7xl	 color_my mb-4" />
                <h2 className="text-xl color_my font-semibold mb-2">Streamlining Recruitment</h2>
                <p className="color_my">
                  Providing employers with efficient tools to discover and hire top talent seamlessly.
                </p>
              </div>
              <div className="text-center p-6  shadow-[0_4px_6px_rgba(255,255,255,0.5)] rounded-lg">
                <FontAwesomeIcon icon={faShieldHalved} className="text-7xl	color_my mb-4" />
                <h2 className="text-xl color_my font-semibold mb-2">Fostering Growth</h2>
                <p className="color_my">
                  Building a platform that nurtures professional growth and bridges the gap between talent and opportunity.
                </p>
              </div>
            </div>
          </div>

        </section>
        <section>
        <Testmonials/>
        </section>

       {/* Updated Accordion Section */}
       <NestedAccordion faqs={faqs} />
      </main>
      <Newfooter/>
    </>
  );
};

export default LandingPage;
