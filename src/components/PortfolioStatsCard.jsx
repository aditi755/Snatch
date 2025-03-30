"use client";
import React, { useEffect, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

const PortfolioStatsCard = ({ flexDirection }) => {
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    reach: 0,
  });

  const fetchInstagramData = async () => {
    try {
      const response = await fetch("/api/instagram-stats");
      if (response.ok) {
        const data = await response.json();
        setStats({
          posts: data.media_count,
          followers: data.followers_count,
          reach: data.reach,
        });
      } else {
        console.error("Failed to fetch Instagram data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInstagramData();
  }, []);

  return (
    <motion.div
      className="w-64 h-48 flex text-white rounded-lg p-4 z-50 gap-4"
      style={{
        flexDirection
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl">{stats.posts}</h2>
        <p className="text-sm">Posts</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl">{stats.followers}</h2>
        <p className="text-sm">Followers</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl">{stats.reach}</h2>
        <p className="text-sm">Reach</p>
      </div>
    </motion.div>
  );
};

export default PortfolioStatsCard;