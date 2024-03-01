'use client';
// pages/index.js
import React, { useState, useEffect } from "react";

const IndexPage = () => {
  const [newsFeed, setNewsFeed] = useState([]);

  useEffect(() => {
    // Fetch news feed data when the component mounts
    generateRandomNews();
  }, []);

  const generateRandomNews = () => {
    const titles = [
      "Exciting Matchup Set for Championship Game",
      "New Training Techniques Revolutionize Athlete Performance",
      "Rising Star Leads Team to Victory",
      "Injury Update: Star Player Expected to Return Next Week",
      "Breaking: Major Upset in Latest Tournament Results"
    ];

    const sources = [
      "sportswebsite.com",
      "sportingnews.com",
      "espn.com",
      "bleacherreport.com",
      "sportsillustrated.com"
    ];

    const getRandomDate = () => {
      const start = new Date(2024, 0, 1);
      const end = new Date();
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    const randomNews = titles.map((title, index) => ({
      id: index + 1,
      title,
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum tortor nec purus lobortis, in suscipit eros aliquet.",
      source: sources[Math.floor(Math.random() * sources.length)],
      date: getRandomDate().toDateString(),
      link: "https://example.com" // Replace with actual link if available
    }));

    setNewsFeed(randomNews);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8">Sports News Feed</h1>
      <div>
        {newsFeed.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md mb-6 p-6">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-700 mb-4">{item.summary}</p>
            <div className="flex justify-between items-center text-gray-600">
              <p>{item.source}</p>
              <p>{item.date}</p>
            </div>
            <a href={item.link} className="text-blue-500 hover:underline mt-2 inline-block">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
