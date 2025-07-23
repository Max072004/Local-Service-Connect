"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useEffect } from "react"

export default function CustomerSubscription() {
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

  const plans = [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: "₹50",
      duration: "per month",
      priceId: "price_1RHlmhP9Fvwn1YOPsLkBfSzM",
      features: [
        "Access to all services",
        "Priority support",
        "Basic features",
      ],
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      price: "₹250",
      duration: "per year",
      priceId: "price_1RHloUP9Fvwn1YOP33jmar6E",
      features: ["All monthly features", "20% discount", "Premium support"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <Button variant="outline" className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 text-lg font-medium transition-all duration-200 shadow-md border-0">
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-indigo-900">Customer Subscription Plans</h1>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
            Choose the perfect plan to enhance your experience and access premium features.
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
              <h2 className="text-2xl font-semibold mb-4 text-indigo-900">{plan.name}</h2>
              <p className="text-4xl font-bold mb-2 text-indigo-800">{plan.price}</p>
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
        <div className="mt-16 bg-white/80 p-6 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-indigo-900">Subscription Benefits</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-indigo-800">Monthly Plan</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                  <span className="text-indigo-700">Flexible month-to-month commitment</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                  <span className="text-indigo-700">Access to all basic service providers</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                  <span className="text-indigo-700">Standard customer support</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2 text-indigo-800">Yearly Plan</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                  <span className="text-indigo-700">Save 20% compared to monthly billing</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                  <span className="text-indigo-700">Priority access to top-rated service providers</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                  <span className="text-indigo-700">24/7 premium customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}