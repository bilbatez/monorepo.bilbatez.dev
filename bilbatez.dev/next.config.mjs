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
            },
            {
                source: '/bofa',
                destination: 'https://about.bankofamerica.com/en/our-company',
                permanent: false
            },
            {
                source: '/shopee',
                destination: 'https://careers.shopee.sg/about',
                permanent: false
            },
            {
                source: '/blibli',
                destination: 'https://about.blibli.com/en/about',
                permanent: false,
            }            
        ]
    }
};

export default nextConfig;
