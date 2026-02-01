"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from './client-form';
import { ClientFormData } from '@/lib/hooks/use-clients';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  title?: string;
  description?: string;
}

export function ClientDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  title = 'Edit Client',
  description = 'Update client information below.',
}: ClientDialogProps) {
  const handleSubmit = async (data: ClientFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1400px] !w-[95vw] max-h-[95vh] overflow-y-auto p-4 sm:p-6 md:p-10">
        <DialogHeader className="pb-4 border-b border-gray-200 mb-6">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base text-gray-600">{description}</DialogDescription>
        </DialogHeader>
        <ClientForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}


