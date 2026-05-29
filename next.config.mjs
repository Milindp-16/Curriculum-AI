// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
//   images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'res.cloudinary.com',
//                 port: '',
//                 pathname: '/**',
//             },
//         ],
        
//     },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**', // Removed empty port string to satisfy Turbopack validation
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;