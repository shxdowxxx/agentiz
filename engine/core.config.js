self.__uv$config = {
    prefix: '/s/',
    bare: 'https://balanced-amazement-production-c715.up.railway.app/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/engine/core.handler.js',
    client: '/engine/core.client.js',
    bundle: '/engine/core.bundle.js',
    config: '/engine/core.config.js',
    sw: '/engine/core.sw.js',
};
