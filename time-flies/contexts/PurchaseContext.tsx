import { setUserProperties, track } from '@/utils/analytics';
import * as Amplitude from '@amplitude/analytics-react-native';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { type PurchasesStoreProduct } from 'react-native-purchases';

export type PlanId = 'monthly' | 'yearly' | 'lifetime';

const PRODUCT_IDS: Record<PlanId, string> = {
  monthly: 'com.finite.time.monthly',
  yearly: 'com.finite.time.yearly',
  lifetime: 'com.finite.time.lifetime.access',
};

const API_KEY = 'appl_BFxMgiBKlbsXQPlyizMbpWgZBqZ';
const ENTITLEMENT_ID = 'premium';

interface PurchaseContextType {
  isProUser: boolean;
  products: Record<PlanId, PurchasesStoreProduct | null>;
  isLoading: boolean;
  isPurchasing: boolean;
  purchase: (planId: PlanId) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const PurchaseContext = createContext<PurchaseContextType>({
  isProUser: false,
  products: { monthly: null, yearly: null, lifetime: null },
  isLoading: true,
  isPurchasing: false,
  purchase: async () => false,
  restorePurchases: async () => false,
});

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [isProUser, setIsProUser] = useState(false);
  const [products, setProducts] = useState<Record<PlanId, PurchasesStoreProduct | null>>({
    monthly: null,
    yearly: null,
    lifetime: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        if (Platform.OS === 'web') {
          setIsLoading(false);
          return;
        }

        Purchases.configure({ apiKey: API_KEY });

        const appUserId = await Purchases.getAppUserID();
        Amplitude.setUserId(appUserId);

        const customerInfo = await Purchases.getCustomerInfo();
        setIsProUser(!!customerInfo.entitlements.active[ENTITLEMENT_ID]);

        const productIds = Object.values(PRODUCT_IDS);
        const fetched = await Purchases.getProducts(productIds);

        const mapped: Record<PlanId, PurchasesStoreProduct | null> = {
          monthly: null,
          yearly: null,
          lifetime: null,
        };
        for (const product of fetched) {
          for (const [planId, productId] of Object.entries(PRODUCT_IDS)) {
            if (product.identifier === productId) {
              mapped[planId as PlanId] = product;
            }
          }
        }
        setProducts(mapped);
      } catch {
        // RevenueCat not configured or no network — fall through with defaults
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  const purchase = useCallback(async (planId: PlanId): Promise<boolean> => {
    const product = products[planId];
    if (!product) return false;

    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchaseStoreProduct(product);
      const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
      setIsProUser(isPremium);
      if (isPremium) {
        track('purchase_completed', { plan: planId });
        setUserProperties({ is_pro_user: true });
      }
      return isPremium;
    } catch (e: any) {
      if (e.userCancelled) {
        track('purchase_cancelled', { plan: planId });
        return false;
      }
      track('purchase_failed', { plan: planId, error: e.message });
      throw e;
    } finally {
      setIsPurchasing(false);
    }
  }, [products]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    setIsPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const isPremium = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
      setIsProUser(isPremium);
      if (isPremium) {
        track('restore_completed');
        setUserProperties({ is_pro_user: true });
      }
      return isPremium;
    } catch {
      track('restore_failed');
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  return (
    <PurchaseContext.Provider
      value={{ isProUser, products, isLoading, isPurchasing, purchase, restorePurchases }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used within a PurchaseProvider');
  }
  return context;
}
