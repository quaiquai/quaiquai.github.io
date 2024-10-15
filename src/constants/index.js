import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  paper,
  c,
  researcher,
  threed
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "publications",
    title: "Publications",
  },
  {
    id: "resources",
    title: "Graphics Resources",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "C++ Developer",
    icon: c,
  },
  {
    title: "Researcher",
    icon: researcher,
  },
  {
    title: "Graphics Rendering",
    icon: threed,
  },
];

const publications = [
  {
    title: "Impact of Background, Foreground, and Manipulated Object Rendering on Egocentric Depth Perception in Virtual and Augmented Indoor Environments",
    icon: paper,
  },
  {
    title: "Influence of Visual Field Congruence and Realism Through Global Illumination on Egocentric Depth Perception in Virtual and Augmented Environments",
    icon: paper,
  },
  {
    title: "Data-Driven Discovery of Anchor Points for PDC Content",
    icon: paper,
  },
  {
    title: "VISUALIZATION AND STRUCTURING OF BIBLIOGRAPHIC RECOMMENDATIONS",
    icon: paper,
  },
  {
    title: "CS-Materials: A system for classifying and analyzing pedagogical materials to improve adoption of parallel and distributed computing topics in early CS courses",
    icon: paper,
    description: "In this work, we contend that simultaneously classifying pedagogical materials against the CS13 and the PDC12 curriculum guidelines can address some of the challenges faced by instructors and can promote broader adoption of PDC materials in early CS courses. We present CS Materials, a system that can be used to categorize pedagogical materials according to well-known and established curricular guidelines. We show that CS Materials can be leveraged 1) by instructors of early CS courses to find materials that are similar to the one that they use but that also cover PDC topics, and 2) by instructors to check the coverage of topics (and gaps) in a course, and 3) by PDC experts to identify topics for which PDC instructional materials do not exist or are insufficient in order to inform development of additional PDC curricular materials."
  },
  {
    title: "Classifying pedagogical material to improve adoption of parallel and distributed computing topics",
    icon: paper,
    description: " In this paper, we present CAR-CS, a system that can be used to categorize pedagogical materials according to well-known and established curricular guidelines and show that CAR-CS can be leveraged 1) by PDC experts to identify topics for which pedagogical material does not exist and that should be developed, 2) by instructors of early CS courses to find materials that are similar to the one that they use but that also cover PDC topics, 3) by instructors to check the topics that a course currently covers and those it does not cover."
  },
  {
    title: "Visualization, assessment and analytics in data structures learning modules",
    icon: paper,
    description: " In this work we demonstrate preliminary work on building interactive teaching modules for data structures and algorithms courses with the following characteristics, (1) the modules are highly visual and interactive, (2) training and assessment are tightly integrated within the same module, with sufficient variability in the exercises to make it next to impossible to violate academic integrity, (3) a data logging and analytic system that provides instantaneous student feedback and assessment, and (4) an interactive visual analytic system for the instructor to see students/ performance at the individual, sub-group or class level, allowing timely intervention and support for selected students. Our modules are designed to work within the infrastructure of the OpenDSA system, which will promote rapid dissemination to an existing user base of CS educators. We demonstrate a prototype system using an example dataset."
  },
  {
    title: "Mapping materials to curriculum standards for design, alignment, audit, and search",
    icon: paper,
    description: "We present CS Materials, an open-source resource targeted at computing educators for designing and analyzing courses for coverage of recommended guidelines, and alignment between the various components within a course, between sections of the same course, or course sequences within a program. The system works by facilitating mapping educational materials to national curriculum standards. A side effect of the system is that it centralizes the design of the courses and the materials used therein. The curriculum guidelines act as a lingua franca that allows examination of and comparison between materials and courses. More relevant to instructors, the system enables a more precise search for materials that match particular topics and learning outcomes, and dissemination of high quality materials and course designs. This paper discusses the system, and analyzes the costs and benefits of its features and usage. While adding courses and materials requires some overhead, having a centralized repository of courses and materials with a shared structure and vocabulary serves students, instructors, and administrators, by promoting a data-driven approach to rigor and alignment with national standards."
  },
  {
    title: "Real-world assignments at scale to reinforce the importance of algorithms and complexity",
    icon: paper,
    description: " We present the point of view that by solving real-world problems where algorithmic paradigms and complexity matter, students will become more engaged with the course and appreciate its importance. Our approach relies on a lean educational framework that provides simplified access to real life datasets and benchmarking features. The assignments we present are all scaffolded, and easily integrated into most algorithms courses. Feedback from using some of the assignments in various courses is presented to argue for the validity of the approach."
  },
  {
    title: "Engaging early programming students with modern assignments using bridges",
    icon: paper,
    description: " We demonstrate that one can make an interesting CS1 experience for students by coupling interesting datasets with visual representations and interactive applications. Our approach enables teaching an engaging early programming course without changing the content of that course. This approach relies on the BRIDGES system that has been under development for the past 5 years; BRIDGES provides easy access to datasets and interactive applications. The assignments we present are all scaffolded to be directly integrated into most early programming courses to make routine topics more compelling and exciting."
  },
  {
    title: "BRIDGES: Real world data, assignments and visualizations to engage and motivate CS majors",
    icon: paper,
    description: "BRIDGES is a software framework for creating engaging assignments for required courses such as data structures and algorithms. It provides students with a simplified API that populates their own data structure implementations with live and real-world data, and provides the ability for students to easily visualize the data structures they create as part of routine classroom exercises. The objective is to use the infrastructure to promote a better understanding of the data structure and its underlying algorithms. This report describes the BRIDGES infrastructure and provides evaluation data collected over the first five years of the project. In the first 2 years, as we were developing the BRIDGES projects, our focus was on gathering data to assess whether the addition of the BRIDGES exercises had an effect on student retention of core concepts in data structures; and throughout the 5-year duration of the project, student interest and faculty feedback were collected online and anonymously. A mixed method design was used to evaluate the project impact. A quasiexperimental design compared student cohorts who were enrolled in comparable course sections that used BRIDGES with those that did not. Qualitative and quantitative measures were developed and used together with course grades and grade point averages. Interest and relevance in BRIDGES programming assignments was assessed with additional survey data from students and instructors. Results showed that students involved in BRIDGES projects demonstrated larger gains in knowledge of data structures compared to students enrolled in comparable course sections, as well as long-term benefits in their performance in four follow-on required courses. Survey responses indicated that some investment of time was needed to use BRIDGES, but the extra efforts were associated with several notable outcomes. Students and instructors had positive perceptions of the value of engaging in BRIDGES projects. BRIDGES can become a tool to get students more engaged in critical foundational courses, demonstrating relevance and context to todays computational challenges."
  },
  {
    title: "Real-World Data, Interactive Games and Data Structure Visualizations in Early CS Courses Using BRIDGES",
    icon: paper,
  },
  {
    title: "Engaging CS1 Students with Audio Themed Assignments",
    icon: paper,
  },
  {
    title: "Location Based Assignments in Early CS Courses Using BRIDGES Engages Students",
    icon: paper,
  },
  {
    title: "Improving the Structure and Content of Early CS Courses with Well Aligned, Engaging Materials",
    icon: paper,
  },
  {
    title: "Integrating Visualization, Assessment and Analytics in Data Structures Learning Modules",
    icon: paper,
  },
  {
    title: "An Engaging CS1 Curriculum Using BRIDGES",
    icon: paper,
    description: "In this poster, we demonstrate an enriching experience for students by coupling interesting datasets with visual representations and interactive applications, without having to change the content of that course. Our approach utilizes extensions to BRIDGES, an API in use for sophomore level CS courses for the past 5 years. BRIDGES provides easy access to external datasets and helps build interactive applications. The assignments we present are all scaffolded in a way that can be directly integrated into most early programming courses to make routine topics compelling and exciting."
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "React.js Developer",
    company_name: "Starbucks",
    icon: starbucks,
    iconBg: "#383E56",
    date: "March 2020 - April 2021",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "React Native Developer",
    company_name: "Tesla",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Jan 2021 - Feb 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Shopify",
    icon: shopify,
    iconBg: "#383E56",
    date: "Jan 2022 - Jan 2023",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Meta",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Car Rent",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects, publications };
