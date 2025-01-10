import image1 from '/bill gates.jpg';

const Testmonials = () => {
    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat text-white py-12"
            style={{ backgroundImage: "url('/nicolas-thomas-PLDkBHbM3Hc-unsplash.jpg')" }}
        >
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50"></div>
            <div className="relative z-10 container mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl animate-pulse font-semibold">Testimonials</h2>
                    <div className="mt-3 mx-auto w-24 h-1 bg-gray-300 rounded-sm animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                        <p className="mb-4">
                        JobeeTech has revolutionized our hiring process by efficiently matching candidates with the right roles, saving both time and resources. Their platform is user-friendly and provides valuable insights into candidate skills and qualifications. We highly recommend JobeeTech to any organization looking to streamline their recruitment efforts.
                        </p>
                        <img src={image1} alt="Bill Gates" className="w-12 h-12 rounded-full mx-auto mb-2" />
                        <div className="font-semibold">Bill Gates</div>
                        <div className="text-gray-300">Microsoft</div>
                    </div>
                    <div className="text-center">
                        <p className="mb-4">
                        With JobeeTech, we’ve experienced a more streamlined and effective recruitment process, ensuring the best candidates are identified quickly. Their platform is intuitive and user-friendly, making it a pleasure to use. JobeeTech has significantly improved our hiring efficiency and candidate quality.
                        
                        </p>
                        <br />
                        <img src="/steve.png" alt="Steve Jobs" className="w-12 h-12 rounded-full mx-auto mb-2" />
                        <div className="font-semibold">Steve Jobs</div>
                        <div className="text-gray-300">Apple</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testmonials;
