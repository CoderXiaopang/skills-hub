import { memo, useCallback, useRef, useState, useEffect } from 'react'
import { Box, Copy, Eye, Folder, Github, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { TFunction } from 'i18next'
import type { ManagedSkill, ToolOption } from './types'

type GithubInfo = {
  label: string
  href: string
}

type SkillCardProps = {
  skill: ManagedSkill
  remark: string
  installedTools: ToolOption[]
  loading: boolean
  getGithubInfo: (url: string | null | undefined) => GithubInfo | null
  getSkillSourceLabel: (skill: ManagedSkill) => string
  formatRelative: (ms: number | null | undefined) => string
  onUpdate: (skill: ManagedSkill) => void
  onDelete: (skillId: string) => void
  onToggleTool: (skill: ManagedSkill, toolId: string) => void
  onPreview: (skill: ManagedSkill) => void
  onRemarkSave: (skillId: string, remark: string) => void
  t: TFunction
}

const SkillCard = ({
  skill,
  remark,
  installedTools,
  loading,
  getGithubInfo,
  getSkillSourceLabel,
  formatRelative,
  onUpdate,
  onDelete,
  onToggleTool,
  onPreview,
  onRemarkSave,
  t,
}: SkillCardProps) => {
  const [editingRemark, setEditingRemark] = useState(false)
  const [remarkDraft, setRemarkDraft] = useState(remark)
  const remarkInputRef = useRef<HTMLInputElement>(null)

  // Sync remark when prop changes
  useEffect(() => {
    setRemarkDraft(remark)
  }, [remark])

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingRemark && remarkInputRef.current) {
      remarkInputRef.current.focus()
      remarkInputRef.current.select()
    }
  }, [editingRemark])

  const handleRemarkSave = useCallback(() => {
    onRemarkSave(skill.id, remarkDraft.trim())
    setEditingRemark(false)
  }, [skill.id, remarkDraft, onRemarkSave])

  const handleRemarkKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleRemarkSave()
      } else if (e.key === 'Escape') {
        setRemarkDraft(remark)
        setEditingRemark(false)
      }
    },
    [handleRemarkSave, remark],
  )

  const typeKey = skill.source_type.toLowerCase()
  const iconNode = typeKey.includes('git') ? (
    <Github size={20} />
  ) : typeKey.includes('local') ? (
    <Folder size={20} />
  ) : (
    <Box size={20} />
  )
  const github = getGithubInfo(skill.source_ref)
  const copyValue = (github?.href ?? skill.source_ref ?? '').trim()

  const handleCopy = async () => {
    if (!copyValue) return
    try {
      await navigator.clipboard.writeText(copyValue)
      toast.success(t('copied'))
    } catch {
      toast.error(t('copyFailed'))
    }
  }

  return (
    <div className="skill-card">
      <div className="skill-icon">{iconNode}</div>
      <div className="skill-main">
        <div className="skill-header-row">
          <div className="skill-name">{skill.name}</div>
          {editingRemark ? (
            <input
              ref={remarkInputRef}
              className="skill-remark-input"
              value={remarkDraft}
              onChange={(e) => setRemarkDraft(e.target.value)}
              onKeyDown={handleRemarkKeyDown}
              onBlur={handleRemarkSave}
              placeholder={t('preview.remarkPlaceholder')}
              maxLength={60}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <button
              className="skill-remark-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setEditingRemark(true)
              }}
              title={t('preview.editRemark')}
            >
              {remark || <span className="skill-remark-placeholder">{t('preview.remarkPlaceholder')}</span>}
            </button>
          )}
        </div>
        <div className="skill-meta-row">
          {github ? (
            <div className="skill-source">
              <button
                className="repo-pill copyable"
                type="button"
                title={t('copy')}
                aria-label={t('copy')}
                onClick={() => void handleCopy()}
                disabled={!copyValue}
              >
                {github.label}
                <span className="copy-icon" aria-hidden="true">
                  <Copy size={12} />
                </span>
              </button>
            </div>
          ) : (
            <div className="skill-source">
              <button
                className="repo-pill copyable"
                type="button"
                title={t('copy')}
                aria-label={t('copy')}
                onClick={() => void handleCopy()}
                disabled={!copyValue}
              >
                <span className="mono">{getSkillSourceLabel(skill)}</span>
                <span className="copy-icon" aria-hidden="true">
                  <Copy size={12} />
                </span>
              </button>
            </div>
          )}
          <div className="skill-source time">
            <span className="dot">•</span>
            {formatRelative(skill.updated_at)}
          </div>
        </div>
        <div className="tool-matrix">
          {installedTools.map((tool) => {
            const target = skill.targets.find((t) => t.tool === tool.id)
            const synced = Boolean(target)
            const state = synced ? 'active' : 'inactive'
            return (
              <button
                key={`${skill.id}-${tool.id}`}
                type="button"
                className={`tool-pill ${state}`}
                title={
                  synced
                    ? `${tool.label} (${target?.mode ?? t('unknown')})`
                    : tool.label
                }
                onClick={() => void onToggleTool(skill, tool.id)}
              >
                {synced ? <span className="status-badge" /> : null}
                {tool.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="skill-actions-col">
        <button
          className="card-btn preview-action"
          type="button"
          onClick={() => onPreview(skill)}
          aria-label={t('preview.title')}
          title={t('preview.title')}
        >
          <Eye size={16} />
        </button>
        <button
          className="card-btn primary-action"
          type="button"
          onClick={() => onUpdate(skill)}
          disabled={loading}
          aria-label={t('update')}
        >
          <RefreshCw size={16} />
        </button>
        <button
          className="card-btn danger-action"
          type="button"
          onClick={() => onDelete(skill.id)}
          disabled={loading}
          aria-label={t('remove')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default memo(SkillCard)
