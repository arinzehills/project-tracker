import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Project Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage and track your projects with ease
        </p>
        <Link
          href="/projects"
          className="inline-block w-[200px] px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
};

export default Home;
