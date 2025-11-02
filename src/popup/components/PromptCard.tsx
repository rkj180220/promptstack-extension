import React from 'react'
import { Prompt, Comment } from '../../types'

interface PromptCardProps {
  prompt: Prompt
  isSelected: boolean
  onSelect: () => void
  comments: Comment[]
  newComment: string
  onNewCommentChange: (comment: string) => void
  userRating: number
  onCopy: (prompt: Prompt) => void
  onInsert: (prompt: Prompt) => void
  onRate: (promptId: string, stars: number) => void
  onAddComment: (promptId: string) => void
}

function PromptCard({
  prompt,
  isSelected,
  onSelect,
  comments,
  newComment,
  onNewCommentChange,
  userRating,
  onCopy,
  onInsert,
  onRate,
  onAddComment
}: PromptCardProps) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        background: isSelected ? '#eff6ff' : '#fff',
        borderColor: isSelected ? '#3b82f6' : '#e5e7eb'
      }}
      onClick={onSelect}
    >
      <div style={{
        fontWeight: 600,
        fontSize: '14px',
        color: '#111827',
        marginBottom: '4px'
      }}>
        {prompt.title}
      </div>

      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '8px'
      }}>
        {prompt.description || 'No description'}
      </div>

      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
        Uses: {prompt.use_count} | Rating: {prompt.avg_rating?.toFixed(1) || 'No ratings'} ({prompt.rating_count})
      </div>

      {isSelected && (
        <div>
          <div style={{
            background: '#f3f4f6',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            marginBottom: '8px',
            maxHeight: '80px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {prompt.content}
          </div>

          {/* Tags and Domains */}
          {(prompt.tags.length > 0 || prompt.classified_domains.length > 0) && (
            <div style={{ marginBottom: '8px', fontSize: '11px' }}>
              {prompt.tags.length > 0 && (
                <div style={{ marginBottom: '4px' }}>
                  <strong>Tags:</strong> {prompt.tags.map(t => t.name).join(', ')}
                </div>
              )}
              {prompt.classified_domains.length > 0 && (
                <div>
                  <strong>Domains:</strong> {prompt.classified_domains.map(d => d.name).join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCopy(prompt)
              }}
              style={{
                flex: 1,
                padding: '6px 12px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onInsert(prompt)
              }}
              style={{
                flex: 1,
                padding: '6px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Insert
            </button>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>Rate this prompt:</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRate(prompt.id, star)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: star <= userRating ? '#f59e0b' : '#d1d5db'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Comments:</div>
            <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '6px' }}>
              {comments.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>No comments yet</div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} style={{ fontSize: '11px', marginBottom: '4px', padding: '4px', background: '#f9fafb', borderRadius: '3px' }}>
                    <div style={{ fontWeight: 600 }}>{comment.user_name || comment.user_id}</div>
                    <div>{comment.text}</div>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => onNewCommentChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                style={{ flex: 1, padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '11px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation()
                    onAddComment(prompt.id)
                  }
                }}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddComment(prompt.id)
                }}
                style={{
                  padding: '4px 8px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromptCard
