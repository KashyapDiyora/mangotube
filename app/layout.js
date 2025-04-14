"use client"
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Provider from "./components/ImageKitProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="w-screen h-screen overflow-x-hidden overflow-y-scroll">
        <Provider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}
