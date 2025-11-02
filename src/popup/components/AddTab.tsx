import React from 'react'
import { Team, Domain, VisibilityMode } from '../../types'

interface AddTabProps {
  newPrompt: {
    title: string
    description: string
    content: string
    tags: string
    domain_ids: string[]
    visibility_mode: VisibilityMode
    shares: { team_ids: string[], domain_ids: string[], user_ids: string[] }
  }
  setNewPrompt: (prompt: any) => void
  teams: Team[]
  domains: Domain[]
  onSubmit: (e: React.FormEvent) => void
}

function AddTab({
  newPrompt,
  setNewPrompt,
  teams,
  domains,
  onSubmit
}: AddTabProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Title *
          </label>
          <input
            type="text"
            value={newPrompt.title}
            onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Description
          </label>
          <textarea
            value={newPrompt.description}
            onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
            style={{ width: '100%', height: '60px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Content *
          </label>
          <textarea
            value={newPrompt.content}
            onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
            style={{ width: '100%', height: '120px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={newPrompt.tags}
            onChange={(e) => setNewPrompt({...newPrompt, tags: e.target.value})}
            placeholder="e.g., coding, analysis, creative"
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Domains
          </label>
          <select
            multiple
            value={newPrompt.domain_ids}
            onChange={(e) => setNewPrompt({...newPrompt, domain_ids: Array.from(e.target.selectedOptions, option => option.value)})}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', height: '80px', boxSizing: 'border-box' }}
          >
            {domains.map(domain => (
              <option key={domain.id} value={domain.id}>{domain.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Visibility
          </label>
          <select
            value={newPrompt.visibility_mode}
            onChange={(e) => setNewPrompt({...newPrompt, visibility_mode: e.target.value as VisibilityMode})}
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
          >
            <option value="ORG">Organization</option>
            <option value="TEAM">Team</option>
            <option value="DOMAIN">Domain</option>
            <option value="PRIVATE">Private</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>

        {(newPrompt.visibility_mode === 'TEAM' || newPrompt.visibility_mode === 'CUSTOM') && (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              Share with Teams
            </label>
            <select
              multiple
              value={newPrompt.shares.team_ids}
              onChange={(e) => setNewPrompt({
                ...newPrompt, 
                shares: {
                  ...newPrompt.shares,
                  team_ids: Array.from(e.target.selectedOptions, option => option.value)
                }
              })}
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', height: '60px', boxSizing: 'border-box' }}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Add Prompt
        </button>
      </form>
    </div>
  )
}

export default AddTab
