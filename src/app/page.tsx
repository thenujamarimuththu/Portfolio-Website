'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl pt-10 pb-8"><b>HOME</b></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20">
        {/* Profile Image Card */}
        <div className="col-span-1">
          <motion.div
            initial={{ rotate: -6 }}
            whileHover={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-neutral-900 p-5 pb-20 md:pb-28 m-4 md:m-8 lg:m-12 shadow-lg border border-gray-100 dark:border-neutral-800 relative"
          >
            <div className="relative w-full aspect-square overflow-hidden">
              <Image
                src="/next.svg" 
                alt="Profile picture of Thenuje Marimuthu"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                priority
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-center">
              <p className="text-gray-800 dark:text-slate-200 pb-4 md:pb-7 text-4xl md:text-6xl font-nothingyoucoulddo">
                me
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Content Section */}
        <section className="font-normal text-center md:text-start col-span-1 my-auto px-2">
          <div className="block md:hidden mb-6">
            <p className="text-2xl md:text-3xl font-serif font-bold mb-1">Hello there,</p>
            <p className="text-2xl md:text-3xl font-serif font-bold">
              I&apos;m Thenuje Marimuthu <span className="inline-block animate-wave">👋</span>
            </p>
          </div>
          
          <div className="hidden md:block mb-6">
            <p className="text-3xl lg:text-4xl font-serif font-bold">
              Hello there, <br />I&apos;m Thenuje Marimuthu
              <span className="inline-block ml-2 animate-wave">👋</span>
            </p>
          </div>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              With a strong background in BHSc (Hons) from Gampaha Wickramarachchi University of 
              Indigenous Medicine, I enjoy solving problems through technology and bringing ideas 
              to life. My work spans various domains including web development, data analysis, 
              and product design, and I strive to deliver solutions that make a real difference.
            </p>
            
            <p>
              Throughout my journey, I have worked on multiple projects that reflect my skills 
              and learning curve. From developing responsive websites to building interactive 
              applications, my projects highlight my ability to adapt and grow with the evolving 
              tech landscape.
            </p>
            
            <p>
              Beyond my professional life, I have a keen interest in coding, design, and 
              photography. These interests fuel my creativity and help me stay motivated in 
              my career.
            </p>
            
            <p>
              Feel free to explore my portfolio to learn more about my projects and achievements. 
              I&apos;m always eager to connect with like-minded individuals and explore new 
              opportunities. If you wish to collaborate or have any questions, please don&apos;t 
              hesitate to reach out through the contact page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}