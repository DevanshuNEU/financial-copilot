/**
 * Utility Types for Enhanced Type Safety
 */

// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
export type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick specific properties
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit specific properties
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Non-nullable type
export type NonNullable<T> = T extends null | undefined ? never : T;

// Extract type from array
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Deep readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Conditional type for form field validation
export type ValidationRule<T> = {
  required?: boolean;
  min?: T extends number ? number : T extends string ? number : never;
  max?: T extends number ? number : T extends string ? number : never;
  pattern?: T extends string ? RegExp : never;
  custom?: (value: T) => boolean | string;
};

// Form field type with validation
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
  validation?: ValidationRule<T>;
};

// Form state type
export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// API loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Async data wrapper
export type AsyncData<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
};

// Event handler type
export type EventHandler<T = void> = (event: T) => void;

// Callback type
export type Callback<T = void> = () => T;

// Brand type creator
export type Brand<T, B> = T & { readonly brand: B };

// ID types
export type ID<T extends string = string> = Brand<string, T>;

// Currency amount with currency type
export type CurrencyAmount = {
  amount: number;
  currency: string;
};

// Date range type
export type DateRange = {
  start: Date;
  end: Date;
};

// Pagination type
export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// Sort order type
export type SortOrder = 'asc' | 'desc';

// Sort configuration
export type SortConfig<T> = {
  key: keyof T;
  order: SortOrder;
};

// Filter type
export type Filter<T> = {
  [K in keyof T]?: T[K] | T[K][] | {
    min?: T[K];
    max?: T[K];
    contains?: string;
    startsWith?: string;
    endsWith?: string;
  };
};

// Search parameters
export type SearchParams<T> = {
  query?: string;
  filters?: Filter<T>;
  sort?: SortConfig<T>;
  pagination?: Pagination;
};
