'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Web Development Portfolio",
      description: "Built a personal portfolio website using modern web development technologies.",
      image: "/project1.jpg",
      githubUrl: "https://github.com/jebarsanthatcroos/portfolio.git",
      liveUrl: null
    },
    {
      id: 2,
      title: "Data Analysis using Minitab",
      description: "Performed exploratory data analysis on Thai Pongal day periods data to improve customer experience.",
      image: "/Project_1.webp",
      githubUrl: null,
      liveUrl: null
    },
    {
      id: 3,
      title: "IoT Project",
      description: "Developed a predictive model for lectures churn using Arduino.",
      image: "Project_3.jpg",
      githubUrl: null,
      liveUrl: "https://thingspeak.mathworks.com/channels/2788309"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl pt-10 pb-8 font-bold text-center md:text-left"
      >
        PROJECTS
      </motion.h1>

      <div className="flex flex-wrap -mx-4 mt-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-full md:w-1/3 px-4 mb-8"
          >
            <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {project.description}
                </p>

                <div className="flex gap-3 mt-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FiExternalLink />
                      GitHub
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiExternalLink />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}