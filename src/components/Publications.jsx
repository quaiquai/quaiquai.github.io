import React from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { publications } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { Button } from "@mui/material";


const ServiceCard = ({ index, title, description, icon }) => (
  <Tilt className="w-full mt-10">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.15, 0.75)}
      className="w-full green-pink-gradient p-[2px] rounded-[20px] shadow-card"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-primary rounded-[25px] py-5 px-12 min-h-[100px] flow-root align-middle"
      >
        
        <div className=" float-left">
        <img
          src={icon}
          alt="paper"
          className="w-12 h-12 object-contain "
        />
        </div>

        <h3 className="text-white text-[20px] px-12 font-bold text-center float-center">
          {title}
        </h3>
        {/* {(description) ? <h3 className=" mt-5 text-slate-400 text-[15px] px-12 text-center float-right">{description}</h3> : <></>} */}

        {/* <h3 className="text-white text-[12px] px-12 font-bold text-left break-words max-w-lg min-w-[400px]">
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </h3> */}
      </div>
    </motion.div>
  </Tilt>
);

const Publication = () => {
  return (
    <>
      <div className="mt-2 flex flex-wrap gap-5">
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Matthew McQuaigue</p>
          <h2 className={styles.sectionHeadText}>Publications.</h2>
        </motion.div>
        {publications.map((service, index) => (
          <ServiceCard key={service.title} index={index} desc={service.description} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Publication, "publication");
