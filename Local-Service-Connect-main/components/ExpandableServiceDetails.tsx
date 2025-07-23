"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  X,
  PenLine,
  Send,
} from "lucide-react";
import axios from "axios";
import { Router } from "next/router";

interface Worker {
  _id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  rating: number;
  bio?: string;
  availability: boolean;
  location: string;
  profilePic?: {
    public_id: string;
    url: string;
  };
  serviceType: string[];
}

interface ServiceDetails {
  title: string;
  src: string;
  description: string;
  workers: Worker[];
}

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    _id: string;
    name: string;
    profilePic: {
      public_id: string;
      url: string;
    };
  };
};

export function ExpandableServiceDetails({
  service: propService,
}: {
  service: ServiceDetails;
}) {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(false);
  const [workerDetails, setWorkerDetails] = useState<Worker | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  // Add Review Dialog State
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const router = useRouter();
  const fetchWorkerDetails = async (workerId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://major-backend-f0nm.onrender.com/api/v1/worker/getbyid/${workerId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.worker);
      setWorkerDetails(response.data.worker);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 403) {
          // Ensure the path and domain match those used when setting the cookie
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict";

          localStorage.removeItem("user");
          setWorkerDetails(null);
          setSelectedWorker(null);
          toast.error(`${error.response.data.message}`);
          setTimeout(() => {
            router.push("/");
          }, 700);
        } else if (error.response.status === 401) {
          toast.error("Please login to continue");
          setTimeout(() => {
            router.push("/login");
          }, 600);
        }
      } else {
        toast.error("An error occured");
      }
    } finally {
      setLoading(false);
    }
  };

  const getchWorkerReviews = async (workerId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://major-backend-f0nm.onrender.com/api/v1/worker/${workerId}/reviews`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.reviews);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching worker reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedWorker || !newReviewComment.trim()) return;

    setSubmittingReview(true);
    // setLoading(true);
    try {
      const response = await axios.post(
        "https://major-backend-f0nm.onrender.com/api/v1/users/addreview",
        {
          workerId: selectedWorker._id,
          comment: newReviewComment,
          rating: newReviewRating,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Review submitted");
    } catch (error) {
      toast.error("Error submitting review");
    }

    // Reset form and close dialog
    setNewReviewComment("");
    setNewReviewRating(5);
    setReviewDialogOpen(false);
  };

  // Function to render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Function to render interactive star rating selector
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setNewReviewRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= newReviewRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-full mx-auto overflow-hidden">
      <ToastContainer />
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">{propService.title}</h2>
        <p className="text-indigo-100 text-lg max-w-3xl">
          {propService.description}
        </p>
      </div>

      {/* Workers grid */}
      <div className="p-8 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Available Professionals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {propService.workers?.map((worker, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {worker.profilePic?.url ? (
                        <img
                          src={worker.profilePic.url || "/placeholder.svg"}
                          alt={`${worker.name}'s profile`}
                          className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {worker.name.charAt(0)}
                        </div>
                      )}
                      {worker.availability && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {worker.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {worker.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  {renderRating(worker.rating)}
                  <p className="text-sm text-gray-600 mt-1">
                    {worker.experience} years experience
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {worker.serviceType.slice(0, 2).map((service, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200"
                    >
                      {service}
                    </Badge>
                  ))}
                  {worker.serviceType.length > 2 && (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-600 border-gray-200"
                    >
                      +{worker.serviceType.length - 2} more
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full h-10 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => {
                    setSelectedWorker(worker);
                    fetchWorkerDetails(worker._id);
                    getchWorkerReviews(worker._id);
                  }}
                >
                  View Profile
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Worker details modal */}
      <AnimatePresence>
        {selectedWorker && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="sticky top-0 z-10 bg-white p-4 border-b flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={() => setSelectedWorker(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h2 className="text-xl font-semibold text-gray-900">
                  Professional Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto rounded-full p-2 h-8 w-8"
                  onClick={() => setSelectedWorker(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-indigo-600 font-medium mt-4">
                    Loading profile...
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center text-center mb-6">
                        {workerDetails?.profilePic?.url ? (
                          <img
                            src={
                              workerDetails.profilePic.url || "/placeholder.svg"
                            }
                            alt={`${workerDetails.name}'s profile`}
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 mb-4"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {workerDetails?.name.charAt(0)}
                          </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900">
                          {workerDetails?.name}
                        </h2>
                        <div className="mt-2">
                          {renderRating(workerDetails?.rating || 0)}
                        </div>
                        <Badge
                          className={`mt-3 ${
                            workerDetails?.availability
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {workerDetails?.availability
                            ? "Available Now"
                            : "Currently Unavailable"}
                        </Badge>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 mr-3 text-indigo-600" />
                          <span>{workerDetails?.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-4 w-4 mr-3 text-indigo-600" />
                          <span>{workerDetails?.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-4 w-4 mr-3 text-indigo-600" />
                          <span>
                            {workerDetails?.experience} years experience
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2">
                      {!showReviews ? (
                        <>
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              About
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {workerDetails?.bio ||
                                "No bio available. Please contact the professional for more details."}
                            </p>
                          </div>

                          <Separator className="my-6" />

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              Services Offered
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {workerDetails?.serviceType?.length ? (
                                workerDetails.serviceType.map((service, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center text-gray-700"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-600" />
                                    <span>{service}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 italic">
                                  No services listed
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Customer Reviews :
                            </h3>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-700 mr-2">
                                Overall Rating:
                              </span>
                              {renderRating(workerDetails?.rating || 0)}
                            </div>
                          </div>

                          {/* Add Review Button */}
                          <Button
                            onClick={() => setReviewDialogOpen(true)}
                            className="mb-3 p-3 mx-auto w-fit h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            <PenLine className="h-4 w-4 mr-2" />
                            Add Review
                          </Button>

                          <div className="space-y-4">
                            {selectedWorker && reviews?.length > 0 ? (
                              reviews.map((review, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gray-50 rounded-lg p-4"
                                >
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                      {review.customer.profilePic.url ? (
                                        <img
                                          src={
                                            review.customer.profilePic.url ||
                                            "/placeholder.svg" ||
                                            "/placeholder.svg"
                                          }
                                          alt={review.customer.name}
                                          className="w-10 h-10 rounded-full"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                          {review.customer.name.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900">
                                          {review.customer.name}
                                        </h4>
                                        <span className="text-sm text-gray-500">
                                          {new Date(
                                            review.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="mt-1">
                                        {renderRating(review.rating)}
                                      </div>
                                      <p className="mt-2 text-gray-700">
                                        {review.comment}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                                  <Star className="h-8 w-8 text-indigo-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-1">
                                  No Reviews Yet
                                </h4>
                                <p className="text-gray-500">
                                  This professional doesn't have any reviews
                                  yet.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-8">
                        <Button
                          className="w-full h-10 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => setShowReviews(!showReviews)}
                        >
                          {showReviews ? "View Profile" : "View Reviews"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Add Your Review
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <h4 className="text-center font-medium text-gray-700">
                Rate your experience
              </h4>
              {renderRatingSelector()}
            </div>

            <div className="space-y-2">
              <Textarea
                id="review-comment"
                placeholder="Share your experience with this professional..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="min-h-[120px] resize-none rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              className="w-full h-9 rounded-xl p-2 sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className="w-full p-2 h-9 rounded-xl sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!newReviewComment.trim() || submittingReview}
            >
              {submittingReview ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
