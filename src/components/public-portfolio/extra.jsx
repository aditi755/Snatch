 //const pressKitMargin = useTransform(scrollY, [0, 200], ["200px", "80px"])
    // <div className="flex flex-col w-full p-4 rounded-xl" ref={containerRef}>
    //   {/* Sticky Header (appears on scroll) */}
    //   <motion.div
    //     className="fixed top-0 left-0 w-full z-20 py-2 mt-4 px-4 flex items-center rounded-3xl"
    //     style={{
    //       backgroundColor: "rgb(80, 80, 80)",
    //       opacity: headerOpacity,
    //       height: "80px",
    //     }}
    //   >
    //     <div className="container mx-auto flex items-center justify-between ">
    //       <motion.button className="bg-yellow-400 text-black font-medium py-2 px-6 rounded">Send request</motion.button>

    //       <div className="flex items-center">
    //         <h1 className="text-2xl font-serif text-white flex items-center gap-1">
    //           Radhika Ruparel
    //           {/* <BadgeCheck className="w-4 h-4 text-white" /> */}
    //         </h1>
    //       </div>

    //       <div className="flex items-center gap-6">
    //         <div className="text-center text-white">
    //           <p className="text-lg font-medium">30k</p>
    //           <p className="text-xs text-gray-300">avg reach</p>
    //         </div>
    //         <div className="text-center text-white">
    //           <p className="text-lg font-medium">3.4k</p>
    //           <p className="text-xs text-gray-300">followers</p>
    //         </div>
    //         <div className="text-center text-white">
    //           <p className="text-lg font-medium">277</p>
    //           <p className="text-xs text-gray-300">posts</p>
    //         </div>
    //       </div>
    //     </div>
    //   </motion.div>

    //   {/* Main Content */}
    //   <motion.div
    //     className="w-full text-white relative rounded-3xl"
    //     style={{
    //       backgroundColor: headerBg,
    //       height: headerHeight,
    //       position: "sticky",
    //       top: 0,
    //       zIndex: 10,
    //       overflow: "hidden",
    //       visibility: useTransform(scrollY, [150, 151], ["visible", "hidden"]),
    //       opacity: useTransform(scrollY, [0, 150], [1, 0]),
    //     }}
    //   >
    //     <div className="container mx-auto px-4 py-8 flex flex-col items-center">
    //       {/* Name and Location */}
    //       <motion.h1 className="font-serif flex items-center gap-2 font-qimano" style={{ fontSize: nameSize }}>
    //         Radhika Ruparel
    //         {/* <BadgeCheck className="w-6 h-6 text-white" /> */}
    //       </motion.h1>

    //       <motion.p className="text-gray-300 text-sm" style={{ opacity: contentOpacity }}>
    //         @radhikaruparel • Mumbai, India
    //       </motion.p>

    //       {/* Category Tags */}
    //       <motion.div className="flex gap-2 mt-2" style={{ opacity: contentOpacity }}>
    //         <span className="bg-gray-800 text-gray-300 px-3 py-0.5 rounded-full text-xs">Lifestyle</span>
    //         <span className="bg-gray-800 text-gray-300 px-3 py-0.5 rounded-full text-xs">Travel</span>
    //         <span className="bg-gray-800 text-gray-300 px-3 py-0.5 rounded-full text-xs">Dance</span>
    //       </motion.div>
    //     </div>

    //     <div className="container mx-auto px-4 relative">
    //       <motion.div className="flex justify-between" style={{ opacity: contentOpacity }}>
    //         {/* Left Side - Pricing and Services */}
    //         <div className="w-1/3 pt-4">
    //           <div className="mb-4">
    //             <h2 className="text-xl font-medium">Rs 5k - 25k</h2>
    //             <p className="text-xs text-gray-500">Value per content piece</p>
    //           </div>

    //           {/* Services */}
    //           <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
    //             <div className="flex items-center gap-1">
    //               <span>Gifting</span>
    //               {/* <Info className="w-3 h-3 text-gray-400" /> */}
    //             </div>
    //             <div className="flex items-center gap-1">
    //               <span>Sponsorship</span>
    //               {/* <Info className="w-3 h-3 text-gray-400" /> */}
    //             </div>
    //             <div className="flex items-center gap-1">
    //               <span>Gifting</span>
    //               {/* <Info className="w-3 h-3 text-gray-400" /> */}
    //             </div>
    //             <div className="flex items-center gap-1">
    //               <span>Affiliate</span>
    //               {/* <Info className="w-3 h-3 text-gray-400" /> */}
    //             </div>
    //             <div className="flex items-center gap-1">
    //               <span>Hosting</span>
    //               {/* <Info className="w-3 h-3 text-gray-400" /> */}
    //             </div>
    //             <div className="flex items-center gap-1">
    //               <span>Collaboration</span>
    //               {/* <Info className="w-3 h-3 text-gray-400" /> */}
    //             </div>
    //           </div>

    //           {/* CTA Button */}
    //           <button className="bg-yellow-400 text-black font-medium py-2 px-4 rounded mt-6 w-[328px] max-w-[328px]">
    //             Send request
    //           </button>
    //         </div>

    //         {/* Center - Profile Image */}
    //         <motion.div
    //           className="absolute left-1/3 transform -translate-x-1/3 -translate-y-3/4 -top-5 right-10 rounded-xl"
    //           style={{
    //             scale: profileImageScale,
    //             opacity: profileImageOpacity,
    //           }}
    //         >
    //           <div className="relative">
    //             <div className="absolute -top-6 -left-6 bg-black bg-opacity-70 rounded-full p-2 z-10">
    //               {/* heart icon */}
    //             </div>
    //             <div className="relative top-10 translate-x-1/4 rounded-xl overflow-hidden w-64 h-80 z-10">
    //               <Image
    //                 src={formData?.profilePicture}
    //                 alt="Radhika Ruparel"
    //                 width={256}
    //                 height={320}
    //                 className="object-cover  w-80 h-96 z-10"
    //               />
    //               <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-1">
    //                 <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">660</span>
    //                 <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">1251</span>
    //               </div>
    //             </div>
    //           </div>
    //         </motion.div>

    //         {/* Right Side - Stats */}
    //         <div className="w-1/2 flex flex-col items-end mr-20 gap-6 pt-4">
    //           <div className="text-right">
    //             <h2 className="text-3xl font-medium">30k</h2>
    //             <p className="text-xs text-gray-500">avg reach</p>
    //           </div>
    //           <div className="text-right">
    //             <h2 className="text-3xl font-medium">3.4k</h2>
    //             <p className="text-xs text-gray-500">followers</p>
    //           </div>
    //           <div className="text-right">
    //             <h2 className="text-3xl font-medium">277</h2>
    //             <p className="text-xs text-gray-500">posts</p>
    //           </div>
    //         </div>
    //       </motion.div>
    //     </div>
    //   </motion.div>

    //   {/* Press Kit Section */}
    //   <motion.div
    //     className="w-full bg-white"
    //     style={{
    //       marginTop: pressKitMargin,
    //       position: "relative",
    //       zIndex: 5,
    //     }}
    //     ref={pressKitRef}
    //   >
    //     <div className="container mx-auto">
    //       <h2 className="text-5xl font-serif text-blue-600 text-center mb-8 text-electric-blue">Press Kit</h2>

    //       {/* Content Grid */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
    //         {[1, 2, 3, 4].map((item) => (
    //           <div key={item} className="relative rounded-lg overflow-hidden bg-gray-200">
    //             <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
    //               NOBEA
    //             </div>
    //             <div className="absolute top-2 right-2 p-1 bg-white rounded">
    //               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <path
    //                   d="M15 10L20 15V4M4 4H15V15H4V4Z"
    //                   stroke="black"
    //                   strokeWidth="2"
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                 />
    //               </svg>
    //             </div>
    //             <Image
    //               src={`/placeholder.svg?height=240&width=240&text=Video ${item}`}
    //               alt={`Content ${item}`}
    //               width={240}
    //               height={240}
    //               className="w-full aspect-square object-cover"
    //             />
    //             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center">
    //               <svg
    //                 width="12"
    //                 height="12"
    //                 viewBox="0 0 24 24"
    //                 fill="none"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="mr-1"
    //               >
    //                 <path d="M5 3L19 12L5 21V3Z" fill="white" />
    //               </svg>
    //               6.7k
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Additional content to ensure scrolling */}
    //       <div className="mt-20 pb-40">
    //         <h3 className="text-3xl font-serif text-blue-600 mb-4">About Radhika</h3>
    //         <p className="text-gray-700 mb-4">
    //           Lifestyle influencer based in Mumbai, specializing in fashion, travel, and dance content. With over 3.4k
    //           followers and an average reach of 30k, Radhika creates authentic content that resonates with a diverse
    //           audience.
    //         </p>
    //         <p className="text-gray-700">
    //           Available for brand collaborations, sponsorships, and events. Contact for more information about
    //           partnership opportunities.
    //         </p>
    //       </div>
    //     </div>
    //   </motion.div>
    // </div>
