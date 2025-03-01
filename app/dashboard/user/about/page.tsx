import React from "react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Xog kusaab San Mashruucan
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
              Salaan, Waxan Ahay Sadaq Elmi Abdulle
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Waxaan ahay horumariye full-stack ah oo jecel abuurista websaydhyo
              wax ku ool ah. Mashruucan waxa uu adeegsadaa Next.js iyo Tailwind
              CSS, isaga oo diiradda saaraya khibrad casri ah oo bulsho ah oo
              leh is-dhexgal waqtiga-dhabta ah.
            </p>
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Astaamaha Isticmaalaha
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Samee oo la wadaag qoraallo leh sawirro
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Ka faallood qoraallada oo la falgal dadka kale
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              La falgal nuxurka adigoo isticmaalaya like
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Cusboonaysii profile-kaaga iyo sawirkaaga
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Daawo Sabuurad kuu gaar ah
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">✔</span>
              Nidaam xasilan oo xagga gelitaanka ah
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Astaamaha Maamulaha
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Maamul dhammaan xisaabaadka isticmaale
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              La soco oo hagaajiyo nuxurka iyo faallooyinka
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Hel falanqayn qoto dheer
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Maamul habeynta nidaamka
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Daawo diiwaan falanqeyn faahfaahsan
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">⚙</span>
              Dashboard u gaar ah maamulaha
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Tiknoolajiyada la adeegsaday
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
            Ma rabtaa inaad wax badan ogaato?
          </h3>
          <Link
            href="https://wa.me/252619316187"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            La soo Xiriir WhatsApp
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;
