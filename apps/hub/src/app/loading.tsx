import { Loader2Icon } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <Loader2Icon className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
        <p className="text-gray-400">Loading amazing content...</p>
      </div>
    </div>
  );
}