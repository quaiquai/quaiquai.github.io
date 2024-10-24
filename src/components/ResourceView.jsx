import React, { useEffect, useState, useRef, useCallback  } from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const ResouceView = () => {

    const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    fetch('/writings/Resouces.md')
      .then(response => response.text())
      .then(text => setMarkdownContent(text))
      .catch(error => console.error('Error fetching Markdown:', error));
  }, []);

  return (
    <>
      <Markdown className="markdown" >{markdownContent}</Markdown >
    </>
  );
};

export default SectionWrapper(ResouceView, "ResouceView");
