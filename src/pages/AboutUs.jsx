import React from "react";
import Button from "../components/ui/button";
import { Link } from "react-router-dom";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { MdOutlineSupportAgent } from "react-icons/md";
import { LuScaling } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { motion } from "framer-motion";

const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800 overflow-hidden">
      {/* About Us Content */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative">
        {/* Decorative elements */}
        <div className="absolute -left-20 top-1/3 w-64 h-64 rounded-full bg-secondary/10 blur-3xl -z-10"></div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/about_us.png?raw=true"
            alt="Smart IoT Devices"
            className="rounded-lg shadow-lg w-full hover:shadow-xl transition-shadow duration-300"
          />
          <div className="absolute -bottom-6 -right-6 bg-white px-6 py-3 rounded-lg shadow-md border border-gray-100">
            <div className="text-sm text-gray-500">Since 2018</div>
            <div className="text-xl font-bold text-primary">
              10,000+ Devices Sold
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-[32px] text-secondary leading-none uppercase pb-0 font-Rubik">
            Our Story
          </h1>
          <h2 className="text-[36px] text-primary font-bold pb-0 font-Roboto mt-2">
            Innovating Life Through IoT
          </h2>
          <p className="text-gray-900 opacity-50 text-[20px] mb-6 mt-6">
            we specialize in delivering cutting-edge IoT products that simplify,
            automate, and enhance daily living and industrial operations. From
            smart home solutions to industrial sensors, we bring the Internet of
            Things to life.
          </p>
          <p className="text-gray-900 opacity-50 text-[20px] mb-8">
            Our eCommerce platform offers a curated selection of high-quality
            IoT devices backed by expert support and seamless integration.
            Whether you're upgrading your home or scaling your smart factory, we
            have you covered.
          </p>
          <Link to="/products">
            <Button variant="primary" className="group">
              <span className="flex items-center gap-2">
                Explore Our Products
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="text-center py-16 md:py-24 font-Roboto font-normal bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[36px] text-primary font-bold pb-0"
          >
            Why choose Our Store
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-900 opacity-50 text-[20px] mb-6 max-w-2xl mx-auto"
          >
            We are more than a store — we are your trusted IoT partner.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-[44px]">
            {[
              {
                icon: <AiOutlineSafetyCertificate />,
                title: "Certified Devices",
                desc: "Only the most secure, tested, and reliable IoT devices make it to our shelves.",
              },
              {
                icon: <MdOutlineSupportAgent />,
                title: "Expert Support",
                desc: "Get real advice from real engineers — not chatbots.",
              },
              {
                icon: <LuScaling />,
                title: "Scalable Solutions",
                desc: "From home setups to enterprise-level deployments.",
              },
              {
                icon: <TbTruckDelivery />,
                title: "Fast Delivery",
                desc: "Get your devices shipped with care and speed.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white shadow-sm hover:shadow-md p-6 rounded-[6px] flex flex-col justify-center items-center transition-all duration-300 border border-gray-100"
              >
                <div className="text-secondary text-5xl mb-4 p-3 bg-secondary/10 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-[20px] text-primary font-bold pb-0 font-Roboto mt-[12px]">
                  {item.title}
                </h3>
                <p className="text-gray-900 opacity-50 text-[14px] mb-0 mt-[12px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 font-Roboto font-normal">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[36px] text-primary font-bold pb-0 text-center"
        >
          Our Smart Onboarding Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-900 opacity-50 text-[20px] mb-[44px] max-w-3xl mx-auto"
        >
          We make adopting smart solutions effortless — here's how we ensure a
          smooth journey.
        </motion.p>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://github.com/Naveed89-tech/Click-Connect-Images/blob/main/about_us_two.jpg?raw=true"
              alt="IoT process"
              className="rounded-lg shadow-lg w-full hover:shadow-xl transition-shadow duration-300"
            />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              6 Steps
            </div>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              [
                "Needs Assessment",
                "We start by understanding your use case and environment.",
              ],
              [
                "Device Matching",
                "We match you with the perfect device(s) from our catalog.",
              ],
              [
                "Integration Planning",
                "We help you plan smooth setup and compatibility.",
              ],
              [
                "Deployment Support",
                "Our guides and team help ensure seamless activation.",
              ],
              [
                "Monitoring & Updates",
                "We offer ongoing firmware and platform support.",
              ],
              [
                "Scale & Automate",
                "Expand or upgrade your setup with confidence.",
              ],
            ].map(([title, desc], idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div
                  className="
  w-8 aspect-square     /* any width, keeps it square */
  bg-secondary/10 text-secondary
  rounded-full
  flex items-center justify-center
  mt-1
"
                >
                  <span className="font-bold text-[16px]">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="text-[20px] text-primary pb-0 font-Roboto font-bold">
                    {title}
                  </h4>
                  <p className="text-gray-900 opacity-50 text-[16px]">{desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-white py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[36px] text-primary font-Roboto font-bold pb-0"
          >
            Start Your IoT Journey Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-gray-900 opacity-50 text-[16px] mb-8"
          >
            Discover smart living. Explore automation. Empower your space with
            IoTrix.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/products">
              <Button variant="primary" className="px-12">
                Browse Devices
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;