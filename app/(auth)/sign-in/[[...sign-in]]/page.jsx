import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import Logo from "../../../_components/Logo";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#121212] px-4 py-10 flex flex-col items-center justify-center">
      <div className="mb-8">
        <Logo size="large" />
      </div>
      
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-[#181818] shadow-2xl p-8 border border-white/5">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Log in to Curriculum AI
          </h2>
        </div>

        {/* Clerk Sign In */}
        <div className="bg-transparent">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: '#1DB954',
                colorText: 'white',
                colorTextSecondary: '#a1a1aa',
                colorInputText: 'white',
                colorBackground: 'transparent',
              },
              elements: {
                card: "shadow-none border-0 bg-transparent p-0",
                cardBox: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",

                socialButtonsBlockButton:
                  "border border-white/20 bg-transparent hover:bg-white/5 transition-all duration-200",
                socialButtonsBlockButtonText: "!text-white font-medium",

                formFieldInput:
                  "border border-white/20 bg-[#121212] !text-white focus:border-[#1DB954] focus:ring-[#1DB954]",
                  
                formFieldLabel: "!text-white font-medium",
                formFieldLabelRow: "!text-white",

                formButtonPrimary:
                  "bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold transition-all duration-200 rounded-full py-3",

                footerActionLink:
                  "!text-[#1DB954] hover:!text-[#1ed760]",
                footerActionText: "!text-[#a1a1aa]",
                
                dividerText: "!text-[#a1a1aa]",
                dividerLine: "bg-white/10",
                
                identityPreviewText: "!text-white",
                identityPreviewEditButtonIcon: "!text-[#1DB954]",
              },
            }}
          />
        </div>
      </div>
      
      <p className="mt-8 text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-bold text-white hover:text-[#1DB954] hover:underline"
        >
          Sign up for Curriculum AI
        </Link>
      </p>
    </main>
  );
}