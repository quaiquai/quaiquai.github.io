import React, { useEffect, useState, Suspense } from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import {blogs} from "../constants"
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { staggerContainer } from "../utils/motion";

const ServiceCard = ({ index, title, desc, icon }) => (
    <Tilt className="w-full mt-20">
      <motion.div
        onClick={() => window.location.href = desc} 
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
          
          
  
          <h3 className="text-white text-[20px] font-bold text-center float-center">
            {title}
          </h3>
          <div className="flex justify-center mt-4">
          <img
            src={icon}
            alt="paper"
            className="w-12 h-12 object-contain "
          />
          </div>
          {(desc) ? <h3 className=" mt-5 text-slate-400 text-[15px] text-center float-center">{desc}</h3> : <></>}
  
        </div>
      </motion.div>
    </Tilt>
  );

const BlogsList= () => {

    return (

        <motion.section variants={staggerContainer()} className={`${styles.padding} max-w-lg mx-auto relative z-0`} initial='hidden'
            whileInView='show'>
            {
            blogs.map((service, index) => (
                <ServiceCard key={service.title} index={index} desc={service.path} {...service} />
            ))
            }
        </motion.section>

    )
}

export default BlogsList