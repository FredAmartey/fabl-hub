import Link from 'next/link';
import { FileQuestionIcon } from 'lucide-react';
import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center">
            <FileQuestionIcon className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="primary">
              Go home
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline">
              Explore videos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}