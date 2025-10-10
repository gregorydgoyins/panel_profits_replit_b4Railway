import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Layout, 
  Globe, 
  Settings, 
  Activity, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface ExternalIntegration {
  id: string;
  integrationName: string;
  displayName: string;
  status: 'active' | 'inactive' | 'error' | 'setup';
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
  lastSyncAt?: string;
  createdAt: string;
  errorMessage?: string;
}

interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  triggerType: string;
  actionType: string;
  totalExecutions: number;
  successfulExecutions: number;
  lastRunAt?: string;
  nextRunAt?: string;
}

interface IntegrationAnalytics {
  integrationName: string;
  totalApiCalls: number;
  successRate: number;
  averageResponseTime: number;
  errorCount: number;
}

const integrationTypes = [
  {
    id: 'webflow',
    name: 'Webflow',
    description: 'Divine Portfolio Forge - Create stunning portfolio websites',
    icon: Globe,
    color: 'from-blue-500 to-purple-600',
    features: ['Portfolio Generation', 'Asset Showcase', 'Marketing Pages']
  },
  {
    id: 'figma',
    name: 'Figma', 
    description: 'Celestial Design Forge - Sync design systems and tokens',
    icon: Palette,
    color: 'from-pink-500 to-orange-500',
    features: ['Design Tokens', 'Component Library', 'Design Handoff']
  },
  {
    id: 'relume',
    name: 'Relume',
    description: 'Sacred Component Sanctum - Manage component libraries',
    icon: Layout,
    color: 'from-green-500 to-teal-500',
    features: ['Component Library', 'Quality Assurance', 'Usage Analytics']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Ethereal Hub - Connect all your workflows',
    icon: Zap,
    color: 'from-yellow-500 to-red-500',
    features: ['Workflow Automation', 'Multi-step Zaps', 'Event Routing']
  }
];

export default function DivineConnections() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);

  // Fetch user's integrations
  const { data: integrationsResponse, isLoading: integrationsLoading } = useQuery({
    queryKey: ['/api/integrations'],
    queryFn: async () => {
      const response = await apiRequest('/api/integrations');
      return response;
    }
  });
  
  const integrations = integrationsResponse?.divineConnections || [];
  const totalConnections = integrationsResponse?.totalConnections || 0;
  const activeConnections = integrationsResponse?.activeConnections || 0;

  // Fetch user's workflow automations
  const { data: workflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ['/api/integrations/workflows'],
    queryFn: async () => {
      const response = await apiRequest('/api/integrations/workflows');
      return response.workflows || [];
    }
  });

  // Fetch integration analytics
  const { data: analytics = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/integrations/analytics'],
    queryFn: async () => {
      const response = await apiRequest('/api/integrations/analytics');
      return response.analytics || [];
    }
  });

  // Create integration mutation
  const createIntegrationMutation = useMutation({
    mutationFn: async (data: { integrationType: string; credentials: any; config: any }) => {
      return await apiRequest('/api/integrations', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      setSetupDialogOpen(false);
      toast({
        title: '✨ Divine Connection Established',
        description: 'Your integration has been successfully configured in the cosmic realm.',
      });
    },
    onError: (error: any) => {
      toast({
        title: '🔥 Connection Ritual Failed',
        description: error.message || 'Failed to establish the divine connection.',
        variant: 'destructive',
      });
    }
  });

  // Toggle workflow mutation
  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ workflowId, isActive }: { workflowId: string; isActive: boolean }) => {
      return await apiRequest(`/api/integrations/workflows/${workflowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations/workflows'] });
      toast({
        title: '⚡ Workflow Updated',
        description: 'Sacred automation ritual has been updated.',
      });
    }
  });

  const getIntegrationStatus = (integration: ExternalIntegration) => {
    if (integration.status === 'active' && integration.healthStatus === 'healthy') {
      return { color: 'bg-green-500', text: 'Divine Harmony', icon: CheckCircle };
    }
    if (integration.status === 'active' && integration.healthStatus === 'degraded') {
      return { color: 'bg-yellow-500', text: 'Cosmic Disturbance', icon: AlertTriangle };
    }
    if (integration.status === 'error' || integration.healthStatus === 'unhealthy') {
      return { color: 'bg-red-500', text: 'Ritual Disruption', icon: AlertTriangle };
    }
    return { color: 'bg-gray-500', text: 'Awaiting Activation', icon: Clock };
  };

  const getWorkflowCategoryColor = (category: string) => {
    const colors = {
      portfolio_showcase: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      achievements: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      design_system: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      component_optimization: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      quality_assurance: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      reporting: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (integrationsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Awakening the Divine Connections Chamber...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-divine-connections">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl  bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Divine Connections Chamber
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect Panel Profits with external realms and orchestrate sacred automation rituals 
            to enhance your mythological trading experience through divine integrations.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Sacred Overview</TabsTrigger>
            <TabsTrigger value="integrations" data-testid="tab-integrations">Divine Connections</TabsTrigger>
            <TabsTrigger value="workflows" data-testid="tab-workflows">Sacred Automations</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Cosmic Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm ">Active Connections</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl ">{integrations.filter((i: ExternalIntegration) => i.status === 'active').length}</div>
                  <p className="text-xs text-muted-foreground">Divine realms connected</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm ">Sacred Automations</CardTitle>
                  <Zap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl ">{workflows.filter((w: WorkflowAutomation) => w.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Active ritual workflows</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm ">Success Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl ">
                    {analytics.length > 0 
                      ? Math.round(analytics.reduce((acc: number, a: IntegrationAnalytics) => acc + a.successRate, 0) / analytics.length * 100)
                      : 100
                    }%
                  </div>
                  <p className="text-xs text-muted-foreground">Cosmic harmony achieved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm ">Total Executions</CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl ">
                    {workflows.reduce((acc: number, w: WorkflowAutomation) => acc + (w.totalExecutions || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Sacred rituals performed</p>
                </CardContent>
              </Card>
            </div>

            {/* Available Integrations */}
            <div className="space-y-4">
              <h2 className="text-2xl ">Available Divine Realms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrationTypes.map((type) => {
                  const existingIntegration = integrations.find((i: ExternalIntegration) => i.integrationName === type.id);
                  const IconComponent = type.icon;
                  
                  return (
                    <Card key={type.id} className="relative overflow-hidden group hover-elevate" data-testid={`integration-card-${type.id}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-gradient-to-br ${type.color} rounded-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {type.name}
                              {existingIntegration && (
                                <Badge variant="secondary" className="text-xs">
                                  Connected
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{type.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {type.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          {existingIntegration ? (
                            <div className="flex items-center gap-2">
                              {(() => {
                                const status = getIntegrationStatus(existingIntegration);
                                const StatusIcon = status.icon;
                                return (
                                  <>
                                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                    <StatusIcon className="w-4 h-4" />
                                    <span className="text-sm">{status.text}</span>
                                  </>
                                );
                              })()}
                            </div>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                setSelectedIntegration(type.id);
                                setSetupDialogOpen(true);
                              }}
                              data-testid={`button-setup-${type.id}`}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Establish Connection
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl ">Divine Connections</h2>
              <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-integration">
                    <Plus className="w-4 h-4 mr-2" />
                    New Connection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Establish Divine Connection</DialogTitle>
                    <DialogDescription>
                      Connect Panel Profits with an external realm to unlock sacred automation capabilities.
                    </DialogDescription>
                  </DialogHeader>
                  <IntegrationSetupWizard 
                    integrationType={selectedIntegration}
                    onComplete={(data) => createIntegrationMutation.mutate(data)}
                    isLoading={createIntegrationMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {integrations.map((integration: ExternalIntegration) => {
                const status = getIntegrationStatus(integration);
                const StatusIcon = status.icon;
                const integrationType = integrationTypes.find(t => t.id === integration.integrationName);
                const IconComponent = integrationType?.icon || Globe;

                return (
                  <Card key={integration.id} className="hover-elevate" data-testid={`integration-${integration.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-gradient-to-br ${integrationType?.color || 'from-gray-500 to-gray-600'} rounded-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle>{integration.displayName}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${status.color}`} />
                              <StatusIcon className="w-4 h-4" />
                              {status.text}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" data-testid={`button-settings-${integration.id}`}>
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-view-${integration.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {integration.lastSyncAt && (
                          <div className="text-sm text-muted-foreground">
                            Last synchronized: {new Date(integration.lastSyncAt).toLocaleString()}
                          </div>
                        )}
                        {integration.errorMessage && (
                          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {integration.errorMessage}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {integrations.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg  mb-2">No Divine Connections Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Establish your first connection to unlock the power of sacred automation.
                    </p>
                    <Button onClick={() => setSetupDialogOpen(true)} data-testid="button-first-connection">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Connection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl ">Sacred Automations</h2>
              <Button data-testid="button-new-workflow">
                <Plus className="w-4 h-4 mr-2" />
                New Automation
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {workflows.map((workflow: WorkflowAutomation) => (
                <Card key={workflow.id} className="hover-elevate" data-testid={`workflow-${workflow.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {workflow.name}
                          <Badge className={getWorkflowCategoryColor(workflow.category)}>
                            {workflow.category.replace('_', ' ')}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={workflow.isActive}
                          onCheckedChange={(checked) => 
                            toggleWorkflowMutation.mutate({ 
                              workflowId: workflow.id, 
                              isActive: checked 
                            })
                          }
                          data-testid={`switch-workflow-${workflow.id}`}
                        />
                        <Button variant="outline" size="sm" data-testid={`button-edit-workflow-${workflow.id}`}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm ">Executions</div>
                        <div className="text-2xl ">{workflow.totalExecutions || 0}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm ">Success Rate</div>
                        <div className="text-2xl  text-green-600">
                          {workflow.totalExecutions 
                            ? Math.round((workflow.successfulExecutions / workflow.totalExecutions) * 100) 
                            : 100
                          }%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm ">Last Run</div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.lastRunAt 
                            ? new Date(workflow.lastRunAt).toLocaleString() 
                            : 'Never'
                          }
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm ">Next Run</div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.nextRunAt 
                            ? new Date(workflow.nextRunAt).toLocaleString()
                            : 'On trigger'
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {workflows.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg  mb-2">No Sacred Automations</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first automation workflow to orchestrate divine rituals.
                    </p>
                    <Button data-testid="button-first-workflow">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Automation
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl ">Cosmic Insights</h2>
            
            {analytics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.map((analytic: IntegrationAnalytics) => (
                  <Card key={analytic.integrationName} data-testid={`analytics-${analytic.integrationName}`}>
                    <CardHeader>
                      <CardTitle className="capitalize">{analytic.integrationName} Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm ">API Calls</div>
                            <div className="text-2xl ">{analytic.totalApiCalls}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm ">Success Rate</div>
                            <div className="text-2xl  text-green-600">
                              {Math.round(analytic.successRate * 100)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Response Time</span>
                            <span>{analytic.averageResponseTime}ms</span>
                          </div>
                          <Progress value={Math.min(analytic.averageResponseTime / 10, 100)} />
                        </div>
                        
                        {analytic.errorCount > 0 && (
                          <div className="text-sm text-red-600">
                            {analytic.errorCount} errors in recent activity
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg  mb-2">No Analytics Available</h3>
                  <p className="text-muted-foreground">
                    Analytics will appear here once your integrations start processing data.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Integration Setup Wizard Component
function IntegrationSetupWizard({ 
  integrationType, 
  onComplete, 
  isLoading 
}: {
  integrationType: string | null;
  onComplete: (data: any) => void;
  isLoading: boolean;
}) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<Record<string, any>>({});

  const integration = integrationTypes.find(t => t.id === integrationType);

  if (!integration) {
    return <div>Please select an integration type</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      integrationType: integration.id,
      credentials,
      config
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg ">Configure {integration.name} Connection</h3>
        
        {/* Credentials section */}
        <div className="space-y-3">
          <Label htmlFor="api-key">API Key / Access Token</Label>
          <Input
            id="api-key"
            type="password"
            placeholder={`Enter your ${integration.name} API key`}
            value={credentials.apiKey || ''}
            onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
            required
            data-testid="input-api-key"
          />
        </div>

        {/* Integration-specific configuration */}
        {integration.id === 'webflow' && (
          <div className="space-y-3">
            <Label htmlFor="site-id">Site ID (Optional)</Label>
            <Input
              id="site-id"
              placeholder="Leave blank to create new site"
              value={config.siteId || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, siteId: e.target.value }))}
              data-testid="input-site-id"
            />
          </div>
        )}

        {integration.id === 'figma' && (
          <div className="space-y-3">
            <Label htmlFor="team-id">Team ID (Optional)</Label>
            <Input
              id="team-id"
              placeholder="Leave blank to use default team"
              value={config.teamId || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, teamId: e.target.value }))}
              data-testid="input-team-id"
            />
          </div>
        )}

        {integration.id === 'relume' && (
          <div className="space-y-3">
            <Label htmlFor="project-id">Project ID (Optional)</Label>
            <Input
              id="project-id"
              placeholder="Leave blank to create new project"
              value={config.projectId || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
              data-testid="input-project-id"
            />
          </div>
        )}

        {integration.id === 'zapier' && (
          <div className="space-y-3">
            <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
            <Input
              id="webhook-url"
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              value={config.webhookUrl || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
              data-testid="input-webhook-url"
            />
          </div>
        )}

        {/* Auto-sync option */}
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-sync"
            checked={config.autoSync || false}
            onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSync: checked }))}
            data-testid="switch-auto-sync"
          />
          <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !credentials.apiKey} data-testid="button-establish-connection">
          {isLoading ? 'Establishing...' : 'Establish Connection'}
        </Button>
      </div>
    </form>
  );
}