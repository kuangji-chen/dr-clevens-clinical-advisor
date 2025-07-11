import ConversationalAdvisor from '@/components/ConversationalAdvisor';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <ConversationalAdvisor />
    </ErrorBoundary>
  );
}
