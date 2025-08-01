import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Database,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  X,
  Loader2,
  UserSearch,
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useDataverse } from "@/hooks/useDataverse";
import { useAccounts, type Account } from "@/hooks/useAccounts";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const DemoPage = () => {
  const { navigateTo } = useNavigation();
  const { isReady, error: connectionError } = useDataverse();
  const {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    clearError,
    getAccount,
  } = useAccounts();

  // Form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<Partial<Account>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get single account states
  const [getAccountId, setGetAccountId] = useState<string>("");
  const [retrievedAccount, setRetrievedAccount] = useState<Account | null>(null);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrieveError, setRetrieveError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady) fetchAccounts();
  }, [isReady, fetchAccounts]);

  // Create Account
  const handleCreate = async () => {
    if (!formData.name) return;

    setIsSubmitting(true);

    const success = await createAccount(formData);
    if (success) {
      setIsCreateOpen(false);
      setFormData({});
    }

    setIsSubmitting(false);
  };

  // Update Account
  const handleUpdate = async () => {
    if (!selectedAccount?.accountid || !formData.name) return;

    setIsSubmitting(true);

    const success = await updateAccount(selectedAccount.accountid, formData);
    if (success) {
      setIsEditOpen(false);
      setSelectedAccount(null);
      setFormData({});
    }

    setIsSubmitting(false);
  };

  // Delete Account
  const handleDelete = async () => {
    if (!selectedAccount?.accountid) return;

    setIsSubmitting(true);

    const success = await deleteAccount(selectedAccount.accountid);
    if (success) {
      setIsDeleteOpen(false);
      setSelectedAccount(null);
    }

    setIsSubmitting(false);
  };

  // Get Single Account
  const handleGetAccount = async () => {
    if (!getAccountId) {
      setRetrieveError("Please provide an Account ID to search.");
      return;
    }

    setIsRetrieving(true);
    setRetrievedAccount(null);
    setRetrieveError(null);

    const result = await getAccount(getAccountId);

    if (result) {
      setRetrievedAccount(result);
    } else {
      setRetrieveError(
        `Account with ID "${getAccountId}" not found or an error occurred during fetch.`
      );
    }

    setIsRetrieving(false);
  };

  const openCreateDialog = () => {
    setFormData({});
    setIsCreateOpen(true);
  };

  const openEditDialog = (account: Account) => {
    setSelectedAccount(account);
    setFormData(account);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateTo("home")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dataverse CRUD Demo</h1>
              <p className="text-muted-foreground">Simple Account operations</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReady ? (
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 flex items-center gap-2"
            >
              <Wifi className="w-4 h-4" /> Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-2">
              <WifiOff className="w-4 h-4" /> Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {(connectionError || error) && (
        <Alert variant="destructive" className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{connectionError || error}</AlertDescription>
          </div>
          <Button size="sm" variant="ghost" onClick={clearError}>
            <X className="w-4 h-4" />
          </Button>
        </Alert>
      )}

      {/* CRUD Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Add a new account to Dataverse using the create operation.
            </p>
            <Button onClick={openCreateDialog} disabled={!isReady || loading}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Account
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-blue-600 ${loading ? "animate-spin" : ""}`} />
              Read Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Retrieve all accounts from Dataverse using retrieveMultiple.
            </p>
            <Button onClick={fetchAccounts} disabled={!isReady || loading} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Accounts
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-600" />
              Update Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Select an account from the table below to update its information.
            </p>
            <p className="text-sm text-muted-foreground">
              Click the edit button in the actions column.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Remove an account from Dataverse using the delete operation.
            </p>
            <p className="text-sm text-muted-foreground">
              Click the delete button in the actions column.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserSearch className="w-5 h-5 text-purple-600" />
            Get Single Account by ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Retrieve a specific account from Dataverse using its unique ID.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter Account ID..."
              value={getAccountId}
              onChange={(e) => {
                setGetAccountId(e.target.value);
                setRetrieveError(null);
                setRetrievedAccount(null);
              }}
              disabled={isRetrieving}
            />
            <Button onClick={handleGetAccount} disabled={!isReady || isRetrieving || !getAccountId}>
              {isRetrieving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Get Account
            </Button>
          </div>
          {retrievedAccount && (
            <Alert className="mt-4" variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Account Found: {retrievedAccount.name}</AlertTitle>
              <AlertDescription>
                <ul>
                  <li>
                    <strong>Email:</strong> {retrievedAccount.emailaddress1 || "N/A"},{" "}
                  </li>
                  <li>
                    <strong>Phone:</strong> {retrievedAccount.telephone1 || "N/A"},{" "}
                  </li>
                  <li>
                    <strong>City:</strong> {retrievedAccount.address1_city || "N/A"}
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {retrieveError && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{retrieveError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts ({accounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        <span className="ml-2">Loading accounts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : accounts.length > 0 ? (
                  accounts.map((account) => (
                    <TableRow key={account.accountid}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.emailaddress1 || "—"}</TableCell>
                      <TableCell>{account.telephone1 || "—"}</TableCell>
                      <TableCell>{account.address1_city || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(account)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(account)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No accounts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new account in Dataverse.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.emailaddress1 || ""}
                onChange={(e) => setFormData({ ...formData, emailaddress1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.telephone1 || ""}
                onChange={(e) => setFormData({ ...formData, telephone1: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !formData.name}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Account</DialogTitle>
            <DialogDescription>Update the account information below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.emailaddress1 || ""}
                onChange={(e) => setFormData({ ...formData, emailaddress1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.telephone1 || ""}
                onChange={(e) => setFormData({ ...formData, telephone1: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting || !formData.name}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAccount?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
