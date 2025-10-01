import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

const createProposalSchema = z.object({
  proposalType: z.enum(['buy', 'sell', 'transfer_funds', 'change_rules']),
  assetId: z.string().optional(),
  quantity: z.number().min(1).optional(),
  targetPrice: z.number().min(0).optional(),
  rationale: z.string().min(10, 'Rationale must be at least 10 characters'),
});

type CreateProposalForm = z.infer<typeof createProposalSchema>;

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
}

interface CreateProposalModalProps {
  open: boolean;
  onClose: () => void;
  clubId: string;
}

export function CreateProposalModal({ open, onClose, clubId }: CreateProposalModalProps) {
  const { toast } = useToast();

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ['/api/assets'],
    enabled: open,
  });

  const form = useForm<CreateProposalForm>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      proposalType: 'buy',
      rationale: '',
    },
  });

  const proposalType = form.watch('proposalType');
  const needsAsset = proposalType === 'buy' || proposalType === 'sell';

  const createMutation = useMutation({
    mutationFn: async (data: CreateProposalForm) => {
      const res = await apiRequest('POST', `/api/investment-clubs/${clubId}/proposals`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investment-clubs', clubId] });
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted for member voting",
      });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CreateProposalForm) => {
    if (needsAsset && !data.assetId) {
      toast({
        title: "Asset Required",
        description: "Please select an asset for this proposal type",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" data-testid="create-proposal-modal">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Create Proposal</DialogTitle>
          <DialogDescription>
            Submit a trading proposal for member voting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="proposalType">Proposal Type</Label>
            <Select
              value={form.watch('proposalType')}
              onValueChange={(value) => form.setValue('proposalType', value as any)}
            >
              <SelectTrigger id="proposalType" data-testid="select-proposal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy" data-testid="type-buy">Buy Asset</SelectItem>
                <SelectItem value="sell" data-testid="type-sell">Sell Asset</SelectItem>
                <SelectItem value="transfer_funds" data-testid="type-transfer">Transfer Funds</SelectItem>
                <SelectItem value="change_rules" data-testid="type-rules">Change Rules</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsAsset && (
            <div>
              <Label htmlFor="assetId">Asset</Label>
              <Select
                value={form.watch('assetId') || ''}
                onValueChange={(value) => form.setValue('assetId', value)}
              >
                <SelectTrigger id="assetId" data-testid="select-asset">
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets?.map((asset) => (
                    <SelectItem 
                      key={asset.id} 
                      value={asset.id}
                      data-testid={`asset-${asset.id}`}
                    >
                      {asset.symbol} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {needsAsset && (
            <>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  {...form.register('quantity', { valueAsNumber: true })}
                  placeholder="100"
                  data-testid="input-quantity"
                />
              </div>

              <div>
                <Label htmlFor="targetPrice">Target Price</Label>
                <Input
                  id="targetPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register('targetPrice', { valueAsNumber: true })}
                  placeholder="50.00"
                  data-testid="input-target-price"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="rationale">Rationale</Label>
            <Textarea
              id="rationale"
              {...form.register('rationale')}
              placeholder="Explain why this proposal benefits the club..."
              className="min-h-[120px]"
              data-testid="input-rationale"
            />
            {form.formState.errors.rationale && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.rationale.message}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-proposal"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              data-testid="button-submit-proposal"
            >
              {createMutation.isPending ? 'Creating...' : 'Submit Proposal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
