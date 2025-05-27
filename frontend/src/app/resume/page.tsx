import PageWrapper from '@/components/PageWrapper';
import ResumeUploader from './components/ResumeUploader';

export default function ResumePage() {
  return (
    <PageWrapper className="flex flex-col w-full">
      <h1 className="font-bold text-3xl mb-10">Resume</h1>
      <ResumeUploader />
    </PageWrapper>
  );
}
