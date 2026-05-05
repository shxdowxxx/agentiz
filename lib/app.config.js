self.__app$config = {
    prefix: '/s/',
    bare: '/b/',
    encodeUrl: AppCodec.xor.encode,
    decodeUrl: AppCodec.xor.decode,
    handler: '/lib/app.handler.js',
    client: '/lib/app.client.js',
    bundle: '/lib/app.bundle.js',
    config: '/lib/app.config.js',
    sw: '/lib/app.sw.js',
};
