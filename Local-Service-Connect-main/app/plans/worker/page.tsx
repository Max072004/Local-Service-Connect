"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Briefcase, Clock, Award } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function WorkerSubscription() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const router = useRouter();
  const handlePlanSelection = async (priceId: string) => {
    try {
      const response = await axios.post(
        "https://major-backend-f0nm.onrender.com/api/v1/payment/create-subscription-session",
        { priceId },
        { withCredentials: true }
      );

      if (response.data?.checkout_url) {
        router.push(response.data.checkout_url);
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong while processing your subscription.");
    }
  };

  const plans = [
    {
      id: "six-month",
      name: "6-Month Plan",
      price: "₹100",
      duration: "for 6 months",
      priceId: "price_1RHjGHP9Fvwn1YOPOl6Bp3RS",
      features: ["Access to all jobs", "Basic support", "Standard features"],
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      price: "₹150",
      duration: "per year",
      priceId: "price_1RHjJeP9Fvwn1YOPyIwvKL08",
      features: [
        "All 6-month features",
        "Priority job access",
        "Premium support",
      ],
    },
  ];
  const getCurrentUser = async () => {
    const response = await axios.get(
      "https://major-backend-f0nm.onrender.com/api/v1/users/getcurrentuser",
      { withCredentials: true }
    );
    console.log(response.data.user);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  };
  useEffect(() => {
    getCurrentUser();
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log(parsedUser?.subscription?.status); // ✅ log status safely

      const { role, subscription } = parsedUser;
      if (subscription?.status === true) {
        router.push("/");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 text-lg font-medium transition-all duration-200 shadow-md border-0"
            >
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-indigo-900">
            Worker Subscription Plans
          </h1>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Boost your career with our subscription plans designed for service
            professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                selectedPlan === plan.id
                  ? "border-2 border-purple-500 bg-white"
                  : "border border-purple-200 bg-white/90"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4 text-indigo-900">
                {plan.name}
              </h2>
              <p className="text-4xl font-bold mb-2 text-indigo-800">
                {plan.price}
              </p>
              <p className="text-indigo-600 mb-6">{plan.duration}</p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-indigo-700">
                    <Check className="h-5 w-5 mr-2 text-purple-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  setSelectedPlan(plan.id);
                  handlePlanSelection(plan.priceId);
                }}
                className={`w-full py-6 rounded-lg text-lg font-semibold ${
                  selectedPlan === plan.id
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
                    : "bg-purple-100 text-indigo-800 hover:bg-purple-200"
                }`}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center text-indigo-900">
            Why Subscribe as a Worker?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-center text-indigo-800">
                More Job Opportunities
              </h4>
              <p className="text-indigo-700 text-center">
                Get access to a wider range of job opportunities and connect
                with more potential clients.
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-center text-indigo-800">
                Priority Listings
              </h4>
              <p className="text-indigo-700 text-center">
                Your profile appears higher in search results, increasing your
                visibility to potential clients.
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-center text-indigo-800">
                Professional Badge
              </h4>
              <p className="text-indigo-700 text-center">
                Earn a verified professional badge that builds trust with
                potential clients.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white/80 p-6 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-indigo-900">
            Plan Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 text-indigo-900">Feature</th>
                  <th className="text-center p-3 text-indigo-900">
                    6-Month Plan
                  </th>
                  <th className="text-center p-3 text-indigo-900">
                    Yearly Plan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-purple-200">
                  <td className="p-3 text-indigo-800">Job Access</td>
                  <td className="text-center p-3 text-indigo-700">Standard</td>
                  <td className="text-center p-3 text-indigo-700">Premium</td>
                </tr>
                <tr className="border-t border-purple-200">
                  <td className="p-3 text-indigo-800">Profile Visibility</td>
                  <td className="text-center p-3 text-indigo-700">Enhanced</td>
                  <td className="text-center p-3 text-indigo-700">Maximum</td>
                </tr>
                <tr className="border-t border-purple-200">
                  <td className="p-3 text-indigo-800">Customer Insights</td>
                  <td className="text-center p-3 text-indigo-700">Basic</td>
                  <td className="text-center p-3 text-indigo-700">Advanced</td>
                </tr>
                <tr className="border-t border-purple-200">
                  <td className="p-3 text-indigo-800">Support Level</td>
                  <td className="text-center p-3 text-indigo-700">Standard</td>
                  <td className="text-center p-3 text-indigo-700">Priority</td>
                </tr>
                <tr className="border-t border-purple-200">
                  <td className="p-3 text-indigo-800">Monthly Cost</td>
                  <td className="text-center p-3 text-indigo-700">₹16.67</td>
                  <td className="text-center p-3 text-indigo-700">₹12.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
