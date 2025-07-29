import { useState, useCallback } from "react";
import { useDataverse } from "@/hooks/useDataverse";

export interface Account {
  accountid?: string;
  name?: string;
  emailaddress1?: string;
  telephone1?: string;
  websiteurl?: string;
  address1_city?: string;
  createdon?: string;
}

export const useAccounts = () => {
  const { api, isReady } = useDataverse();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve Multiple Accounts
  const fetchAccounts = useCallback(async () => {
    if (!api || !isReady) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.retrieveMultiple({
        collection: "accounts",
        select: ["accountid", "name", "emailaddress1", "telephone1", "websiteurl", "address1_city", "createdon"],
        filter: "statecode eq 0",
        orderBy: ["name asc"],
        maxPageSize: 10,
      });

      setAccounts(response?.value || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  }, [api, isReady]);

  // Retrieve Single Account
  const getAccount = useCallback(
    async (accountId: string): Promise<Account | null> => {
      if (!api || !isReady || !accountId) return null;

      try {
        setError(null);
        const response = await api.retrieve({
          collection: "accounts",
          key: accountId,
          select: ["accountid", "name", "emailaddress1", "telephone1", "websiteurl", "address1_city", "createdon"],
        });

        return response as Account;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to retrieve account");
        return null;
      }
    },
    [api, isReady]
  );

  // Create Account
  const createAccount = useCallback(
    async (accountData: Partial<Account>): Promise<string | null> => {
      if (!api || !isReady || !accountData.name) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await api.create({
          collection: "accounts",
          data: accountData,
        });

        // Refresh the accounts list
        await fetchAccounts();

        return response as string;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create account");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api, isReady, fetchAccounts]
  );

  // Update Account
  const updateAccount = useCallback(
    async (accountId: string, updates: Partial<Account>): Promise<boolean> => {
      if (!api || !isReady || !accountId) return false;

      setLoading(true);
      setError(null);

      try {
        await api.update({
          collection: "accounts",
          key: accountId,
          data: updates,
        });

        // Refresh the accounts list
        await fetchAccounts();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update account");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [api, isReady, fetchAccounts]
  );

  // Delete Account
  const deleteAccount = useCallback(
    async (accountId: string): Promise<boolean> => {
      if (!api || !isReady || !accountId) return false;

      setLoading(true);
      setError(null);

      try {
        await api.deleteRecord({
          collection: "accounts",
          key: accountId,
        });

        // Refresh the accounts list
        await fetchAccounts();

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete account");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [api, isReady, fetchAccounts]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    accounts,
    loading,
    error,
    isReady,

    // Actions
    fetchAccounts,
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    clearError,
  };
};
