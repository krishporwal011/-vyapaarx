'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'HI' | 'HN';

export interface TranslationDictionary {
  // Navigation / Sidebar
  navOverview: string;
  navDashboard: string;
  navAnalytics: string;
  navCommerce: string;
  navInventory: string;
  navSales: string;
  navPurchases: string;
  navGstBilling: string;
  navPayments: string;
  navAiIntel: string;
  navAiAccountant: string;
  navForecasting: string;
  navOpsHr: string;
  navStaff: string;
  navPayroll: string;
  navCashbook: string;
  navCommunications: string;
  navContacts: string;
  navCustomers: string;
  navSuppliers: string;
  navSystem: string;
  navSettings: string;

  // Dashboard Metrics & Charts
  metricRevenue: string;
  metricProfit: string;
  metricOrders: string;
  metricStaff: string;
  chartRevenueOverview: string;
  chartOrdersBreakdown: string;
  monthJan: string;
  monthFeb: string;
  monthMar: string;
  monthApr: string;
  monthMay: string;
  monthJun: string;
  monthJul: string;
  monthAug: string;
  monthSep: string;
  monthOct: string;
  monthNov: string;
  monthDec: string;

  // Pages & Core ledgers (Suppliers, Sales, Profile)
  title: string;
  subtitle: string;
  addSupplier: string;
  addSale: string;
  searchPlace: string;
  active: string;
  inactive: string;
  all: string;
  pendingBalance: string;
  noSupplier: string;
  selectHint: string;
  quickAdd: string;
  save: string;
  name: string;
  phone: string;
  gst: string;
  state: string;
  cash: string;
  upi: string;
  savePayment: string;
  paymentSuccess: string;
  emptyTitle: string;
  emptyDesc: string;
  saleSuccess: string;
  print: string;
  download: string;
  details: string;
  breakdown: string;
  paid: string;
  pending: string;
  overdue: string;
  totalValue: string;
  noSale: string;
  customer: string;
  product: string;
  qty: string;
  rate: string;
  gstRate: string;
  discount: string;
  paymentType: string;
  notes: string;
  subtotal: string;
  calcGst: string;
  total: string;
}

const translations: Record<Language, TranslationDictionary> = {
  EN: {
    // Navigation / Sidebar
    navOverview: 'Overview',
    navDashboard: 'Dashboard',
    navAnalytics: 'Analytics',
    navCommerce: 'Commerce',
    navInventory: 'Inventory',
    navSales: 'Sales',
    navPurchases: 'Purchases',
    navGstBilling: 'GST Billing',
    navPayments: 'UPI & Payments',
    navAiIntel: 'AI Intelligence',
    navAiAccountant: 'AI Accountant',
    navForecasting: 'Predictive Forecast',
    navOpsHr: 'Operations & HR',
    navStaff: 'Staff Directory',
    navPayroll: 'Payroll & HR',
    navCashbook: 'Cashbook & Expense',
    navCommunications: 'Campaigns & Alerts',
    navContacts: 'Contacts',
    navCustomers: 'Customers',
    navSuppliers: 'Suppliers',
    navSystem: 'System',
    navSettings: 'Settings',

    // Dashboard Metrics & Charts
    metricRevenue: 'Total Revenue',
    metricProfit: 'Net Profit Margin',
    metricOrders: 'Active Sale Orders',
    metricStaff: 'Onboarded Staff Count',
    chartRevenueOverview: 'Revenue Overview',
    chartOrdersBreakdown: 'Orders Breakdown',
    monthJan: 'Jan',
    monthFeb: 'Feb',
    monthMar: 'Mar',
    monthApr: 'Apr',
    monthMay: 'May',
    monthJun: 'Jun',
    monthJul: 'Jul',
    monthAug: 'Aug',
    monthSep: 'Sep',
    monthOct: 'Oct',
    monthNov: 'Nov',
    monthDec: 'Dec',

    // Pages & Core ledgers (Suppliers, Sales, Profile)
    title: 'Suppliers Ledger',
    subtitle: 'Manage supplier bills, pending credits, and party statements.',
    addSupplier: '+ Add Supplier',
    addSale: '+ New Sale',
    searchPlace: 'Search client or invoice ID...',
    active: 'Active',
    inactive: 'Inactive',
    all: 'All',
    pendingBalance: 'Pending Balance',
    noSupplier: 'No Supplier Selected',
    selectHint: 'Click on a card from the left panel to review items, state GST breakdowns, and printable layouts.',
    quickAdd: 'Generate GST Document',
    save: 'Create Order',
    name: 'Party Name',
    phone: 'Phone Number',
    gst: 'GSTIN Registration',
    state: 'State of Business',
    cash: 'Cash Outflow',
    upi: 'UPI Payout',
    savePayment: 'Record Payout',
    paymentSuccess: 'Payment entry recorded successfully!',
    emptyTitle: 'No records added yet',
    emptyDesc: 'Onboard your first party to track bills and balance statements.',
    saleSuccess: 'Invoice generated and client ledger reconciled successfully!',
    print: 'Print Invoice',
    download: 'Download PDF',
    details: 'Invoice Details',
    breakdown: 'GST HSN Tax Breakdown',
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    totalValue: 'Invoice Total',
    noSale: 'No Invoice Selected',
    customer: 'Customer Name',
    product: 'Product Title',
    qty: 'Quantity',
    rate: 'Unit Price',
    gstRate: 'GST % Rate',
    discount: 'Discount',
    paymentType: 'Payment Method',
    notes: 'Comments',
    subtotal: 'Subtotal',
    calcGst: 'Calculated GST',
    total: 'Net Payable Amount'
  },
  HI: {
    // Navigation / Sidebar
    navOverview: 'अवलोकन',
    navDashboard: 'डैशबोर्ड',
    navAnalytics: 'एनालिटिक्स',
    navCommerce: 'व्यापार',
    navInventory: 'इन्वेंटरी',
    navSales: 'बिक्री',
    navPurchases: 'खरीद',
    navGstBilling: 'GST बिलिंग',
    navPayments: 'UPI और भुगतान',
    navAiIntel: 'AI इंटेलिजेंस',
    navAiAccountant: 'AI मुनीम',
    navForecasting: 'पूर्वानुमान',
    navOpsHr: 'ऑपरेशन्स और HR',
    navStaff: 'स्टाफ डायरेक्टरी',
    navPayroll: 'पेरोल और HR',
    navCashbook: 'कैशबुक और खर्च',
    navCommunications: 'अभियान और अलर्ट',
    navContacts: 'पार्टी संपर्क',
    navCustomers: 'ग्राहक',
    navSuppliers: 'सप्लायर',
    navSystem: 'सिस्टम',
    navSettings: 'सेटिंग्स',

    // Dashboard Metrics & Charts
    metricRevenue: 'कुल राजस्व',
    metricProfit: 'शुद्ध लाभ मार्जिन',
    metricOrders: 'सक्रिय बिक्री आदेश',
    metricStaff: 'स्टाफ सदस्यों की संख्या',
    chartRevenueOverview: 'राजस्व अवलोकन',
    chartOrdersBreakdown: 'ऑर्डर विवरण',
    monthJan: 'जनवरी',
    monthFeb: 'फरवरी',
    monthMar: 'मार्च',
    monthApr: 'अप्रैल',
    monthMay: 'मई',
    monthJun: 'जून',
    monthJul: 'जुलाई',
    monthAug: 'अगस्त',
    monthSep: 'सितंबर',
    monthOct: 'अक्टूबर',
    monthNov: 'नवंबर',
    monthDec: 'दिसंबर',

    // Pages & Core ledgers (Suppliers, Sales, Profile)
    title: 'सप्लायर बहीखाता',
    subtitle: 'सप्लायर बिल, पेंडिंग बैलेंस और पार्टी स्टेटमेंट का प्रबंधन करें।',
    addSupplier: '+ सप्लायर जोड़ें',
    addSale: '+ नई बिक्री',
    searchPlace: 'खोजें...',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    all: 'सभी',
    pendingBalance: 'पेंडिंग बैलेंस',
    noSupplier: 'कोई सप्लायर नहीं चुना गया',
    selectHint: 'विवरण, बहीखाता और लेनदेन की समीक्षा के लिए बाएं पैनल से एक कार्ड पर क्लिक करें।',
    quickAdd: 'GST इनवॉइस बनाएं',
    save: 'ऑर्डर सुरक्षित करें',
    name: 'पार्टी का नाम',
    phone: 'फ़ोन नंबर',
    gst: 'GSTIN रजिस्ट्रेशन',
    state: 'व्यवसाय का राज्य',
    cash: 'नकद भुगतान',
    upi: 'UPI भुगतान',
    savePayment: 'भुगतान रिकॉर्ड करें',
    paymentSuccess: 'भुगतान प्रविष्टि सफलतापूर्वक दर्ज की गई!',
    emptyTitle: 'अभी तक कोई रिकॉर्ड नहीं जोड़ा गया है',
    emptyDesc: 'बिल और बैलेंस स्टेटमेंट को ट्रैक करने के लिए पहला पार्टी जोड़ें।',
    saleSuccess: 'इनवॉइस सफलतापूर्वक बनाई गई और ग्राहक बहीखाता समायोजित किया गया!',
    print: 'इनवॉइस प्रिंट करें',
    download: 'PDF डाउनलोड करें',
    details: 'इनवॉइस विवरण',
    breakdown: 'GST HSN टैक्स ब्रेकडाउन',
    paid: 'भुगतान किया',
    pending: 'पेंडिंग',
    overdue: 'अतिदेय',
    totalValue: 'इनवॉइस कुल योग',
    noSale: 'कोई इनवॉइस नहीं चुना गया',
    customer: 'ग्राहक का नाम',
    product: 'उत्पाद का नाम',
    qty: 'मात्रा',
    rate: 'प्रति इकाई मूल्य',
    gstRate: 'GST % दर',
    discount: 'छूट (Discount)',
    paymentType: 'भुगतान का प्रकार',
    notes: 'टिप्पणी',
    subtotal: 'उप-योग (Subtotal)',
    calcGst: 'कैलकुलेटेड GST',
    total: 'कुल देय राशि'
  },
  HN: {
    // Navigation / Sidebar
    navOverview: 'Overview',
    navDashboard: 'Dashboard',
    navAnalytics: 'Analytics',
    navCommerce: 'Commerce',
    navInventory: 'Inventory',
    navSales: 'Sales',
    navPurchases: 'Purchases',
    navGstBilling: 'GST Billing',
    navPayments: 'UPI & Payments',
    navAiIntel: 'AI Intelligence',
    navAiAccountant: 'AI Accountant',
    navForecasting: 'Predictive Forecast',
    navOpsHr: 'Operations & HR',
    navStaff: 'Staff Directory',
    navPayroll: 'Payroll & HR',
    navCashbook: 'Cashbook & Kharcha',
    navCommunications: 'Campaigns & Alerts',
    navContacts: 'Contacts',
    navCustomers: 'Customers',
    navSuppliers: 'Suppliers',
    navSystem: 'System',
    navSettings: 'Settings',

    // Dashboard Metrics & Charts
    metricRevenue: 'Total Revenue',
    metricProfit: 'Net Profit Margin',
    metricOrders: 'Active Sale Orders',
    metricStaff: 'Staff Count',
    chartRevenueOverview: 'Revenue Overview',
    chartOrdersBreakdown: 'Orders Breakdown',
    monthJan: 'Jan',
    monthFeb: 'Feb',
    monthMar: 'Mar',
    monthApr: 'Apr',
    monthMay: 'May',
    monthJun: 'Jun',
    monthJul: 'Jul',
    monthAug: 'Aug',
    monthSep: 'Sep',
    monthOct: 'Oct',
    monthNov: 'Nov',
    monthDec: 'Dec',

    // Pages & Core ledgers (Suppliers, Sales, Profile)
    title: 'Supplier BahiKhata',
    subtitle: 'Supplier bills, pending balance aur party statement manage karein.',
    addSupplier: '+ Supplier Add Karo',
    addSale: '+ Naya Sale',
    searchPlace: 'Search karein...',
    active: 'Active',
    inactive: 'Inactive',
    all: 'Sabhi',
    pendingBalance: 'Pending Balance',
    noSupplier: 'Koi Selected Nahi Hai',
    selectHint: 'Details, bahi-khata aur transactions check karne ke liye left panel se ek card choose karein.',
    quickAdd: 'GST Invoice Banao',
    save: 'Order Create Karein',
    name: 'Party Ka Name',
    phone: 'Phone Number',
    gst: 'GSTIN Registration',
    state: 'Business Ka State',
    cash: 'Cash Payout',
    upi: 'UPI Payout',
    savePayment: 'Payment Record Karein',
    paymentSuccess: 'Payment record successfully save ho gaya!',
    emptyTitle: 'Abhi tak koi record add nahi kiya gaya',
    emptyDesc: 'Bills aur statements track karne ke liye apna pehla party add karein.',
    saleSuccess: 'Invoice generate ho gaya aur client bahi-khata update ho gaya!',
    print: 'Print Invoice',
    download: 'Download PDF',
    details: 'Invoice Details',
    breakdown: 'GST HSN Tax Breakdown',
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    totalValue: 'Invoice Total',
    noSale: 'Koi Invoice Selected Nahi Hai',
    customer: 'Customer Ka Name',
    product: 'Product Title',
    qty: 'Quantity',
    rate: 'Unit Price',
    gstRate: 'GST % Rate',
    discount: 'Discount',
    paymentType: 'Payment Method',
    notes: 'Comments',
    subtotal: 'Subtotal',
    calcGst: 'Calculated GST',
    total: 'Net Payable Amount'
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('vyapaarx_lang') as Language;
    if (saved && ['EN', 'HI', 'HN'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vyapaarx_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
