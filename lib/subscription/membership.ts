export const MEMBERSHIP_TIERS = {
  FREE: {
    id: 'free',
    name: 'Visitor',
    price: 0,
    priceId: null,
    features: [
      'Browse public case files',
      'Read case summaries',
      'View featured cases'
    ]
  },
  INVESTIGATOR: {
    id: 'investigator',
    name: 'Investigator',
    price: 500, // $5.00/month
    priceId: 'price_investigator_monthly',
    features: [
      'Access to member chat',
      'Full case files with details',
      'Audio narration of cases',
      'Community discussions',
      'Download case file PDFs'
    ]
  }
} as const;

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;

export function isMembershipTier(tier: string): tier is MembershipTier {
  return tier in MEMBERSHIP_TIERS;
}

export function getTierFeatures(tier: MembershipTier) {
  return MEMBERSHIP_TIERS[tier].features;
}

export function canAccessFeature(userTier: MembershipTier, requiredTier: MembershipTier): boolean {
  const tierHierarchy = ['FREE', 'INVESTIGATOR'] as const;
  const userTierIndex = tierHierarchy.indexOf(userTier);
  const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex;
} 