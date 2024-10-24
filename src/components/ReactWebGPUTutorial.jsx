import React, {useState, useEffect } from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from "react-markdown"
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const ReactWebGPUTutorial = () => {
 

  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/writings/WebGPUReactTutorial.md');
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

      <MathJaxContext>
        <ReactMarkdown className="markdown"
        //overwritting html tags generated from markdown to use my style
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
            //TODO: figure out how to get motion and tilt to work here.
            h1({className, children, ...rest}) {
              let heading = (<motion.div  {...rest} ><h2 {...rest} className={styles.sectionHeadText}>{children}</h2></motion.div>)
              return heading
            },
            //TODO: figure out how to get motion and tilt to work here.
            h2({className, children, ...rest}) {
              let heading = (<motion.div  {...rest} ><h3 {...rest} className={styles.sectionHead3Text}>{children}</h3></motion.div>)
              return heading
            }
          }}
        >
          {String(markdownContent)}
        </ReactMarkdown>
      </MathJaxContext>
      {/* <embed src="./src/components/MMcQuaigue_CV.pdf" width="100%" height="5000"></embed> */}
    </>
  );
};

export default SectionWrapper(ReactWebGPUTutorial, "ReactWebGPUTutorial");
