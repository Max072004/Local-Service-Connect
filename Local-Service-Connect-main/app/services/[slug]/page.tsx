"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceSidebar } from "@/components/ServiceSidebar";
import { ExpandableServiceDetails } from "@/components/ExpandableServiceDetails";
import { Menu } from "lucide-react";
import axios from "axios";

const services = {
  plumbing: {
    title: "Plumbing",
    src: "/plumbing1.jpg",
    description:
      "Expert plumbing services for all your household needs. Our skilled professionals are equipped to handle everything from minor repairs to major installations.",
  },
  cleaning: {
    title: "Cleaning",
    src: "/cleaning1.jpg",
    description:
      "Professional cleaning services to keep your space spotless. Our team uses eco-friendly products and advanced techniques to ensure a thorough clean.",
  },
  electrician: {
    title: "Electrical",
    src: "/electrical1.jpg",
    description:
      "Skilled electricians for all your electrical requirements. From simple repairs to complex installations, our team ensures safety and efficiency in every job.",
  },
  painting: {
    title: "Painting",
    src: "/painting1.jpg",
    description:
      "Transform your space with our professional painting services. Our expert painters use high-quality materials to deliver stunning results for both interior and exterior projects.",
  },
  carpenter: {
    title: "Carpentry",
    src: "/carpenter1.jpg",
    description:
      "Expert carpentry services for custom furniture and repairs. Our skilled craftsmen bring your vision to life with precision and care.",
  },
  gardening: {
    title: "Gardening",
    src: "/gardening1.jpg",
    description:
      "Professional gardening services to enhance your outdoor space. Our team specializes in landscaping, planting, and maintenance to create a beautiful garden.",
  },
};

export default function ServicePage() {
  const { slug } = useParams() as { slug: string };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const service = services[slug as keyof typeof services];

  useEffect(() => {
    const fetchWorkers = async (): Promise<any> => {
      try {
        console.log("function activated");
        const { data } = await axios.get<any>(
          `https://major-backend-f0nm.onrender.com/api/v1/worker/getcategory/${slug}`
        );
        console.log(data.workers);
        setWorkers(data.workers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchWorkers();
  }, [slug]);

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

  const serviceWithWorkers = { ...service, workers };

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
              href="/"
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
        <main className="p-4 md:p-8  mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-purple-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">
              Service Details
            </h2>
            <ExpandableServiceDetails service={serviceWithWorkers} />
            <div className="mt-8 text-center">
              <Link href="/" className="inline-block">
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
