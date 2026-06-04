/**
 * Print Order API Types
 * 
 * Type definitions for Lulu print-on-demand checkout flow.
 * Used for hardcover and paperback book purchases.
 */

// ============================================================================
// Common Types
// ============================================================================

/**
 * Shipping options available from Lulu
 */
export type ShippingOption = 
  | 'MAIL' 
  | 'PRIORITY_MAIL' 
  | 'GROUND_HD' 
  | 'GROUND_BUS' 
  | 'GROUND' 
  | 'EXPEDITED' 
  | 'EXPRESS';

/**
 * Print order status
 * Matches backend statuses: created → paid → fulfillment_pending → lulu_submitted → shipped → delivered
 */
export type PrintOrderStatus = 
  | 'created' 
  | 'payment_pending' 
  | 'paid' 
  | 'fulfillment_pending'
  | 'lulu_submitted'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed';

/**
 * Shipping address for print orders
 */
export interface ShippingAddress {
  countryCode: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  street1: string;
  street2?: string;
  city: string;
  stateCode: string;
  postcode: string;
  phone: string;
  email: string;
}

// ============================================================================
// POST /print/quote - Get Quote
// ============================================================================

export interface PrintQuoteRequest {
  bookId: string;
  quantity: number;
  shippingOption: ShippingOption;
  shipping: ShippingAddress;
}

export interface PrintQuoteData {
  bookId: string;
  title: string;
  amountCents: number;
  currency: string;
  luluTotalCostInclTax: string;
  raw?: unknown; // Debug/raw Lulu payload
}

export interface PrintQuoteResponse {
  status: string;
  data: PrintQuoteData;
}

// ============================================================================
// POST /print/orders - Create Print Order
// ============================================================================

export interface CreatePrintOrderRequest {
  bookId: string;
  quantity: number;
  shippingOption: ShippingOption;
  shipping: ShippingAddress;
  quotedAmountCents: number;
  luluTotalCostInclTax: string;
}

export interface PrintOrderData {
  printOrderId: string;
  clientSecret: string;
  amountCents: number;
  currency: string;
  status: PrintOrderStatus;
}

export interface CreatePrintOrderResponse {
  status: string;
  data: PrintOrderData;
}

// ============================================================================
// GET /print/orders/:printOrderId - Get Print Order Status
// ============================================================================

export interface PrintOrderStatusData {
  printOrderId: string;
  status: PrintOrderStatus;
  luluStatus?: string;
  luluPrintJobId?: string;
  trackingUrls?: string[];
  fulfillmentError?: string;
  amountCents: number;
  currency: string;
  shipping: ShippingAddress;
  shippingOption: ShippingOption;
  createdAt: string;
  updatedAt: string;
}

export interface GetPrintOrderResponse {
  status: string;
  data: PrintOrderStatusData;
}

// ============================================================================
// Shipping Options Display Config
// ============================================================================

export interface ShippingOptionConfig {
  value: ShippingOption;
  label: string;
  description: string;
}

export const SHIPPING_OPTIONS: ShippingOptionConfig[] = [
  { value: 'MAIL', label: 'Standard Mail', description: '7-14 business days' },
  { value: 'PRIORITY_MAIL', label: 'Priority Mail', description: '3-7 business days' },
  { value: 'GROUND', label: 'Ground', description: '5-10 business days' },
  { value: 'GROUND_HD', label: 'Ground Home Delivery', description: '5-10 business days' },
  { value: 'GROUND_BUS', label: 'Ground Business', description: '5-10 business days' },
  { value: 'EXPEDITED', label: 'Expedited', description: '2-5 business days' },
  { value: 'EXPRESS', label: 'Express', description: '1-3 business days' },
];
