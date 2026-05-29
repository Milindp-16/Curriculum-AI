import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, Show } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Curriculum AI — AI-Powered Course Builder",
  description: "Generate comprehensive learning courses with AI. Create structured curricula, detailed chapter content, and auto-embedded YouTube tutorials in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#1DB954',
              colorBackground: '#121212',
              colorInputBackground: '#181818',
              colorText: '#ffffff',
              borderRadius: '0.5rem',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
