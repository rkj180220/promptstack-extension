import React from 'react'
import { Prompt, Comment } from '../../types'
import PromptCard from './PromptCard'

type SortOption = 'top' | 'new' | 'used'

interface BrowseTabProps {
  prompts: Prompt[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  tagFilter: string
  setTagFilter: (filter: string) => void
  selectedPrompt: Prompt | null
  selectPrompt: (prompt: Prompt) => void
  comments: Comment[]
  newComment: string
  setNewComment: (comment: string) => void
  userRating: number
  onCopy: (prompt: Prompt) => void
  onInsert: (prompt: Prompt) => void
  onRate: (promptId: string, stars: number) => void
  onAddComment: (promptId: string) => void
}

function BrowseTab({
  prompts,
  loading,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  tagFilter,
  setTagFilter,
  selectedPrompt,
  selectPrompt,
  comments,
  newComment,
  setNewComment,
  userRating,
  onCopy,
  onInsert,
  onRate,
  onAddComment
}: BrowseTabProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Filters */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
        <input
          type="text"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '8px',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{ flex: 1, padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
          >
            <option value="used">Most Used</option>
            <option value="top">Top Rated</option>
            <option value="new">Newest</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tags..."
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            style={{ flex: 1, padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            Loading...
          </div>
        ) : prompts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            {searchQuery ? 'No prompts found' : 'No prompts available'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isSelected={selectedPrompt?.id === prompt.id}
                onSelect={() => selectPrompt(prompt)}
                comments={comments}
                newComment={newComment}
                onNewCommentChange={setNewComment}
                userRating={userRating}
                onCopy={onCopy}
                onInsert={onInsert}
                onRate={onRate}
                onAddComment={onAddComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseTab
