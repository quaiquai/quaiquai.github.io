import React, {useState, useEffect } from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from "react-markdown"

import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const ReactWebGPUTutorial = () => {
 

  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('./src/writings/WebGPUReactTutorial.md');
      console.log(response)
      const text = await response.text();
      setMarkdownContent(text);
    };
    
    fetchData();
  }, []);
  
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Setting Up WebGPU Rendering in React: A Comprehensive Guide.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      WebGPU is the next-generation graphics API that promises to bring high-performance 
      3D graphics to the web. In this post, we'll explore how to set up a WebGPU rendering 
      system within a React application, focusing on efficiency and best practices.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      WebGPU provides low-level access to GPU capabilities, allowing for high-performance graphics and compute 
      operations in web applications. React, on the other hand, is a popular JavaScript library for building user 
      interfaces. Combining these technologies allows us to create interactive, GPU-accelerated applications with 
      a robust and efficient UI framework.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      To begin, we'll create custom hooks to manage WebGPU setup and canvas sizing. Here's an example of a useWebGPU hook:
      </motion.p>
      <SyntaxHighlighter className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]" language="javascript" style={atomDark}>
        {`
            import { useEffect, useState } from "react"
            import useDevice from "./useDevice"

            const useWebGPU = (canvas) => {
                const [context, setContext] = useState()
                const [format, setFormat] = useState('bgra8unorm')
                const { adapter, device, gpu } = useDevice()

                useEffect(() => {
                    if (!canvas || !gpu || !adapter) return

                    const context = canvas.getContext('webgpu')
                    if (context === null) return
                    setContext(context)

                    setFormat(gpu.getPreferredCanvasFormat())
                    console.log("in useWebGPU")
                }, [canvas, gpu, adapter]);

                return { canvas, context, format, adapter, device }
            }

            export { useWebGPU }
        `}
      </SyntaxHighlighter>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]"
      >
      This hook encapsulates the logic for setting up the WebGPU context and determining the preferred format for the canvas. It relies on another custom hook, useDevice, which we assume handles the creation of the WebGPU adapter and device.
      </motion.p>
      <div className="markdown">
      <ReactMarkdown
        components={{
          code({ className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={atomDark}
                {...rest}
              >
                {children}
              </SyntaxHighlighter>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdownContent}
      </ReactMarkdown>
      </div>
      
    </>
  );
};

export default SectionWrapper(ReactWebGPUTutorial, "ReactWebGPUTutorial");
