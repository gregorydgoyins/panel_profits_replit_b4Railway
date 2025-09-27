import { DashboardHeader } from '../DashboardHeader';

export default function DashboardHeaderExample() {
  return (
    <DashboardHeader 
      marketSentiment={0.025}
      marketIndex={14750}
      currentTime={new Date()}
      aiConfidence={87.5}
    />
  );
}