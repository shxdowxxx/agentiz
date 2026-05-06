self.__app$config = {
    prefix: '/s/',
    bare: '/b/',
    encodeUrl: AppCodec.xor.encode,
    decodeUrl: AppCodec.xor.decode,
    handler: '/engine/core.handler.js',
    client: '/engine/core.client.js',
    bundle: '/engine/core.bundle.js',
    config: '/engine/core.config.js',
    sw: '/engine/core.sw.js',
};
