import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          About This Project
        </h1>

        {/* Profile Section */}
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
              Hi, I'm Sadaq Elmi Abdulle
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              I'm a full-stack developer passionate about creating meaningful
              web applications. This project was built with Next.js and Tailwind
              CSS, focusing on creating a modern social media experience with
              real-time interactions.
            </p>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About The Project
            </h2>
            <p className="text-gray-600 mb-4">
              This social media platform is designed to provide users with:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔</span>
                Real-time post creation and sharing
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔</span>
                Interactive comments system
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔</span>
                Like and engagement tracking
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔</span>
                Responsive design for all devices
              </li>
            </ul>
          </section>

          {/* Technology Stack */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Technology Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">Next.js 15</p>
                <p className="text-sm text-gray-500">App Router & SSR</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">React 19</p>
                <p className="text-sm text-gray-500">Core Framework</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">TypeScript</p>
                <p className="text-sm text-gray-500">Type Safety</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">Tailwind CSS</p>
                <p className="text-sm text-gray-500">Styling</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">MongoDB</p>
                <p className="text-sm text-gray-500">Database</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">Mongoose</p>
                <p className="text-sm text-gray-500">ODM</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">Zustand</p>
                <p className="text-sm text-gray-500">State Management</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">NextAuth</p>
                <p className="text-sm text-gray-500">Authentication</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">Cloudinary</p>
                <p className="text-sm text-gray-500">Image Storage</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">Axios</p>
                <p className="text-sm text-gray-500">HTTP Client</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">bcryptjs</p>
                <p className="text-sm text-gray-500">Password Hashing</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-blue-600">JWT</p>
                <p className="text-sm text-gray-500">Token Auth</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Want to know more?
            </h3>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              Contact Me
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
