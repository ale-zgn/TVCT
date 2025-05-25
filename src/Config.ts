let Config = {
    EXPO_PUBLIC_API_ROOT: '',
    EXPO_PUBLIC_API_WORDPRESS: '',
    EXPO_PUBLIC_S3_BUCKET: '',
}

if (process.env.EXPO_PUBLIC_API_ROOT) {
    Config.EXPO_PUBLIC_API_ROOT = process.env.EXPO_PUBLIC_API_ROOT
}

if (process.env.EXPO_PUBLIC_S3_BUCKET) {
    Config.EXPO_PUBLIC_S3_BUCKET = process.env.EXPO_PUBLIC_S3_BUCKET
}

if (process.env.EXPO_PUBLIC_API_WORDPRESS) {
    Config.EXPO_PUBLIC_API_WORDPRESS = process.env.EXPO_PUBLIC_API_WORDPRESS
}

export default Config
