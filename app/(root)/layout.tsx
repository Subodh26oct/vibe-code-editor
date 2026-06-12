import {Footer} from "@/modules/home/footer";
import { Header } from "@/modules/home/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "VibeCode - Editor ",
    default: "Code Editor For VibeCoders - VibeCode",
  },
};
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Background Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(228,228,231,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,228,231,0.6)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.6)_1px,transparent_1px)]"
      />
      {/* Radial Gradient Mask for Background Grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
      
      <Header />
      <main className="relative flex-1 flex flex-col z-10 w-full">{children}</main>
      <Footer />
    </div>
  );
}
