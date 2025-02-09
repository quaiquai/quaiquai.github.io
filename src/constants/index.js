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
  {
    id: "blogs",
    title: "Articles"
  }
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
    description: "This research investigated how the similarity of the rendering parameters of background and foreground objects affected egocentric depth perception in indoor virtual and augmented environments. We refer to the similarity of the rendering parameters as visual 'congruence'. Study participants manipulated the depth of a sphere to match the depth of a designated target peg. In the first experiment, the sphere and peg were both virtual, while in the second experiment, the sphere is virtual and the peg is real. In both experiments, depth perception accuracy was found to depend on the levels of realism and congruence between the sphere, pegs, and background. In Experiment 1, realistic backgrounds lead to overestimation of depth, but resulted in underestimation when the background was virtual, and when depth cues were applied to the sphere and target peg. In Experiment 2, background and target pegs were real but matched with the virtual sphere; in comparison to Experiment 1, realistically rendered targets prompted an underestimation and more accuracy with the manipulated object. These findings suggest that congruence can affect distance estimation and the underestimation effect in the AR environment resulted from increased graphical fidelity of the foreground target and background."
  },
  {
    title: "Influence of Visual Field Congruence and Realism Through Global Illumination on Egocentric Depth Perception in Virtual and Augmented Environments",
    icon: paper,
    description: "This research investigated how the similarity and realism of the rendering parameters of background and foreground objects affected egocentric depth perception in indoor virtual and augmented environments. I refer to the similarity of the rendering parameters as visual ‘congruence’. Across three experiments, participants performed a perceptual matching task where they manipulated the depth of a sphere to match the depth of a designated target peg. Each experiment served to evaluate the influence of different levels of realism and congruence between environment objects on depth perception. In the first experiment, the sphere and peg were both virtual and unrealistic. The background would switch between virtual and real. In the second experiment, the sphere was virtual (unrealistic) and the peg was real. In the third experiment, the sphere was virtual (realistic), and the peg was either real or virtual (realistic). Realistically rendered objects used physically based rendering and global illumination from the real environment compared to traditional simplistic rendering. In all experiments, depth perception accuracy was found to depend on the levels of realism and congruence between the sphere, pegs, and background. My results demonstrate the use of PBR techniques and baked global illumination applied to virtual targets and manipulated objects resulted in a reduction in depth estimation errors compared to the non-PBR condition. Moreover, I found that the visual congruence between virtual and real elements plays an important role in depth judgments with real targets influencing accurate depth perception when interacting with PBR-manipulated objects. Interaction effects between target and manipulated object affect depth perception switching from overestimations to underestimations depending on rendering conditions. My findings contribute to the growing body of knowledge on AR and VR depth perception which can validate the efforts for developing advanced rendering techniques for augmented environments. Results can help determine the design and development choices for future AR/VR applications, particularly those requiring precise depth judgments and seamless real-world integrations of virtual objects."
  },
  {
    title: "Data-Driven Discovery of Anchor Points for PDC Content",
    icon: paper,
    description: "The Parallel and Distributed Computing community has been interested in integrating PDC content into early CS curriculum to prime the students for more advanced materials and build a workforce able to leverage advanced computing infrastructure. To deploy this strategy at scale, it is important to identify anchor points in early CS courses where we can insert PDC content. We present an analysis of CS courses that primarily focuses on CS1 and Data Structure courses. We collected data on course content through in-person workshops, where instructors of courses classified their course materials against standard curriculum guidelines. By using these classification, we make sense of how Computer Science is being taught. We highlight different types of CS1 and Data Structure courses. And we provide reflection on how that knowledge can be used by PDC experts to identify anchoring points for PDC content, while being sensitive to the needs of instructors."
  },
  {
    title: "VISUALIZATION AND STRUCTURING OF BIBLIOGRAPHIC RECOMMENDATIONS",
    icon: paper,
    description: "This study analyzes methods to structure and visualize bibliographic recommendations efficiently while conveying important information for users. Most of the work being developed in the realm of bibliography visualizations is surrounding the question of how authors are related and the network concerning their progression throughout their career. The aspect of conveying information about papers and why to read them have become or are the secondary idea when analyzing these graphs. Why should a user choose a paper over another when a visualization technique or algorithm can aid in the decision-making process? Our visualization should be the reverse/opposite of past work; Co-authorship networks are secondary with a primary emphasis on the network of recommended papers that the user wants to read. This study provides a structured pipeline for better viewing bibliographic recommendations and their relations. This method makes use of important machine learning techniques such as word embeddings and self-organizing maps to take extracted topics/key phrases and map relations to other recommended papers. This extends the typical node-link graph with links representing relations and provides spatial relations of papers that are more intuitive to a user. This study also provides exposure of metadata for customizable aspects of the visualizations for interactive searching. In addition to a 2D view of the recommendations, a side-by-side 3D view is provided for quantitative values."
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
    description: "Grounding computer science concepts in real-world and socially relevant problems can be a key to increasing students' motivation and engagement in computing. BRIDGES provides an infrastructure for use in early CS courses that allows students to easily integrate real-world data into their routine course assignments and visualize the data and data structures of their implementations. The BRIDGES API provides several key advantages, First, minimal effort is needed to accessing and using interesting real-world datasets in CS homework assignments. Available data sets in BRIDGES span multiple domains, including entertainment, science, geographic data, and literature. Second, BRIDGES can be used by students to create and explore a visualization of the data used and data structures implemented in their assignments. Such visualizations can be used to illustrate concepts of underlying algorithm or data structure, or important data features. Third, the BRIDGES Game API allows students to implement 2D games, to emphasize basic concepts, such as control structures, looping and logic, while providing a fun experience. Finally, students can explore the benchmarking of algorithms in BRIDGES by using real and large data sets, emphasizing algorithm performance and computational complexity. Workshop attendees will engage in hands-on experience with BRIDGES with multiple datasets and will have opportunities to discuss how BRIDGES can be used in their own courses."
  },
  {
    title: "Engaging CS1 Students with Audio Themed Assignments",
    icon: paper,
    description: "Early computer science courses (CS1, CS2) are the cornerstone of student understanding of computer science. These courses introduce the foundational knowledge of computer science needed to understand more complex topics and to be successful in follow-on courses. It is thus important to introduce CS concepts in an engaging and easy-to-understand manner to increase student interest and retention. This paper presents a new approach to teaching the Computer Science 1 (CS1) course through our BRIDGES system. This approach aims to increase student engagement and improve learning outcomes by using audio-based assignments that they can manipulate and process audio signal information, as well as visualize and play them. We explain how to design and implement audio-based assignments and connect them to fundamental programming constructs such as variables, control flow, and simple data structures, such as arrays. These assignments encourage and engage students by using audio data they are interested in to write code, promoting problem-solving and improvements in their critical thinking skills."
  },
  {
    title: "Location Based Assignments in Early CS Courses Using BRIDGES Engages Students",
    icon: paper,
    description: "Freshmen and sophomore level courses in computer science are critical to long-term student development and success. At the same time, these courses, such as data structures and algorithms are usually challenging and require significant motivation to keep students engaged. In this work, we present through our BRIDGES system a set of location based assignments that can serve to reinforce core concepts and algorithms by placing them in more meaningful settings and applications, and demonstrate the relevance of computing in the early stages of a student's career. We performed a small pilot study using a subset of these assignments in a special topics course on algorithms, and conducted student surveys after each assignment. The surveys were unanimously positive, and the students enjoyed coding the algorithms as well as the datasets and visualizations associated with the assignments."
  },
  {
    title: "Improving the Structure and Content of Early CS Courses with Well Aligned, Engaging Materials",
    icon: paper,
    description: "This workshop will provide instructors in early CS courses with tools and strategies for designing and building high quality courses by structure and content, that are student centered, aligned with stated learning outcomes, and with access to engaging learning materials. Workshop participants will be introduced to two software toolkits, CS Materials and BRIDGES, towards achieving these goals. These tools permit searches for learning materials that meet specific learning outcomes, while at the same time provide access to engaging materials that demonstrate core CS relevance to real world problems and applications. Workshop participants will be exposed to strategies for designing courses, materials and tools that can engage today's students and meet their expectations. Although this workshop will be based on CS Materials and BRIDGES, the lessons learnt are independently beneficial to participants."
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

const blogs = [
  {
    title: "WebGPUReactTutorial",
    path: "/writings/WebGPUReactTutorial.md"
  }
]

export { services, technologies, experiences, testimonials, projects, publications, blogs };
