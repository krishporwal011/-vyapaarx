export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  gstNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  hsnCode?: string;
  description?: string;
  category?: string;
  price: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  images: string[];
  gstRate: number;
  isActive: boolean;
  tags: string[];
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'retail' | 'wholesale' | 'distributor';
  gstin?: string;
  tags: string[];
  isActive: boolean;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  total: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customer?: Customer;
  orderNumber: string;
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  orderId?: string | null;
  invoiceNumber: string;
  customerId: string;
  supplierId?: string | null;
  subtotal: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  paymentMethod?: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CARD' | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  
  customer?: {
    id: string;
    name: string;
    email?: string | null;
    state?: string | null;
    gstin?: string | null;
  };
  supplier?: {
    id: string;
    name: string;
    supplierCode: string;
  } | null;
  items?: InvoiceItem[];
  payments?: Payment[];
  taxRecords?: TaxRecord[];
}

export interface AnalyticsOverview {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
  overdueInvoices: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Supplier {
  id: string;
  userId: string;
  supplierCode: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierAnalytics {
  total: number;
  active: number;
  inactive: number;
  growthStats: { month: string; count: number }[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  gstRate: number;
  hsnCode?: string | null;
  total: number;
  product?: {
    id: string;
    name: string;
    sku: string;
  };
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string | null;
  paymentDate: string;
}

export interface TaxRecord {
  id: string;
  invoiceId: string;
  taxType: 'CGST' | 'SGST' | 'IGST';
  rate: number;
  amount: number;
}



export interface InvoiceAnalytics {
  totalSales: number;
  gstCollected: number;
  pendingPayments: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

