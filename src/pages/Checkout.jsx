import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Truck, ShoppingCart, Lock, Shield, CheckCircle, User, X } from "lucide-react";
import { useCart } from "../contexts/CartContext";
// import { useAdminAuth } from "../contexts/AdminAuthContext";
import { useAuth } from "../contexts/AuthContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE, BASE_URL, getMpesaStatusMessage } from "../utils/helpers";

const ErrorModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog-custom modal-sm modal-dialog-centered">
        <div className="modal-content-custom rounded-4 shadow-lg border-0">
          <div className="modal-header-custom p-4 border-bottom-0 position-relative">
            <h5 className="modal-title fw-bold text-danger">Order Failed</h5>
            <button type="button" className="btn-close-custom" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body-custom p-4 text-center">
            <p className="fw-semibold mb-2">{message}</p>
            <p className="text-muted small">Please adjust the items in your cart to proceed.</p>
          </div>
          <div className="modal-footer d-flex justify-content-center border-top-0">
            <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MpesaModal = ({
  amount,
  phoneNumber,
  onPhoneNumberChange,
  onClose,
  onSubmit,
          isProcessing,
          processingTransaction = false,
          transactionSuccess = null,
          transactionError = null,
          onCompleteOrder = null
}) => {
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog-custom modal-dialog-centered">
        <div className="modal-content-custom rounded-4 shadow-lg border-0">
          <div className="modal-header-custom p-4 border-bottom-0 position-relative">
            <h5 className="modal-title fw-bold text-success">
              <span className="me-2">📱</span>
              M-Pesa Payment
            </h5>
            <button
              type="button"
              className="btn-close-custom"
              onClick={onClose}
              disabled={processingTransaction}
            >
              <X size={24} />
            </button>
          </div>
          <div className="modal-body-custom p-4">
            {transactionSuccess ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-success">
                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                  </div>
                </div>
                <h4 className="fw-bold text-success mb-3">Payment Completed Successfully!</h4>
                <div className="alert alert-success" role="alert">
                  <strong>{transactionSuccess.message}</strong>
                </div>
                <small className="text-muted">
                  Your cart has been cleared and you can now close this window.
                </small>
              </div>
            ) : transactionError ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-danger">
                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                    </svg>
                  </div>
                </div>
                <h4 className="fw-bold text-danger mb-3">Payment Failed</h4>
                <div className="alert alert-danger" role="alert">
                  <strong>{transactionError.message}</strong>
                </div>
                <small className="text-muted">
                  You can close this window and try again or contact support.
                </small>
              </div>
            ) : processingTransaction ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Processing...</span>
                  </div>
                </div>
                <h4 className="fw-bold text-success mb-3">Processing Payment</h4>
                <div className="alert alert-success" role="alert">
                  <strong>M-Pesa STK Push sent successfully!</strong><br/>
                  Please check your phone and enter your M-Pesa PIN to complete the payment.
                </div>
                <small className="text-muted">
                  Processing your payment, please wait...
                </small>
              </div>
            ) : transactionSuccess ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-success">
                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                  </div>
                </div>
                <h4 className="fw-bold text-success mb-3">Payment Completed Successfully!</h4>
                <div className="alert alert-success" role="alert">
                  <strong>{transactionSuccess.message}</strong>
                </div>
                <small className="text-muted mb-4">
                  Click the button below to complete your order.
                </small>
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={onCompleteOrder}
                  >
                    ✅ Complete Order
                  </button>
                </div>
              </div>
            ) : transactionError ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="text-danger">
                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                    </svg>
                  </div>
                </div>
                <h4 className="fw-bold text-danger mb-3">Payment Failed</h4>
                <div className="alert alert-danger" role="alert">
                  <strong>{transactionError.message}</strong>
                </div>
                <small className="text-muted">
                  You can close this window and try again or contact support.
                </small>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="text-muted mb-2">Amount to Pay</div>
                    <div className="fs-2 fw-bold text-success">KSh {amount}</div>
                  </div>
                  <div className="alert alert-info text-start">
                    <small>
                      <strong>M-Pesa STK Push Instructions:</strong><br/>
                      • Enter your M-Pesa registered phone number<br/>
                      • You will receive an M-Pesa prompt on your phone<br/>
                      • Enter your M-Pesa PIN to complete payment<br/>
                      • Payment will be processed instantly
                    </small>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="+254 712 345 678"
                      value={phoneNumber}
                      onChange={(e) => onPhoneNumberChange(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                    <small className="text-muted">Must be your M-Pesa registered number</small>
                  </div>
                </div>
              </>
            )}
          </div>

          {!processingTransaction && (
            <div className="modal-footer d-flex justify-content-between border-top-0">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={isProcessing || !phoneNumber.trim()}
                onClick={onSubmit}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          )}

          {processingTransaction && (
            <div className="modal-footer d-flex justify-content-center border-top-0">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = ({ children }) => (
  <div className="card mb-4 border-0 shadow-sm">
    <div className="card-body p-4">
      {children}
    </div>
  </div>
);

const SkeletonLine = ({ width = "100%", height = "20px", className = "mb-3" }) => (
  <div 
    className={`skeleton ${className}`}
    style={{ width, height }}
  />
);

const SkeletonInput = ({ className = "mb-3" }) => (
  <div className={className}>
    <div className="skeleton mb-2" style={{ width: "30%", height: "16px" }} />
    <div className="skeleton" style={{ width: "100%", height: "48px" }} />
  </div>
);

const CheckoutSkeleton = () => (
  <div className="min-vh-100 bg-light py-4">
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="text-center mb-5">
            <div className="skeleton mx-auto mb-3" style={{ width: "400px", height: "48px" }} />
            <div className="skeleton mx-auto" style={{ width: "200px", height: "24px" }} />
          </div>
          <div className="row g-4">
            <div className="col-lg-8">
              <SkeletonCard>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="skeleton rounded-circle me-2" style={{ width: '32px', height: '32px' }} />
                    <div className="skeleton" style={{ width: "40px", height: "16px" }} />
                  </div>
                  <div className="flex-fill mx-3" style={{ height: '1px', backgroundColor: '#dee2e6' }}></div>
                  <div className="d-flex align-items-center">
                    <div className="skeleton rounded-circle me-2" style={{ width: '32px', height: '32px' }} />
                    <div className="skeleton" style={{ width: "60px", height: "16px" }} />
                  </div>
                  <div className="flex-fill mx-3" style={{ height: '1px', backgroundColor: '#dee2e6' }}></div>
                  <div className="d-flex align-items-center">
                    <div className="skeleton rounded-circle me-2" style={{ width: '32px', height: '32px' }} />
                    <div className="skeleton" style={{ width: "80px", height: "16px" }} />
                  </div>
                </div>
              </SkeletonCard>
              <SkeletonCard>
                <div className="d-flex align-items-center mb-4">
                  <div className="skeleton rounded-3 me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <div className="skeleton mb-1" style={{ width: "180px", height: "24px" }} />
                    <div className="skeleton" style={{ width: "140px", height: "16px" }} />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-12">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                </div>
              </SkeletonCard>
              <SkeletonCard>
                <div className="d-flex align-items-center mb-4">
                  <div className="skeleton rounded-3 me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <div className="skeleton mb-1" style={{ width: "160px", height: "24px" }} />
                    <div className="skeleton" style={{ width: "120px", height: "16px" }} />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                  <div className="col-md-6">
                    <SkeletonInput />
                  </div>
                </div>
              </SkeletonCard>
              <SkeletonCard>
                <div className="d-flex align-items-center mb-4">
                  <div className="skeleton rounded-3 p-2 me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <div className="skeleton mb-1" style={{ width: "140px", height: "24px" }} />
                    <div className="skeleton" style={{ width: "160px", height: "16px" }} />
                  </div>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="border rounded-3 p-3 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="skeleton me-3 rounded" style={{ width: '80px', height: '80px' }} />
                      <div className="flex-grow-1">
                        <div className="skeleton mb-2" style={{ width: "70%", height: "20px" }} />
                        <div className="skeleton mb-2" style={{ width: "90%", height: "16px" }} />
                        <div className="row">
                          <div className="col-6">
                            <div className="skeleton mb-1" style={{ width: "50%", height: "14px" }} />
                            <div className="skeleton" style={{ width: "30%", height: "18px" }} />
                          </div>
                          <div className="col-6">
                            <div className="skeleton mb-1 ms-auto" style={{ width: "40%", height: "14px" }} />
                            <div className="skeleton ms-auto" style={{ width: "60%", height: "18px" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="skeleton" style={{ width: "100%", height: "50px" }} />
              </SkeletonCard>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="skeleton rounded-3 p-2 me-3" style={{ width: '48px', height: '48px' }} />
                    <div className="skeleton" style={{ width: "140px", height: "24px" }} />
                  </div>
                  <div className="mb-4">
                    <div className="skeleton rounded-3" style={{ width: "100%", height: "60px" }} />
                  </div>
                  <div className="mb-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="d-flex justify-content-between mb-2">
                        <div className="skeleton" style={{ width: "60px", height: "16px" }} />
                        <div className="skeleton" style={{ width: "80px", height: "16px" }} />
                      </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="skeleton" style={{ width: "50px", height: "24px" }} />
                      <div className="skeleton" style={{ width: "100px", height: "32px" }} />
                    </div>
                  </div>
                  <div className="skeleton w-100" style={{ height: "56px" }} />
                  <div className="skeleton mx-auto mt-3" style={{ width: "80%", height: "16px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>{`
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
      }
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .bg-light {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
      }
    `}</style>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  // const { admin, useAuth } = useAdminAuth();
  const { user } = useAuth();
  const [checkoutType, setCheckoutType] = useState("group");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [formData, setFormData] = useState({
    clientId: "",
    firstName: "",
    lastName: "",
    branchId: "",
    branchName: "",
    phoneNumber: "",
    location: "",
    groupId: "",
    groupName: "",
    creditOfficerId: "",
    creditOfficerName: "",
    // Individual client fields
    email: "",
    address: "",
    city: "",
    postalCode: "",
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
  });
  const [groups, setGroups] = useState([]);
  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loanLimitError, setLoanLimitError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("");
  const [processingTransaction, setProcessingTransaction] = useState(false);

  // Auto-populate M-Pesa phone number from customer details
  useEffect(() => {
    if (showMpesaModal && formData.phoneNumber && checkoutType === "individual") {
      setMpesaPhoneNumber(formData.phoneNumber);
    }
  }, [showMpesaModal, formData.phoneNumber, checkoutType]);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [transactionSuccess, setTransactionSuccess] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [pollingIntervalId, setPollingIntervalId] = useState(null);


  const orderSummary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return {
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        description: item.description,
        image: item.image,
      })),
      subtotal,
      shipping: 0,
      tax: 0,
      total: subtotal,
    };
  }, [cartItems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try both tokens
        const token = localStorage.getItem("userToken") || localStorage.getItem("adminToken");
        if (!token) throw new Error("Missing token");
  
        const [groupsRes, branchesRes] = await Promise.all([
          axios.get(`${BASE_URL}/groups/unpaginated`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/branches/unpaginated`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        setGroups(groupsRes.data?.content || groupsRes.data || []);
        setBranches(branchesRes.data?.content || branchesRes.data || []);
      } catch (error) {
        console.error("Error fetching groups/branches:", error);
        toast.error("Failed to load groups or branches.");
      } finally {
        setIsLoadingData(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupSelect = async (groupId) => {
    setSelectedGroupId(groupId);
    if (!groupId || groupId === "") {
      setFormData((prev) => ({
        ...prev,
        clientId: "",
        firstName: "",
        lastName: "",
        branchId: "",
        branchName: "",
        phoneNumber: "",
        location: "",
        groupId: "",
        groupName: "",
        creditOfficerId: "",
        creditOfficerName: "",
      }));
      setClients([]);
      return;
    }

    const selectedGroup = groups.find((g) => String(g.id) === String(groupId));

    if (selectedGroup) {
      const selectedBranch = branches.find(
        (branch) =>
          String(branch.id) === String(selectedGroup.branchId) ||
          String(branch.branchId) === String(selectedGroup.branchId) ||
          String(branch.code) === String(selectedGroup.branchId)
      );

      setFormData((prev) => ({
        ...prev,
        groupId: String(selectedGroup.id),
        groupName: selectedGroup.groupName || selectedGroup.name || "",
        branchId: selectedBranch?.id ? String(selectedBranch.id) : "",
        branchName: selectedBranch?.name || selectedBranch?.branchName || "",
        creditOfficerId: selectedGroup.creditOfficerId ? String(selectedGroup.creditOfficerId) : "",
        creditOfficerName: selectedGroup.creditOfficer || "",
      }));

      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("adminToken");
        if (!token) throw new Error("Missing token");
      
        const membersRes = await axios.get(`${BASE_URL}/groups/members/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      
        setClients(membersRes.data?.content || membersRes.data || []);
      } catch (error) {
        console.error("Error fetching group members:", error);
        toast.error("Failed to load group members");
        setClients([]);
      }
      
    } else {
      console.error("Group not found for ID:", groupId);
      setFormData((prev) => ({
        ...prev,
        groupId: "",
        groupName: "",
        branchId: "",
        branchName: "",
        creditOfficerId: "",
        creditOfficerName: "",
      }));
      setClients([]);
    }
  };

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    if (!clientId || clientId === "") {
      setFormData((prev) => ({
        ...prev,
        clientId: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        location: "",
      }));
      return;
    }

    const selectedClient = clients.find((c) => String(c.id) === String(clientId));
    
    if (selectedClient) {
      const nameParts = (selectedClient.fullName || "").split(" ");
      
      setFormData((prev) => ({
        ...prev,
        clientId: String(selectedClient.id),
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phoneNumber: selectedClient.phone || "",
        location: selectedClient.location || "",
      }));
    } else {
      console.error("Client not found for ID:", clientId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setLoanLimitError(null);
    setShowErrorModal(false);

    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Add products before checking out.");
      setIsProcessing(false);
      return;
    }

    // Validation based on checkout type
    let requiredFields = [];
    let missingFields = [];

    if (checkoutType === "group") {
      requiredFields = [
        { field: 'clientId', label: 'Client' },
        { field: 'groupId', label: 'Group' },
        { field: 'branchId', label: 'Branch' },
        { field: 'creditOfficerId', label: 'Credit Officer ID' },
      ];
    } else if (checkoutType === "individual") {
      requiredFields = [
        { field: 'firstName', label: 'First Name' },
        { field: 'lastName', label: 'Last Name' },
        { field: 'email', label: 'Email' },
        { field: 'phoneNumber', label: 'Phone Number' },
        { field: 'billingAddress', label: 'Billing Address' },
        { field: 'billingCity', label: 'City' },
        { field: 'branchId', label: 'Branch' },
      ];
    }

    requiredFields.forEach(({ field, label }) => {
      const value = formData[field];
      if (!value || String(value).trim() === "") {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      console.log("Validation failed. Missing fields:", missingFields);
      toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setIsProcessing(false);
      return;
    }

    try {
      if (!useAuth) {
        console.error("Authentication token not found. Please log in again.");
        toast.error("Authentication token not found. Please log in again.");
        setIsProcessing(false);
        return;
      }

      if (checkoutType === "group") {
        // Keep existing group order logic unchanged
        const payload = {
          client: Number(formData.clientId),
          bookedBy: Number(formData.creditOfficerId),
          items: orderSummary.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        };

        const token = localStorage.getItem("userToken") || localStorage.getItem("adminToken");
        if (!token) {
          toast.error("Missing authentication token. Please log in again.");
          return;
        }

        console.log("Submitting group order with payload:", payload);

        const response = await axios.post(`${BASE_URL}/orders/place`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });


        console.log("API Response Status:", response.status);
        console.log("API Response Data:", response.data);

        if (response.status >= 200 && response.status < 300) {
          toast.success("Order Placed Successfully! 🎉", {
            position: "top-center",
            autoClose: 3000,
          });
          clearCart();
          setFormData({
            clientId: "",
            firstName: "",
            lastName: "",
            branchId: "",
            branchName: "",
            phoneNumber: "",
            location: "",
            groupId: "",
            groupName: "",
            creditOfficerId: "",
            creditOfficerName: "",
            // Individual client fields
            email: "",
            address: "",
            city: "",
            postalCode: "",
            billingAddress: "",
            billingCity: "",
            billingPostalCode: "",
          });
          setSelectedClientId("");
          setSelectedGroupId("");
          setCheckoutType("group");
        } else {
          toast.error(response.data?.message || "Failed to place order. Unexpected response.");
        }
      } else if (checkoutType === "individual") {
        // For individual checkout, show M-Pesa modal instead of creating order directly
        setShowMpesaModal(true);
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error("Error submitting checkout:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        const apiErrorMessage = error.response?.data?.message ||
                               error.response?.data?.error ||
                               "Failed to place order. Please check your network.";

        if (apiErrorMessage.toLowerCase().includes("loan limit reached")) {
          setLoanLimitError(apiErrorMessage);
          setShowErrorModal(true);
        } else {
          toast.error(apiErrorMessage);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };



  // Polling function to check transaction status
  const pollTransactionStatus = async (checkoutRequestId) => {
    try {
      const response = await axios.get(`${BASE}/pesa/transaction/query`, {
        params: { checkoutRequestId },
        headers: { Authorization: `Bearer ${useAuth}` },
      });

      const { ResultCode, ResultDesc, status, transaction } = response.data;

      console.log("Polling response:", response.data);

      if (ResultCode === 0 && transaction) {
        // Clear polling interval immediately to prevent duplicate submissions
        if (pollingIntervalId) {
          clearInterval(pollingIntervalId);
          setPollingIntervalId(null);
        }

        try {
          // Store payload data in localStorage for persistence
          const payloadData = {
            orderSummary,
            formData,
            checkoutRequestId,
            transaction
          };

          localStorage.setItem('paymentCompletionData', JSON.stringify(payloadData));

          // Use window.location for navigation to ensure proper page refresh
          window.location.href = '/payment-completion';

        } catch (navError) {
          console.error("Error storing data and navigating:", navError);

          // If something fails, clear polling and refresh checkout page
          if (pollingIntervalId) {
            clearInterval(pollingIntervalId);
            setPollingIntervalId(null);
          }

          setProcessingTransaction(false);
          setTransactionError({
            message: "Navigation failed. Refreshing page...",
          });

          toast.error("Refreshing checkout page...", {
            position: "top-center",
            autoClose: 2000,
          });

          // Refresh the current page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else if (status === "PENDING" || ResultCode === 4999) {
        // Still processing - continue polling (no UI updates)
        console.log("Payment still processing...");
      } else {
        // Error or failed - show error message
        setProcessingTransaction(false);
        setTransactionError({
          message: ResultDesc || "Payment failed. Please try again.",
        });
        setIsProcessing(false);

        // Clear polling interval
        if (pollingIntervalId) {
          clearInterval(pollingIntervalId);
          setPollingIntervalId(null);
        }
      }
    } catch (error) {
      console.error("Error polling transaction status:", error);
      // Check if polling should stop due to repeated errors
      if (!error.response || error.response.status !== 200) {
        // If polling is failing repeatedly, clear interval
        if (pollingIntervalId) {
          clearInterval(pollingIntervalId);
          setPollingIntervalId(null);
        }
      }
    }
  };

  const handleMpesaPayment = async () => {
    setIsProcessing(true);
  
    try {
      const token = localStorage.getItem("userToken") || localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Missing authentication token. Please log in again.");
        setIsProcessing(false);
        return;
      }
  
      // Simple payload for STK push
      const paymentPayload = {
        phoneNumber: mpesaPhoneNumber,
        amount: orderSummary.total.toString(),
      };
  
      console.log("Initiating M-Pesa payment with payload:", paymentPayload);
  
      // Call M-Pesa STK push endpoint
      const response = await axios.post(`${BASE}/pesa/stk/push`, paymentPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("M-Pesa Response Status:", response.status);
      console.log("M-Pesa Response Data:", response.data);
  
      const customerMessage =
        response.data?.CustomerMessage ||
        "M-Pesa STK Push sent! Check your phone to complete payment.";
  
      if (response.status >= 200 && response.status < 300) {
        const requestId = response.data?.CheckoutRequestID || response.data?.checkoutRequestId;
        console.log("CheckoutRequestId for polling:", requestId);
  
        if (requestId) {
          setCheckoutRequestId(requestId);
  
          toast.success(customerMessage, {
            position: "top-center",
            autoClose: 5000,
          });
  
          setMpesaPhoneNumber("");
          setShowErrorModal(false);
          setProcessingTransaction(true);
  
          // Start polling every 3 seconds
          const intervalId = setInterval(() => {
            pollTransactionStatus(requestId);
          }, 3000);
          setPollingIntervalId(intervalId);
        } else {
          toast.error("Failed to get checkout request ID for payment verification.");
          setIsProcessing(false);
        }
      } else {
        toast.error(response.data?.message || "Failed to initiate M-Pesa payment.");
      }
    } catch (error) {
      console.error("Error initiating M-Pesa payment:", error);
  
      if (axios.isAxiosError(error)) {
        const apiErrorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to initiate M-Pesa payment. Please try again.";
        toast.error(apiErrorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Optional: keep modal open while waiting for polling
    }
  };
  


  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setLoanLimitError(null);
  };

  if (isLoadingData) {
    return <CheckoutSkeleton />;
  }

  return (
    <>
      <div className="min-vh-100 bg-light py-4">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">Complete Your Order</h1>
                <p className="text-muted fs-5">Secure checkout process</p>
              </div>
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                            <CheckCircle size={20} className="text-white" />
                          </div>
                          <span className="fw-semibold text-dark">Cart</span>
                        </div>
                        <div className="flex-fill mx-3" style={{ height: '1px', backgroundColor: '#dee2e6' }}></div>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold" style={{ width: '32px', height: '32px' }}>
                            2
                          </div>
                          <span className="fw-semibold text-primary">Checkout</span>
                        </div>
                        <div className="flex-fill mx-3" style={{ height: '1px', backgroundColor: '#dee2e6' }}></div>
                        <div className="d-flex align-items-center">
                          <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center me-2 text-muted fw-bold" style={{ width: '32px', height: '32px' }}>
                            3
                          </div>
                          <span className="fw-semibold text-muted">Confirmation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                          <User className="text-primary" size={24} />
                        </div>
                        <div>
                          <h4 className="mb-1 fw-semibold">Customer Information</h4>
                          <p className="text-muted mb-0 small">Please provide your details</p>
                        </div>
                      </div>

                      {/* Checkout Type Selection */}
                      <div className="mb-4">
                        <div className="row">
                          <div className="col-12">
                            <label className="form-label fw-medium mb-3">Checkout Type</label>
                            <div className="d-flex gap-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="checkoutType"
                                  id="groupCheckout"
                                  value="group"
                                  checked={checkoutType === "group"}
                                  onChange={(e) => {
                                    setCheckoutType(e.target.value);
                                    setSelectedClientId("");
                                    setSelectedGroupId("");
                                    // Reset form data when switching types
                                    setFormData({
                                      ...formData,
                                      clientId: "",
                                      firstName: "",
                                      lastName: "",
                                      phoneNumber: "",
                                      groupId: "",
                                      groupName: "",
                                      creditOfficerId: admin?.id || "",
                                      creditOfficerName: admin?.name || admin?.fullName || "",
                                    });
                                  }}
                                />
                                <label className="form-check-label fw-medium" htmlFor="groupCheckout">
                                  Group Member
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="checkoutType"
                                  id="individualCheckout"
                                  value="individual"
                                  checked={checkoutType === "individual"}
                                  onChange={(e) => {
                                    setCheckoutType(e.target.value);
                                    setSelectedClientId("");
                                    setSelectedGroupId("");
                                    // Auto-populate credit officer for individual
                                    setFormData({
                                      ...formData,
                                      clientId: "",
                                      firstName: "",
                                      lastName: "",
                                      phoneNumber: "",
                                      email: "",
                                      address: "",
                                      city: "",
                                      postalCode: "",
                                      billingAddress: "",
                                      billingCity: "",
                                      billingPostalCode: "",
                                      groupId: "",
                                      groupName: "",
                                      creditOfficerId: admin?.id || "",
                                      creditOfficerName: admin?.name || admin?.fullName || "",
                                    });
                                  }}
                                />
                                <label className="form-check-label fw-medium" htmlFor="individualCheckout">
                                  Individual Client
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Group Checkout Form */}
                      {checkoutType === "group" && (
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label className="form-label fw-medium">Group Name</label>
                            <select
                              className="form-select form-select-lg"
                              value={selectedGroupId || ""}
                              onChange={(e) => handleGroupSelect(e.target.value)}
                            >
                              <option value="">Select a Group</option>
                              {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                  {group.groupName || group.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-12">
                            <label className="form-label fw-medium">Client</label>
                            <select
                              className="form-select form-select-lg"
                              value={selectedClientId || ""}
                              onChange={(e) => handleClientSelect(e.target.value)}
                              disabled={!selectedGroupId}
                            >
                              <option value="">Select a Client</option>
                              {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                  {client.fullName} ({client.clientNumber})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-medium">First Name</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="form-control form-control-lg"
                              placeholder="John"
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-medium">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="form-control form-control-lg"
                              placeholder="Doe"
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-medium">Branch</label>
                            <input
                              type="text"
                              name="branchName"
                              value={formData.branchName}
                              className="form-control form-control-lg"
                              placeholder="Main Branch"
                              readOnly
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-medium">Phone Number</label>
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="form-control form-control-lg"
                              placeholder="+254 700 000 000"
                              readOnly
                            />
                          </div>
                        </div>
                      )}

                      {/* Individual Checkout Form */}
                      {checkoutType === "individual" && (
                        <div>
                          {/* Personal Information */}
                          <h5 className="fw-semibold mb-3">Personal Information</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium">First Name *</label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="John"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Last Name *</label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="Doe"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Email *</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="john.doe@example.com"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Phone Number *</label>
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="+254 700 000 000"
                                required
                              />
                            </div>
                          </div>

                          {/* Billing Address */}
                          <h5 className="fw-semibold mb-3">Billing Address</h5>
                          <div className="row g-3 mb-4">
                            <div className="col-md-12">
                              <label className="form-label fw-medium">Street Address *</label>
                              <input
                                type="text"
                                name="billingAddress"
                                value={formData.billingAddress}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="123 Main Street"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">City *</label>
                              <input
                                type="text"
                                name="billingCity"
                                value={formData.billingCity}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="Nairobi"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Postal Code</label>
                              <input
                                type="text"
                                name="billingPostalCode"
                                value={formData.billingPostalCode}
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                placeholder="00100"
                              />
                            </div>
                          </div>

                          {/* Branch Selection */}
                          <h5 className="fw-semibold mb-3">Branch Information</h5>
                          <div className="row g-3">
                            <div className="col-md-12">
                              <label className="form-label fw-medium">Branch *</label>
                              <select
                                className="form-select form-select-lg"
                                name="branchId"
                                value={formData.branchId}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select a Branch</option>
                                {branches.map((branch) => (
                                  <option key={branch.id} value={branch.id}>
                                    {branch.name || branch.branchName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3">
                          <Truck className="text-success" size={24} />
                        </div>
                        <div>
                          <h4 className="mb-1 fw-semibold">Additional Information</h4>
                          <p className="text-muted mb-0 small">Loan and group details</p>
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control form-control-lg"
                            placeholder="Nairobi, Kenya"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">Credit Officer</label>
                          <input
                            type="text"
                            name="creditOfficerName"
                            value={formData.creditOfficerName}
                            onChange={handleChange}
                            className="form-control form-control-lg"
                            readOnly={checkoutType === "group"}
                            style={checkoutType === "group" ? { cursor: 'not-allowed', backgroundColor: '#e9ecef' } : {}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-info bg-opacity-10 rounded-3 p-2 me-3">
                          <ShoppingCart className="text-info" size={24} />
                        </div>
                        <div>
                          <h4 className="mb-1 fw-semibold">Order Products</h4>
                          <p className="text-muted mb-0 small">Review your selected items</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        {orderSummary.items.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-muted">Your cart is empty. Please add products to continue.</p>
                          </div>
                        ) : (
                          orderSummary.items.map(item => (
                            <div key={item.id} className="border rounded-3 p-3 mb-3">
                              <div className="d-flex align-items-start">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="me-3 rounded" 
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                                />
                                <div className="flex-grow-1">
                                  <h6 className="fw-semibold mb-2">{item.name}</h6>
                                  <p className="text-muted small mb-2">{item.description || "Product description"}</p>
                                  <div className="row">
                                    <div className="col-6">
                                      <small className="text-muted">Quantity:</small>
                                      <div className="fw-medium">{item.quantity}</div>
                                    </div>
                                    <div className="col-6 text-end">
                                      <small className="text-muted">Price:</small>
                                      <div className="fw-semibold text-primary">
                                        KSh {(item.price * item.quantity).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="alert alert-success d-flex align-items-center mb-0" role="alert">
                        <Shield className="me-2 text-success" size={20} />
                        <div className="small">Your information is secure and protected</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-info bg-opacity-10 rounded-3 p-2 me-3">
                          <ShoppingCart className="text-info" size={24} />
                        </div>
                        <h4 className="mb-0 fw-semibold">Order Summary</h4>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                          <span className="fw-medium">Items in Cart</span>
                          <span className="badge bg-primary">{orderSummary.items.length}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2 text-muted">
                          <span>Subtotal</span>
                          <span>KSh {orderSummary.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 text-muted">
                          <span>Shipping</span>
                          <span>KSh {orderSummary.shipping.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 text-muted">
                          <span>Tax</span>
                          <span>KSh {orderSummary.tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fs-5 fw-semibold">Total</span>
                          <span className="fs-4 fw-bold text-primary">
                            KSh {orderSummary.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {loanLimitError ? (
                        <div className="alert alert-danger text-center" role="alert">
                          <p className="mb-0 fw-bold">{loanLimitError}</p>
                        </div>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={isProcessing || orderSummary.items.length === 0}
                          className={`btn btn-lg w-100 py-3 d-flex align-items-center justify-content-center ${checkoutType === "individual" ? "btn-success" : "btn-primary"}`}
                        >
                          {isProcessing ? (
                            <div className="d-flex align-items-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Processing...
                            </div>
                          ) : checkoutType === "individual" ? (
                            <>
                              📱 Proceed with M-Pesa
                            </>
                          ) : (
                            <>
                              <Lock className="me-2" size={20} />
                              Place Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
      <ErrorModal
        message={loanLimitError}
        onClose={handleCloseErrorModal}
      />
      {showMpesaModal && (
        <MpesaModal
          amount={orderSummary.total}
          phoneNumber={mpesaPhoneNumber}
          onPhoneNumberChange={setMpesaPhoneNumber}
          onClose={() => {
            setShowMpesaModal(false);
            setMpesaPhoneNumber("");
            setProcessingTransaction(false);
            setTransactionSuccess(null);
            setTransactionError(null);
            setIsProcessing(false);
            // Clear polling interval if modal is closed
            if (pollingIntervalId) {
              clearInterval(pollingIntervalId);
              setPollingIntervalId(null);
            }
            setCheckoutRequestId(null);
          }}
          onSubmit={handleMpesaPayment}
          isProcessing={isProcessing}
          processingTransaction={processingTransaction}
          transactionSuccess={transactionSuccess}
          transactionError={transactionError}
          onCompleteOrder={() => handleCompleteOrder(checkoutRequestId, transactionDetails)}
        />
      )}
      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          animation: fadeIn 0.3s ease-out;
        }
        .modal-dialog-custom {
          max-width: 900px;
          margin: 1.75rem auto;
          position: relative;
          pointer-events: none;
          animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .modal-content-custom {
          position: relative;
          display: flex;
          flex-direction: column;
          background-color: var(--bs-body-bg);
          background-clip: padding-box;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          outline: 0;
          pointer-events: auto;
        }
        .modal-header-custom {
          padding: 1.5rem 1.5rem 0.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body-custom {
          padding: 1.5rem;
        }
        .btn-close-custom {
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        .btn-close-custom:hover {
          opacity: 1;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .bg-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        }
        .card {
          transition: all 0.3s ease;
        }
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        .btn-primary {
          background: linear-gradient(45deg, #0d6efd, #6610f2);
          border: none;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 110, 253, 0.3);
        }
        .btn-primary:disabled {
          transform: none;
          box-shadow: none;
        }
        .sticky-top {
          position: sticky !important;
        }
      `}</style>
    </>
  );
};

export default Checkout;
