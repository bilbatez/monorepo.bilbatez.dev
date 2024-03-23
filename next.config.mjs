/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/github',
                destination: 'https://github.com/bilbatez',
                permanent: false
            },
            {
                source: '/linkedin',
                destination: 'https://www.linkedin.com/in/albertjt/',
                permanent: false
            }
        ]
    }
};

export default nextConfig;
