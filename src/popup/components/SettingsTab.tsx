import React from 'react'

interface SettingsTabProps {
  currentUser: any
  onLogout: () => void
}

function SettingsTab({
  currentUser,
  onLogout
}: SettingsTabProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Account Settings</h3>
      
      {/* User Profile Info */}
      <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
          Profile Information
        </h4>
        
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Name:</span>
          <div style={{ fontSize: '14px', color: '#111827', marginTop: '2px' }}>
            {currentUser?.name || 'Not available'}
          </div>
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Email:</span>
          <div style={{ fontSize: '14px', color: '#111827', marginTop: '2px' }}>
            {currentUser?.email || 'Not available'}
          </div>
        </div>
        
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Member since:</span>
          <div style={{ fontSize: '14px', color: '#111827', marginTop: '2px' }}>
            {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Not available'}
          </div>
        </div>
      </div>

      {/* Teams */}
      {currentUser?.teams && currentUser.teams.length > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Your Teams
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {currentUser.teams.map((team: any) => (
              <span
                key={team.id}
                style={{
                  padding: '4px 8px',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                {team.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Domains */}
      {currentUser?.domains && currentUser.domains.length > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Your Domains
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {currentUser.domains.map((domain: any) => (
              <span
                key={domain.id}
                style={{
                  padding: '4px 8px',
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 500
                }}
              >
                {domain.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
        
        <div style={{ marginTop: '12px', padding: '12px', background: '#f3f4f6', borderRadius: '6px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          PromptStack Extension v0.1.0
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
