"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LanguageIcon,
  PlayIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { CustomSelect } from "@/components/ui/custom-select";
import { Switch } from "@/components/ui/switch";

export default function SubtitlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [multiLanguage, setMultiLanguage] = useState(true);
  const [manualReview, setManualReview] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸", videos: 125 },
    { code: "es", name: "Spanish", flag: "🇪🇸", videos: 89 },
    { code: "fr", name: "French", flag: "🇫🇷", videos: 67 },
    { code: "de", name: "German", flag: "🇩🇪", videos: 45 },
    { code: "ja", name: "Japanese", flag: "🇯🇵", videos: 23 },
    { code: "ko", name: "Korean", flag: "🇰🇷", videos: 18 },
  ];

  const recentActivity = [
    { 
      id: 1,
      video: "AI Video Creation Tutorial", 
      language: "English", 
      status: "completed", 
      accuracy: "96%",
      duration: "24:35",
      timestamp: "2 hours ago"
    },
    { 
      id: 2,
      video: "Advanced Editing Techniques", 
      language: "Spanish", 
      status: "processing", 
      accuracy: "-",
      duration: "18:22",
      timestamp: "4 hours ago"
    },
    { 
      id: 3,
      video: "Content Strategy Guide", 
      language: "French", 
      status: "completed", 
      accuracy: "92%",
      duration: "31:18",
      timestamp: "1 day ago"
    },
    { 
      id: 4,
      video: "Tech Review #15", 
      language: "German", 
      status: "pending", 
      accuracy: "-",
      duration: "15:45",
      timestamp: "2 days ago"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
      case 'pending':
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-studio-background text-studio-text-primary font-afacad">
      <div className="p-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-xl h-20 border-b border-studio-border pb-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-studio-surface rounded-base border border-studio-border">
              <LanguageIcon className="w-6 h-6 text-studio-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-studio-text-primary">Subtitles & Captions</h1>
              <p className="text-sm text-studio-text-secondary mt-1">
                Manage multilingual subtitles and accessibility features
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-3 bg-studio-primary hover:bg-studio-primary/90 rounded-base text-sm font-medium transition-colors">
            <PlusIcon className="w-4 h-4" />
            Add Subtitles
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-xl"
        >
          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <DocumentTextIcon className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Videos with Subtitles</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">189</p>
            <p className="text-xs text-studio-text-muted mt-1">76% of total videos</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <GlobeAltIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Languages</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">12</p>
            <p className="text-xs text-studio-text-muted mt-1">Auto-generated available</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <SpeakerWaveIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Accuracy Rate</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">94%</p>
            <p className="text-xs text-studio-text-muted mt-1">AI transcription quality</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <ClockIcon className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Processing Queue</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">3</p>
            <p className="text-xs text-studio-text-muted mt-1">Videos in queue</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Language Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-studio-surface border border-studio-border rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-studio-text-primary mb-4">Language Distribution</h2>
            <div className="space-y-4">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-studio-background rounded-lg hover:bg-studio-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-studio-text-primary">{lang.name}</p>
                      <p className="text-xs text-studio-text-muted">{lang.code.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-studio-text-primary">{lang.videos}</p>
                    <p className="text-xs text-studio-text-muted">videos</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-studio-surface border border-studio-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-studio-text-primary">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-studio-text-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-24 px-2 py-1 bg-studio-background border border-studio-border rounded text-xs focus:outline-none focus:border-studio-primary"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-studio-background rounded-lg hover:bg-studio-primary/5 transition-colors"
                >
                  <div className="w-16 h-10 bg-studio-primary rounded flex items-center justify-center flex-shrink-0">
                    <PlayIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-studio-text-primary truncate">{item.video}</h3>
                    <p className="text-xs text-studio-text-muted">{item.language} • {item.duration}</p>
                    <p className="text-xs text-studio-text-muted">{item.timestamp}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusIcon(item.status)}
                    {item.accuracy !== '-' && (
                      <span className="text-xs text-studio-text-muted">{item.accuracy}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-studio-surface border border-studio-border rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-studio-primary" />
              <h2 className="text-lg font-semibold text-studio-text-primary">Subtitle Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <CustomSelect
                  label="Default Language"
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "de", label: "German" },
                    { value: "it", label: "Italian" },
                    { value: "pt", label: "Portuguese" },
                    { value: "ja", label: "Japanese" },
                    { value: "ko", label: "Korean" }
                  ]}
                  defaultValue="en"
                  placeholder="Select language"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-studio-background rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-studio-text-primary">Auto-generate subtitles</p>
                    <p className="text-xs text-studio-text-muted">Create subtitles for new uploads</p>
                  </div>
                  <Switch checked={autoGenerate} onCheckedChange={setAutoGenerate} />
                </div>

                <div className="flex items-center justify-between p-3 bg-studio-background rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-studio-text-primary">Multiple languages</p>
                    <p className="text-xs text-studio-text-muted">Generate in multiple languages</p>
                  </div>
                  <Switch checked={multiLanguage} onCheckedChange={setMultiLanguage} />
                </div>

                <div className="flex items-center justify-between p-3 bg-studio-background rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-studio-text-primary">Manual review</p>
                    <p className="text-xs text-studio-text-muted">Require approval before publishing</p>
                  </div>
                  <Switch checked={manualReview} onCheckedChange={setManualReview} />
                </div>
              </div>

              <div className="pt-4 border-t border-studio-border">
                <button className="w-full bg-gradient-to-r from-studio-primary to-purple-600 hover:from-studio-primary/90 hover:to-purple-600/90 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200">
                  Bulk Generate Subtitles
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}