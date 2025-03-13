//@ts-check

 
const { composePlugins, withNx } = require('@nx/next');
const withPWA = require('next-pwa')({  
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  compiler: {
    styledComponents: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  }
};

const plugins = [
  withNx,
  withPWA // Ajout du support PWA 🚀
];

module.exports = composePlugins(...plugins)(nextConfig);
