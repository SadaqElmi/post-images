import React from "react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          About This Project
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-full md:w-1/3">
            <div className="relative aspect-square rounded-full overflow-hidden shadow-lg">
              <Image
                src="/a.jpg"
                alt="Developer Profile"
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Hi, I&apos;m Sadaq Elmi Abdulle
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              I&apos;m a full-stack developer passionate about creating
              meaningful web applications. This project was built with Next.js
              and Tailwind CSS, focusing on creating a modern social media
              experience with real-time interactions.
            </p>
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            User Features
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Create and share posts with images
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Comment on posts and engage with others
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Like and interact with content
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Update profile and avatar
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              View personalized dashboard
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Secure authentication system
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Admin Features
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Manage all user accounts
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Moderate content and comments
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Access advanced analytics
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Manage system configurations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              View detailed activity logs
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Special admin dashboard
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Next.js 15",
              "React 19",
              "TypeScript",
              "Tailwind CSS",
              "MongoDB",
              "Mongoose",
              "Zustand",
              "NextAuth",
              "Cloudinary",
              "Axios",
              "bcryptjs",
              "JWT",
            ].map((tech, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">{tech}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Want to know more?
          </h3>
          <Link
            href="https://wa.me/252619316187"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Contact Me on WhatsApp
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
