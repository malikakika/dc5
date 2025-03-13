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
  // 🚨 Enlève la propriété `pwa` d'ici, car elle est déjà configurée plus haut.
};

const plugins = [
  withNx,
  withPWA // ✅ Ajout correct du support PWA 🚀
];

module.exports = composePlugins(...plugins)(nextConfig);
