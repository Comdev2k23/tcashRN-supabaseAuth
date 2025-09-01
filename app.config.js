import 'dotenv/config';

export default {
  expo: {
    name: "tcash",
    slug: "tcash",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/tcash.png",
    scheme: "tcashsupabaseauth",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: { supportsTablet: true },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/tcash.png",
        backgroundColor: "#E8FFD7"
      },
      edgeToEdgeEnabled: true,
      package: "com.denjibreak.tcash"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/tcash.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/tcash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: { typedRoutes: true },
    extra: {
      router: {},
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: { projectId: "74e389ab-c3a0-46ca-9257-2a11170b5c08" }
    },
    owner: "denjibreak"
  }
};
