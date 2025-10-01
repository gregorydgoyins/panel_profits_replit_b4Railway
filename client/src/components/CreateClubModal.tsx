import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { AlertTriangle, Users, X, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

const createClubSchema = z.object({
  name: z.string().min(3, 'Club name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type CreateClubForm = z.infer<typeof createClubSchema>;

interface User {
  id: string;
  username: string;
  subscriptionTier: string;
}

interface CreateClubModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClubModal({ open, onClose }: CreateClubModalProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users/search', searchTerm],
    enabled: searchTerm.length > 2,
  });

  const { data: userSub } = useQuery<{ tier: string; status: string; subscriberCount: number }>({
    queryKey: ['/api/user/subscription'],
  });

  const form = useForm<CreateClubForm>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateClubForm) => {
      const res = await apiRequest('POST', '/api/investment-clubs', {
        ...data,
        invitedUserIds: invitedUsers.map(u => u.id),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/investment-clubs'] });
      toast({
        title: "Club Created",
        description: `${data.name} has been created successfully`,
      });
      setLocation(`/investment-clubs/${data.id}`);
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

  const handleSubmit = (data: CreateClubForm) => {
    if (invitedUsers.length < 2) {
      toast({
        title: "Insufficient Members",
        description: "You need to invite at least 2 other members (3 total including yourself)",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(data);
  };

  const addUser = (user: User) => {
    if (!invitedUsers.find(u => u.id === user.id)) {
      setInvitedUsers([...invitedUsers, user]);
      setSearchTerm('');
    }
  };

  const removeUser = (userId: string) => {
    setInvitedUsers(invitedUsers.filter(u => u.id !== userId));
  };

  const isOfficeManager = userSub?.tier === 'pro' || userSub?.tier === 'elite';
  const hasEnoughSubscribers = (userSub?.subscriberCount || 0) >= 3;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" data-testid="create-club-modal">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Create Investment Club</DialogTitle>
          <DialogDescription>
            Establish a collaborative trading syndicate with trusted members
          </DialogDescription>
        </DialogHeader>

        {!isOfficeManager && (
          <Card className="p-4 border-l-4 border-l-warning bg-warning/10" data-testid="eligibility-warning">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning">Office Manager Required</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You need Office Manager (Pro) tier or higher to create investment clubs
                </p>
              </div>
            </div>
          </Card>
        )}

        {!hasEnoughSubscribers && (
          <Card className="p-4 border-l-4 border-l-destructive bg-destructive/10" data-testid="subscriber-warning">
            <div className="flex gap-3">
              <Users className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Subscriber Requirement</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You need at least 3 active subscribers to create an investment club
                </p>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Club Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="The Shadow Syndicate"
              data-testid="input-club-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="A collaborative trading group focused on high-value comic assets..."
              className="min-h-[100px]"
              data-testid="input-club-description"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div>
            <Label>Minimum Members</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" data-testid="minimum-members">3 members (including yourself)</Badge>
              <span className="text-sm text-muted-foreground">Required for club activation</span>
            </div>
          </div>

          <div>
            <Label htmlFor="search">Invite Members</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users to invite..."
                className="pl-9"
                data-testid="input-search-users"
              />
            </div>
            {searchTerm.length > 2 && users && users.length > 0 && (
              <Card className="mt-2 p-2 max-h-[200px] overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => addUser(user)}
                    className="w-full text-left p-2 hover-elevate rounded-md flex items-center justify-between"
                    data-testid={`user-search-result-${user.id}`}
                  >
                    <span className="font-medium">{user.username}</span>
                    <Badge variant="outline">{user.subscriptionTier}</Badge>
                  </button>
                ))}
              </Card>
            )}
          </div>

          <div>
            <Label>Invited Members ({invitedUsers.length})</Label>
            <div className="mt-2 space-y-2">
              {invitedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                  data-testid={`invited-user-${user.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.username}</span>
                    <Badge variant="outline" className="text-xs">{user.subscriptionTier}</Badge>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeUser(user.id)}
                    data-testid={`button-remove-user-${user.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {invitedUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No members invited yet. Search and add at least 2 members.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-create"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isOfficeManager || !hasEnoughSubscribers || createMutation.isPending}
              data-testid="button-submit-create"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Club'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
