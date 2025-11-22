const fs = require('fs');
const path = require('path');

// Define paths
const appDir = path.join(process.cwd(), 'app');
const dashboardDir = path.join(appDir, 'dashboard');
const signInDir = path.join(appDir, 'sign-in', '[[...sign-in]]');
const signUpDir = path.join(appDir, 'sign-up', '[[...sign-up]]');
const middlewarePath = path.join(process.cwd(), 'middleware.ts');

// Ensure app directory exists
if (!fs.existsSync(appDir)) {
    console.error("❌ Error: Could not find 'app' directory. Are you running this in the 'ui' folder?");
    process.exit(1);
}

// 1. Create Dashboard Page
fs.mkdirSync(dashboardDir, { recursive: true });
const dashboardContent = `
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) redirect("/");

  const chats = await prisma.chat.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your History</h1>
      <div className="grid gap-4">
        {chats.length === 0 ? (
          <p className="text-muted-foreground">No history found. Start analyzing!</p>
        ) : (
          chats.map((chat) => (
            <div key={chat.id} className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="font-semibold text-primary max-w-[80%]">
                  <span className="text-muted-foreground mr-2">You:</span>
                  {chat.message}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {chat.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-foreground/90 bg-muted/50 p-4 rounded-md border border-border/50">
                <span className="font-semibold text-brand-primary-600 block mb-1">Histopath AI:</span>
                {chat.response}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(dashboardDir, 'page.tsx'), dashboardContent);
console.log("✅ Created Dashboard page");

// 2. Create Sign-In Page
fs.mkdirSync(signInDir, { recursive: true });
const signInContent = `
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignIn appearance={{ elements: { rootBox: "mx-auto", card: "shadow-lg" } }} />
    </div>
  );
}
`;
fs.writeFileSync(path.join(signInDir, 'page.tsx'), signInContent);
console.log("✅ Created Sign-In page");

// 3. Create Sign-Up Page
fs.mkdirSync(signUpDir, { recursive: true });
const signUpContent = `
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignUp appearance={{ elements: { rootBox: "mx-auto", card: "shadow-lg" } }} />
    </div>
  );
}
`;
fs.writeFileSync(path.join(signUpDir, 'page.tsx'), signUpContent);
console.log("✅ Created Sign-Up page");

// 4. Create Middleware
const middlewareContent = `
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/chat(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
`;
fs.writeFileSync(middlewarePath, middlewareContent);
console.log("✅ Created Middleware");

console.log("\n🎉 All files created successfully! Restart your server now.");