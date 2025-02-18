"use client";
import Image from "next/image";
import React from "react";

const Posts = () => {
  return (
    <div className="flex justify-center flex-col w-full items-center">
      <div className="w-[500px] bg-white p-4 rounded-lg shadow-md my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://picsum.photos/id/237/200/200"
              className="w-12 h-12 rounded-full"
              alt="profile"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
        </div>
        <p className="py-4 text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          voluptatibus, quae quidem distinctio, natus, quibusdam corrupti
          voluptates tempore doloremque possimus.
        </p>
        <div className="relative w-full h-[630px]">
          <Image
            src="/post1.jpeg"
            alt="Post Image"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
      <div className="w-[500px] bg-white p-4 rounded-lg shadow-md my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://picsum.photos/id/237/200/200"
              className="w-12 h-12 rounded-full"
              alt="profile"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
        </div>
        <p className="py-4 text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          voluptatibus, quae quidem distinctio, natus, quibusdam corrupti
          voluptates tempore doloremque possimus.
        </p>
        <div className="relative w-full h-[630px]">
          <Image
            src="/post2.jpg"
            alt="Post Image"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
      <div className="w-[500px] bg-white p-4 rounded-lg shadow-md my-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://picsum.photos/id/237/200/200"
              className="w-12 h-12 rounded-full"
              alt="profile"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
        </div>
        <p className="py-4 text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          voluptatibus, quae quidem distinctio, natus, quibusdam corrupti
          voluptates tempore doloremque possimus.
        </p>
        <div className="relative w-full h-[630px]">
          <Image
            src="/post3.jpeg"
            alt="Post Image"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Posts;
