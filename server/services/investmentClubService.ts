import { storage } from '../storage.js';
import { notificationService } from './notificationService.js';
import { orderMatchingEngine } from './orderMatchingEngine.js';
import type {
  InvestmentClub, InsertInvestmentClub,
  ClubMembership, InsertClubMembership,
  ClubProposal, InsertClubProposal,
  ClubVote, InsertClubVote,
  ClubActivityLog, InsertClubActivityLog,
  User, Portfolio, Order
} from '@shared/schema.js';
import { eq, and, gte, lte } from 'drizzle-orm';

export interface ClubEligibilityResult {
  eligible: boolean;
  reason?: string;
  userLevel?: string;
  subscriberCount?: number;
}

export interface ProposalExecutionResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export interface PerformanceMetrics {
  monthlyReturns: number[];
  consecutivePositiveMonths: number;
  consecutiveNegativeMonths: number;
  shouldSuspend: boolean;
  shouldDissolve: boolean;
}

export class InvestmentClubService {
  private static instance: InvestmentClubService;

  private constructor() {}

  static getInstance(): InvestmentClubService {
    if (!InvestmentClubService.instance) {
      InvestmentClubService.instance = new InvestmentClubService();
    }
    return InvestmentClubService.instance;
  }

  /**
   * Check if user is eligible to create an investment club
   */
  async checkClubEligibility(userId: string, memberUserIds: string[]): Promise<ClubEligibilityResult> {
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return { eligible: false, reason: 'User not found' };
      }

      const userProgress = await storage.getUserPathwayProgress(userId);
      if (!userProgress || !userProgress.currentLevelId) {
        return { 
          eligible: false, 
          reason: 'Must complete career pathway progression. Minimum level: Office Manager' 
        };
      }

      const currentLevel = await storage.getCareerPathwayLevel(userProgress.currentLevelId);
      if (!currentLevel) {
        return { eligible: false, reason: 'Career level not found' };
      }

      const officeManagerLevels = ['tier2', 'tier3', 'tier4'];
      const isOfficeManagerOrHigher = 
        currentLevel.pathway === 'family_office' && officeManagerLevels.includes(currentLevel.level);

      if (!isOfficeManagerOrHigher) {
        return { 
          eligible: false, 
          reason: `Office Manager level or higher required. Current: ${currentLevel.level}`,
          userLevel: currentLevel.level
        };
      }

      const allMemberIds = [userId, ...memberUserIds];
      let subscriberCount = 0;

      for (const memberId of allMemberIds) {
        const member = await storage.getUser(memberId);
        if (member && ['pro', 'elite'].includes(member.subscriptionTier)) {
          subscriberCount++;
        }
      }

      if (subscriberCount < 3) {
        return { 
          eligible: false, 
          reason: `At least 3 subscribers required. Current: ${subscriberCount}`,
          subscriberCount 
        };
      }

      return { 
        eligible: true,
        userLevel: currentLevel.level,
        subscriberCount
      };
    } catch (error) {
      console.error('Error checking club eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility' };
    }
  }

  /**
   * Create a new investment club
   */
  async createClub(
    ownerId: string, 
    clubData: Omit<InsertInvestmentClub, 'ownerId'>,
    initialMembers: string[] = []
  ): Promise<InvestmentClub | null> {
    try {
      const eligibility = await this.checkClubEligibility(ownerId, initialMembers);
      if (!eligibility.eligible) {
        throw new Error(eligibility.reason || 'Not eligible to create club');
      }

      const club = await storage.createInvestmentClub({
        ...clubData,
        ownerId,
        status: 'active',
        monthlyReturns: [],
        consecutivePositiveMonths: 0
      });

      const portfolio = await storage.createPortfolio({
        userId: ownerId,
        name: `${club.name} Portfolio`,
        description: `Dedicated portfolio for ${club.name}`,
        portfolioType: 'club',
        cashBalance: '100000.00',
        initialCashAllocation: '100000.00'
      });

      await storage.createClubPortfolio({
        clubId: club.id,
        portfolioId: portfolio.id,
        totalValue: '100000.00',
        cashBalance: '100000.00'
      });

      const totalMembers = initialMembers.length + 1;
      const sharePercentage = (100 / totalMembers).toFixed(2);

      await storage.createClubMembership({
        clubId: club.id,
        userId: ownerId,
        role: 'owner',
        sharePercentage,
        status: 'active'
      });

      for (const memberId of initialMembers) {
        await storage.createClubMembership({
          clubId: club.id,
          userId: memberId,
          role: 'member',
          sharePercentage,
          status: 'pending'
        });

        await notificationService.sendNotification({
          userId: memberId,
          type: 'club_invite',
          title: 'Investment Club Invitation',
          message: `You've been invited to join ${club.name}`,
          metadata: { clubId: club.id, clubName: club.name },
          priority: 'medium'
        });
      }

      await storage.createClubActivityLog({
        clubId: club.id,
        actionType: 'club_created',
        userId: ownerId,
        details: { clubName: club.name, initialMembers: initialMembers.length }
      });

      console.log(`✅ Investment club created: ${club.name} (${club.id})`);
      return club;
    } catch (error) {
      console.error('Error creating investment club:', error);
      throw error;
    }
  }

  /**
   * Invite a member to the club
   */
  async inviteMember(clubId: string, inviterId: string, inviteeId: string): Promise<boolean> {
    try {
      const club = await storage.getInvestmentClub(clubId);
      if (!club) throw new Error('Club not found');

      const inviterMembership = await storage.getClubMembership(clubId, inviterId);
      if (!inviterMembership || !['owner', 'admin'].includes(inviterMembership.role)) {
        throw new Error('Only club owner or admin can invite members');
      }

      const existingMembership = await storage.getClubMembership(clubId, inviteeId);
      if (existingMembership) {
        throw new Error('User is already a member or has pending invitation');
      }

      const activeMembers = await storage.getClubMemberships(clubId, 'active');
      const sharePercentage = (100 / (activeMembers.length + 1)).toFixed(2);

      await storage.createClubMembership({
        clubId,
        userId: inviteeId,
        role: 'member',
        sharePercentage,
        status: 'pending'
      });

      await notificationService.sendNotification({
        userId: inviteeId,
        type: 'club_invite',
        title: 'Investment Club Invitation',
        message: `You've been invited to join ${club.name}`,
        metadata: { clubId, clubName: club.name },
        priority: 'medium'
      });

      await storage.createClubActivityLog({
        clubId,
        actionType: 'member_invited',
        userId: inviterId,
        details: { inviteeId, clubName: club.name }
      });

      return true;
    } catch (error) {
      console.error('Error inviting member:', error);
      throw error;
    }
  }

  /**
   * Accept club invitation (join club)
   */
  async acceptInvitation(clubId: string, userId: string): Promise<boolean> {
    try {
      const membership = await storage.getClubMembership(clubId, userId);
      if (!membership || membership.status !== 'pending') {
        throw new Error('No pending invitation found');
      }

      await storage.updateClubMembership(membership.id, { status: 'active' });

      const activeMembers = await storage.getClubMemberships(clubId, 'active');
      await this.recalculateSharePercentages(clubId, activeMembers);

      await storage.createClubActivityLog({
        clubId,
        actionType: 'member_joined',
        userId,
        details: { totalMembers: activeMembers.length }
      });

      const club = await storage.getInvestmentClub(clubId);
      await notificationService.sendNotification({
        userId,
        type: 'club_joined',
        title: 'Welcome to the Club',
        message: `You are now a member of ${club?.name}`,
        metadata: { clubId, clubName: club?.name },
        priority: 'high'
      });

      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  /**
   * Remove a member from the club
   */
  async removeMember(clubId: string, removerId: string, memberIdToRemove: string): Promise<boolean> {
    try {
      const removerMembership = await storage.getClubMembership(clubId, removerId);
      if (!removerMembership || !['owner', 'admin'].includes(removerMembership.role)) {
        throw new Error('Only owner or admin can remove members');
      }

      const membershipToRemove = await storage.getClubMembership(clubId, memberIdToRemove);
      if (!membershipToRemove) {
        throw new Error('Member not found');
      }

      await storage.updateClubMembership(membershipToRemove.id, { 
        status: 'removed',
        leftAt: new Date()
      });

      const activeMembers = await storage.getClubMemberships(clubId, 'active');
      await this.recalculateSharePercentages(clubId, activeMembers);

      await storage.createClubActivityLog({
        clubId,
        actionType: 'member_removed',
        userId: removerId,
        details: { removedMemberId: memberIdToRemove, remainingMembers: activeMembers.length }
      });

      const club = await storage.getInvestmentClub(clubId);
      if (activeMembers.length < (club?.minMembers || 3)) {
        await this.autoDissolveClub(clubId, 'insufficient_members');
      }

      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  /**
   * Leave club voluntarily
   */
  async leaveClub(clubId: string, userId: string): Promise<boolean> {
    try {
      const club = await storage.getInvestmentClub(clubId);
      if (!club) throw new Error('Club not found');

      const membership = await storage.getClubMembership(clubId, userId);
      if (!membership) throw new Error('Not a member of this club');

      if (membership.role === 'owner') {
        throw new Error('Owner cannot leave. Transfer ownership or dissolve the club first.');
      }

      await storage.updateClubMembership(membership.id, { 
        status: 'left',
        leftAt: new Date()
      });

      const activeMembers = await storage.getClubMemberships(clubId, 'active');
      await this.recalculateSharePercentages(clubId, activeMembers);

      await storage.createClubActivityLog({
        clubId,
        actionType: 'member_left',
        userId,
        details: { remainingMembers: activeMembers.length }
      });

      if (activeMembers.length < (club.minMembers || 3)) {
        await this.autoDissolveClub(clubId, 'insufficient_members');
      }

      return true;
    } catch (error) {
      console.error('Error leaving club:', error);
      throw error;
    }
  }

  /**
   * Recalculate share percentages after membership changes
   */
  private async recalculateSharePercentages(clubId: string, activeMembers: ClubMembership[]): Promise<void> {
    const sharePercentage = (100 / activeMembers.length).toFixed(2);
    for (const member of activeMembers) {
      await storage.updateClubMembership(member.id, { sharePercentage });
    }
  }

  /**
   * Create a proposal
   */
  async createProposal(
    clubId: string, 
    proposerId: string, 
    proposalData: Omit<InsertClubProposal, 'clubId' | 'proposerId'>
  ): Promise<ClubProposal> {
    try {
      const membership = await storage.getClubMembership(clubId, proposerId);
      if (!membership || membership.status !== 'active') {
        throw new Error('Only active members can create proposals');
      }

      const activeMembers = await storage.getClubMemberships(clubId, 'active');
      const votesNeeded = Math.ceil(activeMembers.length / 2);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const proposal = await storage.createClubProposal({
        ...proposalData,
        clubId,
        proposerId,
        votesFor: 0,
        votesAgainst: 0,
        votesNeeded,
        status: 'pending',
        expiresAt
      });

      await storage.createClubActivityLog({
        clubId,
        actionType: 'proposal_created',
        userId: proposerId,
        details: { 
          proposalId: proposal.id, 
          proposalType: proposal.proposalType,
          votesNeeded 
        }
      });

      for (const member of activeMembers) {
        if (member.userId !== proposerId) {
          await notificationService.sendNotification({
            userId: member.userId,
            type: 'club_proposal',
            title: 'New Club Proposal',
            message: `New ${proposal.proposalType} proposal requires your vote`,
            metadata: { clubId, proposalId: proposal.id },
            priority: 'high'
          });
        }
      }

      return proposal;
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  /**
   * Cast a vote on a proposal
   */
  async castVote(
    proposalId: string, 
    userId: string, 
    vote: 'for' | 'against' | 'abstain'
  ): Promise<boolean> {
    try {
      const proposal = await storage.getClubProposal(proposalId);
      if (!proposal) throw new Error('Proposal not found');

      if (proposal.status !== 'pending') {
        throw new Error('Proposal is not open for voting');
      }

      if (proposal.expiresAt && new Date() > proposal.expiresAt) {
        await storage.updateClubProposal(proposalId, { status: 'expired' });
        throw new Error('Proposal has expired');
      }

      const membership = await storage.getClubMembership(proposal.clubId, userId);
      if (!membership || membership.status !== 'active') {
        throw new Error('Only active members can vote');
      }

      const existingVote = await storage.getClubVote(proposalId, userId);
      if (existingVote) {
        throw new Error('Already voted on this proposal');
      }

      await storage.createClubVote({
        proposalId,
        userId,
        vote
      });

      const updatedVotesFor = vote === 'for' ? (proposal.votesFor || 0) + 1 : proposal.votesFor || 0;
      const updatedVotesAgainst = vote === 'against' ? (proposal.votesAgainst || 0) + 1 : proposal.votesAgainst || 0;

      await storage.updateClubProposal(proposalId, {
        votesFor: updatedVotesFor,
        votesAgainst: updatedVotesAgainst
      });

      await storage.createClubActivityLog({
        clubId: proposal.clubId,
        actionType: 'vote_cast',
        userId,
        details: { proposalId, vote, votesFor: updatedVotesFor, votesAgainst: updatedVotesAgainst }
      });

      if (updatedVotesFor >= (proposal.votesNeeded || 0)) {
        await this.executeProposal(proposalId);
      }

      return true;
    } catch (error) {
      console.error('Error casting vote:', error);
      throw error;
    }
  }

  /**
   * Execute a proposal when it passes
   */
  async executeProposal(proposalId: string): Promise<ProposalExecutionResult> {
    try {
      const proposal = await storage.getClubProposal(proposalId);
      if (!proposal) {
        return { success: false, error: 'Proposal not found' };
      }

      if (proposal.status !== 'pending') {
        return { success: false, error: 'Proposal already executed or rejected' };
      }

      const clubPortfolio = await storage.getClubPortfolioByClubId(proposal.clubId);
      if (!clubPortfolio) {
        return { success: false, error: 'Club portfolio not found' };
      }

      const club = await storage.getInvestmentClub(proposal.clubId);
      if (!club) {
        return { success: false, error: 'Club not found' };
      }

      let executionResult: ProposalExecutionResult = { success: true };

      if (proposal.proposalType === 'buy' || proposal.proposalType === 'sell') {
        if (!proposal.assetId || !proposal.quantity || !proposal.targetPrice) {
          return { success: false, error: 'Missing trade parameters' };
        }

        const order = await storage.createOrder({
          userId: club.ownerId,
          portfolioId: clubPortfolio.portfolioId,
          assetId: proposal.assetId,
          type: proposal.proposalType,
          side: proposal.proposalType,
          orderType: 'limit',
          quantity: proposal.quantity.toString(),
          price: proposal.targetPrice,
          status: 'pending'
        });

        await orderMatchingEngine.processOrders();

        executionResult.orderId = order.id;
      } else if (proposal.proposalType === 'transfer_funds') {
        if (!proposal.transferAmount) {
          return { success: false, error: 'Transfer amount not specified' };
        }
      } else if (proposal.proposalType === 'change_rules') {
        console.log('Change rules proposal executed (rules system not yet implemented)');
      }

      await storage.updateClubProposal(proposalId, {
        status: 'executed',
        executedAt: new Date()
      });

      await storage.createClubActivityLog({
        clubId: proposal.clubId,
        actionType: 'proposal_executed',
        userId: club.ownerId,
        details: { 
          proposalId, 
          proposalType: proposal.proposalType,
          orderId: executionResult.orderId 
        }
      });

      const activeMembers = await storage.getClubMemberships(proposal.clubId, 'active');
      for (const member of activeMembers) {
        await notificationService.sendNotification({
          userId: member.userId,
          type: 'proposal_executed',
          title: 'Proposal Executed',
          message: `${proposal.proposalType} proposal has been executed`,
          metadata: { clubId: proposal.clubId, proposalId },
          priority: 'high'
        });
      }

      return executionResult;
    } catch (error) {
      console.error('Error executing proposal:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Calculate club performance metrics
   */
  async calculatePerformanceMetrics(clubId: string): Promise<PerformanceMetrics | null> {
    try {
      const club = await storage.getInvestmentClub(clubId);
      if (!club) return null;

      const clubPortfolio = await storage.getClubPortfolioByClubId(clubId);
      if (!clubPortfolio) return null;

      const monthlyReturns = club.monthlyReturns || [];
      
      let consecutivePositive = 0;
      let consecutiveNegative = 0;

      for (let i = monthlyReturns.length - 1; i >= 0; i--) {
        if (monthlyReturns[i] > 0) {
          consecutivePositive++;
          consecutiveNegative = 0;
        } else if (monthlyReturns[i] < 0) {
          consecutiveNegative++;
          consecutivePositive = 0;
        } else {
          break;
        }
      }

      const shouldSuspend = consecutiveNegative >= 3;
      const shouldDissolve = club.status === 'suspended' && 
                            club.suspendedSince && 
                            ((new Date().getTime() - new Date(club.suspendedSince).getTime()) / (1000 * 60 * 60 * 24 * 30)) >= 6;

      return {
        monthlyReturns,
        consecutivePositiveMonths: consecutivePositive,
        consecutiveNegativeMonths: consecutiveNegative,
        shouldSuspend,
        shouldDissolve
      };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return null;
    }
  }

  /**
   * Auto-dissolve club
   */
  async autoDissolveClub(clubId: string, reason: string): Promise<boolean> {
    try {
      const club = await storage.getInvestmentClub(clubId);
      if (!club) throw new Error('Club not found');

      const clubPortfolio = await storage.getClubPortfolioByClubId(clubId);
      if (clubPortfolio) {
        const holdings = await storage.getPortfolioHoldings(clubPortfolio.portfolioId);
        for (const holding of holdings) {
          await storage.createOrder({
            userId: club.ownerId,
            portfolioId: clubPortfolio.portfolioId,
            assetId: holding.assetId,
            type: 'sell',
            side: 'sell',
            orderType: 'market',
            quantity: holding.quantity,
            status: 'pending'
          });
        }

        await orderMatchingEngine.processOrders();
      }

      const activeMembers = await storage.getClubMemberships(clubId, 'active');
      const portfolio = await storage.getPortfolio(clubPortfolio?.portfolioId || '');
      
      if (portfolio) {
        const cashPerMember = parseFloat(portfolio.cashBalance || '0') / activeMembers.length;
        
        for (const member of activeMembers) {
          await notificationService.sendNotification({
            userId: member.userId,
            type: 'club_dissolved',
            title: 'Investment Club Dissolved',
            message: `${club.name} has been dissolved. Your share: $${cashPerMember.toFixed(2)}`,
            metadata: { clubId, reason, distributedAmount: cashPerMember },
            priority: 'urgent'
          });
        }
      }

      await storage.updateInvestmentClub(clubId, {
        status: 'dissolved',
        dissolvedAt: new Date()
      });

      await storage.createClubActivityLog({
        clubId,
        actionType: 'club_dissolved',
        userId: club.ownerId,
        details: { reason, totalMembers: activeMembers.length }
      });

      console.log(`❌ Investment club dissolved: ${club.name} (Reason: ${reason})`);
      return true;
    } catch (error) {
      console.error('Error auto-dissolving club:', error);
      throw error;
    }
  }

  /**
   * Dissolve club (owner action)
   */
  async dissolveClub(clubId: string, ownerId: string): Promise<boolean> {
    try {
      const club = await storage.getInvestmentClub(clubId);
      if (!club) throw new Error('Club not found');

      if (club.ownerId !== ownerId) {
        throw new Error('Only the club owner can dissolve the club');
      }

      return await this.autoDissolveClub(clubId, 'owner_dissolved');
    } catch (error) {
      console.error('Error dissolving club:', error);
      throw error;
    }
  }
}

export const investmentClubService = InvestmentClubService.getInstance();
