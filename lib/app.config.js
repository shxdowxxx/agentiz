self.__uv$config = {
    prefix: '/s/',
    bare: '/b/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/lib/app.handler.js',
    client: '/lib/app.client.js',
    bundle: '/lib/app.bundle.js',
    config: '/lib/app.config.js',
    sw: '/lib/app.sw.js',
};
