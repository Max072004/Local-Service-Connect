"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceSidebar } from "@/components/ServiceSidebar";
import { ExpandableServiceDetails } from "@/components/ExpandableServiceDetails";
import { Menu } from "lucide-react";

const services = {
  plumbing: {
    title: "Plumbing",
  },
  cleaning: {
    title: "Cleaning",
  },
  electrician: {
    title: "Electrical",
  },
  painting: {
    title: "Painting",
  },
  carpenter: {
    title: "Carpentry",
  },
  gardening: {
    title: "Gardening",
  },
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const service = services[params.slug as keyof typeof services];

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <ServiceSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="transition-all duration-300 ease-in-out">
        <header className="sticky top-0 z-40 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 p-6 flex justify-between items-center shadow-lg border-b border-white/30 transition-all duration-300 hover:shadow-xl">
          {isMobile ? (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:text-purple-200 focus:outline-none transition-colors duration-300"
            >
              <Menu size={24} />
            </button>
          ) : (
            <Link
              href="/services"
              className="text-white hover:text-purple-200 transition-colors duration-300"
            >
              <Button variant="ghost" className="text-lg font-semibold">
                ← All Services
              </Button>
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {service.title}
          </h1>
          <div className="w-[100px]" />
        </header>
        <main className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-purple-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">
              Service Details
            </h2>
            <ExpandableServiceDetails service={service} />
            <div className="mt-8 text-center">
              <Link href="/services" className="inline-block">
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md px-8 py-6 text-lg font-semibold rounded-xl hover:scale-105 hover:shadow-lg">
                  ← Back to Services
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
