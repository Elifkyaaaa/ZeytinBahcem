/**
 * The `iyzipay` package ships no type definitions, so we declare only the
 * surface that `src/utils/iyzico.ts` actually uses.
 */
declare module 'iyzipay' {
  type Callback<T> = (error: unknown, result: T) => void;

  interface IyzipayOptions {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  class Iyzipay {
    constructor(options: IyzipayOptions);

    static readonly LOCALE: { TR: string; EN: string };
    static readonly CURRENCY: { TRY: string; EUR: string; USD: string; GBP: string };
    static readonly PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string };
    static readonly BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string };
    static readonly PAYMENT_CHANNEL: { WEB: string; MOBILE: string };

    checkoutFormInitialize: {
      create<T>(request: Record<string, unknown>, callback: Callback<T>): void;
    };

    checkoutForm: {
      retrieve<T>(request: Record<string, unknown>, callback: Callback<T>): void;
    };

    payment: {
      create<T>(request: Record<string, unknown>, callback: Callback<T>): void;
      retrieve<T>(request: Record<string, unknown>, callback: Callback<T>): void;
    };

    refund: {
      create<T>(request: Record<string, unknown>, callback: Callback<T>): void;
    };
  }

  export default Iyzipay;
}
