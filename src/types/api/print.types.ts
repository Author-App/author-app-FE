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
// Shipping Configuration
// ============================================================================

/**
 * Flat rate shipping configuration
 * Currently only shipping within USA with a fixed rate
 */
export const SHIPPING_CONFIG = {
  /** Default shipping method to use for all orders */
  method: 'MAIL' as ShippingOption,
  /** Flat rate shipping cost in USD */
  flatRate: 5.69,
  /** Estimated delivery time */
  deliveryEstimate: '5-10 business days',
  /** Only USA shipping supported */
  allowedCountries: ['US'] as const,
};

// US States for validation and autocomplete
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
] as const;
