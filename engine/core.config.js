self.__uv$config = {
    prefix: '/s/',
    bare: 'https://uv.holyubofficial.net/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/engine/core.handler.js',
    client: '/engine/core.client.js',
    bundle: '/engine/core.bundle.js',
    config: '/engine/core.config.js',
    sw: '/engine/core.sw.js',
};
