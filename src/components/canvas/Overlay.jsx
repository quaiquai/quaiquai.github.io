import React from 'react'
import { a } from '@react-spring/web'
import {Tilt} from "react-tilt";

export default function Overlay({ fill }) {
  // Just a Figma export, the fill is animated
  return (
    <Tilt className="overlay">
    <div className="overlay">
      
      <a.svg viewBox="40 0 780 620" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <text fill="#E8B059" style={{ whiteSpace: 'pre' }} fontFamily="Inter" fontSize={48} fontWeight="bold" letterSpacing="0em">
          <tspan x={40} y={257.909} children={'Dr. Matthew McQuaigue \u2014'} />
        </text>
        <text style={{ whiteSpace: 'pre' }} fontFamily="Inter" fontSize={22} fontWeight="bold" letterSpacing="0em">
          <tspan x={40} y={270.909} />
        </text>
        <text style={{ whiteSpace: 'pre' }} fontFamily="Inter" fontSize={30} fontWeight="bold" letterSpacing="0em">
          <tspan x={80} y={321.909} children="Working on:" />
          <tspan x={80} y={372.909} children="-Interactive Web Tech" />
          <tspan x={80} y={423.909} children="-Computer Graphics Research" />
          <tspan x={80} y={474.909} children="-Depth Perception Research" />
          <tspan x={80} y={525.909} children="-Computer Vision" />
        </text>
        <text style={{ whiteSpace: 'pre' }} fontFamily="Inter" fontSize={10.5} fontWeight={500} letterSpacing="0em">
          <tspan x={326} y={600.318} children=":)" />
        </text>
      </a.svg>
      
    </div>
    </Tilt>
  )
}
