"use client";

import { useState } from 'react';
import { useComments } from '@/hooks/api/use-comments';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUpIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useUser } from '@/hooks/api/use-user';

interface VideoCommentsProps {
  videoId: string;
}

export function VideoComments({ videoId }: VideoCommentsProps) {
  const { data: user } = useUser();
  const { data: comments, isLoading, refetch } = useComments(videoId);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleSubmitComment = async (parentId?: string) => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          parentId,
        }),
      });

      if (response.ok) {
        setCommentText('');
        setReplyingTo(null);
        refetch();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
      refetch();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      </div>
    );
  }

  const topLevelComments = comments?.filter(c => !c.parentId) || [];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        {comments?.length || 0} Comments
      </h3>

      {/* Comment Form */}
      {user ? (
        <div className="flex gap-3 mb-6">
          <Avatar src={user.image} alt={user.name} size="sm" />
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommentText('')}
                disabled={!commentText.trim() || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSubmitComment()}
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 mb-2">Sign in to comment</p>
          <Button variant="primary" size="sm">Sign In</Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={comments?.filter(c => c.parentId === comment.id) || []}
            onLike={handleLikeComment}
            onReply={(id) => setReplyingTo(id)}
            replyingTo={replyingTo}
            onSubmitReply={() => handleSubmitComment(comment.id)}
            isExpanded={expandedReplies.has(comment.id)}
            onToggleExpand={() => toggleReplies(comment.id)}
          />
        ))}
      </div>

      {topLevelComments.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  replyingTo: string | null;
  onSubmitReply: (content: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function CommentItem({
  comment,
  replies,
  onLike,
  onReply,
  replyingTo,
  onSubmitReply,
  isExpanded,
  onToggleExpand,
}: CommentItemProps) {
  const [replyText, setReplyText] = useState('');
  const { data: user } = useUser();

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onSubmitReply(replyText);
      setReplyText('');
      onReply('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Avatar
          src={comment.user?.image}
          alt={comment.user?.name || 'User'}
          size="sm"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.user?.name || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              <ThumbsUpIcon className="w-4 h-4" />
              <span>{comment.likes || 0}</span>
            </button>
            {user && (
              <button
                onClick={() => onReply(comment.id)}
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && user && (
        <div className="ml-12 mt-2">
          <div className="flex gap-3">
            <Avatar src={user.image} alt={user.name} size="xs" />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add a reply..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setReplyText('');
                    onReply('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-12">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors mb-2"
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </button>
          
          {isExpanded && (
            <div className="space-y-3">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Avatar
                    src={reply.user?.image}
                    alt={reply.user?.name || 'User'}
                    size="xs"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {reply.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                    <button
                      onClick={() => onLike(reply.id)}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors mt-1"
                    >
                      <ThumbsUpIcon className="w-3 h-3" />
                      <span>{reply.likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}