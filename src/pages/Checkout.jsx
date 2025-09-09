import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Truck, ShoppingCart, Lock, Shield, CheckCircle, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { toast, ToastContainer } from "react-toastify"; // Added ToastContainer import
import "react-toastify/dist/ReactToastify.css"; // Added CSS import

const BASE_URL = "https://api.mwanamama.org/api/v1";

// Skeleton Components
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
          {/* Header Skeleton */}
          <div className="text-center mb-5">
            <div className="skeleton mx-auto mb-3" style={{ width: "400px", height: "48px" }} />
            <div className="skeleton mx-auto" style={{ width: "200px", height: "24px" }} />
          </div>
          
          <div className="row g-4">
            <div className="col-lg-8">
              {/* Progress Bar Skeleton */}
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

              {/* Customer Information Skeleton */}
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

              {/* Additional Information Skeleton */}
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

              {/* Order Products Skeleton */}
              <SkeletonCard>
                <div className="d-flex align-items-center mb-4">
                  <div className="skeleton rounded-3 p-2 me-3" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <div className="skeleton mb-1" style={{ width: "140px", height: "24px" }} />
                    <div className="skeleton" style={{ width: "160px", height: "16px" }} />
                  </div>
                </div>
                
                {/* Product Items Skeleton */}
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
              {/* Order Summary Skeleton */}
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
    
    {/* Skeleton Styles */}
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
  const { cartItems, clearCart } = useCart();
  const { admin, adminToken } = useAdminAuth();

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
  });

  const [groups, setGroups] = useState([]);
  const [clients, setClients] = useState([]);
  const [branches, setBranches] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Calculate order summary
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

  // Fetch groups & branches with token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, branchesRes] = await Promise.all([
          axios.get(`${BASE_URL}/groups/unpaginated`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          axios.get(`${BASE_URL}/branches/unpaginated`, {
            headers: { Authorization: `Bearer ${adminToken}` },
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

    if (adminToken) {
      fetchData();
    }
  }, [adminToken]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle group selection and fetch members
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
        const membersRes = await axios.get(
          `${BASE_URL}/groups/members/${groupId}`,
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
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

  // Handle client selection
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
    console.log("Submit button clicked. Processing order...");

    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Add products before checking out.");
      setIsProcessing(false);
      return;
    }

    // Comprehensive client-side validation
    const requiredFields = [
      { field: 'clientId', label: 'Client' },
      { field: 'groupId', label: 'Group' },
      { field: 'branchId', label: 'Branch' },
      { field: 'creditOfficerId', label: 'Credit Officer ID' },
    ];

    const missingFields = [];
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
      if (!adminToken) {
        console.error("Authentication token not found. Please log in again.");
        toast.error("Authentication token not found. Please log in again.");
        setIsProcessing(false);
        return;
      }
      
      const payload = {
        client: Number(formData.clientId),
        bookedBy: Number(formData.creditOfficerId),
        items: orderSummary.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Submitting order with payload:", payload);

      const response = await axios.post(`${BASE_URL}/orders/place`, payload, {
        headers: { Authorization: `Bearer ${adminToken}` },
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
        });
        setSelectedClientId("");
        setSelectedGroupId("");

      } else {
        // This block handles cases where the API returns a non-2xx but non-error status
        console.log("Order placement failed with status:", response.status);
        toast.error(response.data?.message || "Failed to place order. Unexpected response.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        const apiErrorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               "Failed to place order. Please check your network.";
        toast.error(apiErrorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Show skeleton while loading
  if (isLoadingData) {
    return <CheckoutSkeleton />;
  }

  return (
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
                          className="form-control form-control-lg"
                          readOnly
                          style={{ cursor: 'not-allowed', backgroundColor: '#e9ecef' }}
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

                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing || orderSummary.items.length === 0}
                      className="btn btn-primary btn-lg w-100 py-3 d-flex align-items-center justify-content-center"
                    >
                      {isProcessing ? (
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Lock className="me-2" size={20} />
                          Place Order
                        </>
                      )}
                    </button>
                    <p className="text-muted text-center mt-3 small">
                      By placing your order, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
    </div>
  );
};

export default Checkout;
