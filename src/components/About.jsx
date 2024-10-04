import React from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      >
        <img
          src={icon}
          alt="web-development"
          className="w-16 h-16 object-contain"
        />

        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      Hello, I am a PhD candidate with a focus on computer graphics, interactive learning technologies, and AR/VR depth perception/rendering.
      My research centers on the perception of depth in virtual and augmented environments,
      exploring how different rendering methods affect accuracy.
      I am also part of a team developing the BRIDGES and CS-Materials interactive learning technologies
      (https://cs-materials.herokuapp.com/) (https://bridgesuncc.github.io/).
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      I have held a variety of appointments, including working as a Developer and Research Assistant for
      BRIDGES/CS-Materials in Charlotte, NC, and as a Lecturer at the University of North Carolina at Charlotte,
      for Data Structures and Algorithms and also serving as a Graduate Teaching Assistant for Introduction to Computer Graphics.
      I am earning my PhD in Computer Science from the University of North Carolina at Charlotte,
      where I am conducting research on egocentric depth perception in VR/AR. I am currently developing several notable projects,
      such as the Egocentric AR/VR Perceptual Matching and Depth Cue/Rendering Manipulated Framework,
      Real-time HoloLens Light Position Aquisition and IBL for testing Depth Perception Performance, and
      BRIDGES 3D rendering engine for cs1/cs2 student learning.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      I have received several honors and awards, including the GSSF Funding, Atkins Undergraduate Research Award,
      CCI High Achiving Award, and Being a CCI Research Scholar. I have published several peer-reviewed papers on
      computer science education and technology. I also hold a Master’s Degree in Computer Science with a concentration in
      Visualization and Computer Graphics, as well as a Bachelor’s Degree in Computer Science.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
