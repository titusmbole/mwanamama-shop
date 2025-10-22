import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Loader2, ArrowLeft, Shield } from "lucide-react";
import { BASE_URL } from "../utils/helpers";
import { useCart } from "../contexts/CartContext";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentCompletion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { admin, adminToken } = useAdminAuth();

  const [checkoutData, setCheckoutData] = useState(location.state);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [pulling, setPulling] = useState(true);
  const [loading, setIsLoading ] = useState(true)

  useEffect(() => {
    // Try to load data from localStorage first
    const storedData = localStorage.getItem('paymentCompletionData');

    if (storedData) {
      try {
        setPulling(false)
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.checkoutRequestId && parsedData.transaction) {
          setCheckoutData(parsedData);
          // Clear the localStorage after loading
          localStorage.removeItem('paymentCompletionData');
        } else {
          // navigate('/');
          return;
        }
        console.log(parsedData)
      } catch (error) {
        setPulling(false)
        // console.error("Error parsing stored data:", error);
        // navigate('/');
        return;
      }
    } else if (!checkoutData || !checkoutData.checkoutRequestId || !checkoutData.transaction) {
      // toast.error("Missing payment data. Redirecting to checkout.");
      // navigate('/');
      return;
    }

    submitOrder();
  }, [checkoutData, navigate]);

  const submitOrder = async () => {
    try {
      const { orderSummary, formData, checkoutRequestId, transaction } = checkoutData;

      // Create order payload
      const orderPayload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || "",
          phoneNumber: formData.phoneNumber,
          billingAddress: formData.billingAddress,
          billingCity: formData.billingCity,
          billingPostalCode: formData.billingPostalCode || "",
        },
        items: orderSummary.items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          description: item.description,
        })),
        transaction: {
          checkoutRequestId: checkoutRequestId,
          merchantRequestId: transaction.merchantRequestId,
          receiptNumber: transaction.mpesaReceiptNumber,
          amount: transaction.amount,
          phoneNumber: transaction.phoneNumber,
          transactionDate: transaction.transactionDate,
          status: transaction.status,
        },
        branchId: formData.branchId,
        creditOfficerId: formData.creditOfficerId,
        total: orderSummary.total,
        paymentMethod: "M-Pesa",
        transactionId: transaction.id
      };

      console.log("Submitting order to API:", JSON.stringify(orderPayload, null, 2));

      // Submit order to API
      const response = await axios.post(`${BASE_URL}/individual/customers/purchase`, orderPayload, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      console.log("Order submission response:", response.data);

      // Clear cart and show success
      clearCart();
      setSubmissionSuccess({
        message: `Order completed successfully! Payment of KSh ${transaction.amount} received. Receipt: ${transaction.mpesaReceiptNumber}`,
        transaction,
        orderSummary
      });

      toast.success(`${response.data.message} 🎉`, {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => window.location.href = "/", 1000)

    } catch (error) {
      console.error("Error submitting order:", error);

      if (axios.isAxiosError(error)) {
        const apiErrorMessage = error.response?.data?.message ||
                               error.response?.data?.error ||
                               "Failed to complete order. Please contact support.";

        setSubmissionError({
          message: apiErrorMessage,
          details: error.response?.data
        });

        // toast.error(apiErrorMessage, {
        //   position: "top-center",
        //   autoClose: 5000,
        // });
      } else {
        setSubmissionError({
          message: "An unexpected error occurred while completing your order.",
          details: error.message
        });

        // toast.error("An unexpected error occurred. Please contact support.", {
        //   position: "top-center",
        //   autoClose: 5000,
        // });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleNewOrder = () => {
    navigate('/checkout');
  };

  if (isSubmitting || pulling ) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <Loader2 className="text-success" size={64} style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                  <h3 className="fw-bold text-success mb-3">Processing Your Order</h3>
                  <div className="alert alert-success">
                    <strong>Submitting order ...</strong><br/>
                    Please wait while we complete your order processing.
                  </div>
                  <small className="text-muted">
                    This may take a few seconds as we securely process your payment details.
                  </small>
                </div>

                <div className="d-flex gap-3 justify-content-center">
                      <button
                        onClick={handleNewOrder}
                        className="btn btn-success px-4"
                      >
                       Cancel
                      </button>
                    </div>



              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-vh-100 bg-light py-4">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-8">
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">Payment Complete</h1>
                <p className="text-muted fs-5">Your order has been processed</p>
              </div>

             
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-5 text-center">
                    <div className="mb-4">
                      <CheckCircle className="text-success" size={64} />
                    </div>
                    <h3 className="fw-bold text-success mb-3">Order Completed Successfully!</h3>
                    <div className="alert alert-success mb-4">
                      {/* <strong>{submissionSuccess.message}</strong> */}
                    </div>

                    {/* <div className="row justify-content-center mb-4">
                      <div className="col-12 col-md-8">
                        <div className="text-start">
                          <h5 className="fw-semibold mb-3">Order Details</h5>
                          <div className="border rounded-3 p-3 mb-3">
                            <div className="row text-sm">
                              <div className="col-6">
                                <small className="text-muted">Receipt Number:</small>
                                <div className="fw-medium">{submissionSuccess.transaction.mpesaReceiptNumber}</div>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Transaction Date:</small>
                                <div className="fw-medium">
                                  {new Date(submissionSuccess.transaction.transactionDate).toLocaleDateString()} {new Date(submissionSuccess.transaction.transactionDate).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <h6 className="fw-medium mb-3">Purchased Items</h6>
                          {submissionSuccess.orderSummary.items.map((item, index) => (
                            <div key={index} className="border rounded-3 p-3 mb-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <span className="fw-medium">{item.name}</span>
                                  <small className="text-muted d-block">Qty: {item.quantity}</small>
                                </div>
                                <div className="text-end">
                                  <div className="fw-semibold text-primary">
                                    KSh {(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="border rounded-3 p-3 mt-4">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold">Total Amount</span>
                              <span className="fw-bold text-success fs-5">
                                KSh {submissionSuccess.orderSummary.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    <div className="alert alert-success d-flex align-items-center justify-content-center mb-4" role="alert">
                      <Shield className="me-2 text-success" size={20} />
                      <div className="small">Your order and payment details are secure</div>
                    </div>

                    <div className="d-flex gap-3 justify-content-center">
                      <button
                        onClick={handleBackToDashboard}
                        className="btn btn-success px-4"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={handleNewOrder}
                        className="btn btn-outline-primary px-4"
                      >
                        Create New Order
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default PaymentCompletion;
