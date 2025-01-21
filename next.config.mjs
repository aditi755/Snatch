/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['scontent.cdninstagram.com', 'res.cloudinary.com', 'instagram.fidr4-1.fna.fbcdn.net',   'instagram.fbho1-1.fna.fbcdn.net',], // Add the Instagram CDN domain here
        unoptimized: true
      },
      experimental: {
        serverActions: {
          bodySizeLimit: '5mb', // Increase the limit to 5 MB
        },
      },
};

export default nextConfig;

//chnage ive done here make the imag tag unoptimized true nextjs bad practice tho :)