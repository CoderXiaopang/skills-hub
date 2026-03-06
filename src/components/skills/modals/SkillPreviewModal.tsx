import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Languages, Loader2, Pencil, X } from 'lucide-react'
import type { TFunction } from 'i18next'
import type { ManagedSkill } from '../types'

type LlmConfig = {
  baseUrl: string
  apiKey: string
  model: string
}

type SkillPreviewModalProps = {
  open: boolean
  skill: ManagedSkill | null
  remark: string
  llmConfig: LlmConfig
  isTauri: boolean
  onRequestClose: () => void
  onRemarkSave: (skillId: string, remark: string) => void
  onContentUpdate: () => void
  t: TFunction
}

const SkillPreviewModal = ({
  open,
  skill,
  remark,
  llmConfig,
  isTauri,
  onRequestClose,
  onRemarkSave,
  onContentUpdate,
  t,
}: SkillPreviewModalProps) => {
  const [content, setContent] = useState<string | null>(null)
  const [translatedContent, setTranslatedContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState<string | null>(null)
  const [showTranslated, setShowTranslated] = useState(false)
  const [editingRemark, setEditingRemark] = useState(false)
  const [remarkDraft, setRemarkDraft] = useState(remark)
  const [replacingOriginal, setReplacingOriginal] = useState(false)
  const remarkInputRef = useRef<HTMLInputElement>(null)

  // Sync remark draft when skill changes
  useEffect(() => {
    setRemarkDraft(remark)
    setEditingRemark(false)
  }, [remark, skill?.id])

  // Reset state when skill changes
  useEffect(() => {
    if (!open || !skill) return
    setContent(null)
    setTranslatedContent(null)
    setShowTranslated(false)
    setTranslateError(null)
    setLoadingContent(true)

    const load = async () => {
      try {
        if (!isTauri) {
          setContent(t('preview.notAvailableInBrowser'))
          setLoadingContent(false)
          return
        }
        const { invoke } = await import('@tauri-apps/api/core')
        // Read SKILL.md from central_path directory
        const skillMdPath = skill.central_path.endsWith('/')
          ? `${skill.central_path}SKILL.md`
          : `${skill.central_path}/SKILL.md`

        try {
          const text = await invoke<string>('read_skill_md', { path: skillMdPath })
          setContent(text || t('preview.loadFailed'))
        } catch (invokeErr) {
          // Show user-friendly error with path info
          const errorMsg = invokeErr instanceof Error ? invokeErr.message : String(invokeErr)
          setContent(
            `${t('preview.loadFailed')}\n\n` +
            `路径: ${skillMdPath}\n\n` +
            `错误详情: ${errorMsg}\n\n` +
            `请检查:\n` +
            `1. 该目录是否存在 SKILL.md 文件\n` +
            `2. 文件是否有读取权限\n` +
            `3. 路径是否正确`
          )
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setContent(`${t('preview.loadFailed')}\n\n错误: ${errorMsg}`)
      } finally {
        setLoadingContent(false)
      }
    }
    void load()
  }, [open, skill?.id, skill?.central_path, isTauri, t])

  useEffect(() => {
    if (editingRemark && remarkInputRef.current) {
      remarkInputRef.current.focus()
      remarkInputRef.current.select()
    }
  }, [editingRemark])

  const handleTranslate = useCallback(async () => {
    if (!content) return
    const { baseUrl, apiKey, model } = llmConfig
    if (!baseUrl || !apiKey || !model) {
      setTranslateError(t('preview.llmNotConfigured'))
      return
    }

    // Check content length and warn user
    const contentLength = content.length
    const estimatedTokens = Math.ceil(contentLength / 4) // Rough estimate
    if (estimatedTokens > 4000) {
      const confirmed = window.confirm(
        `文档较长（约 ${Math.ceil(contentLength / 1000)}K 字符），翻译可能需要 1-3 分钟。是否继续？\n\n提示：可以考虑只翻译关键部分，或使用更快的模型。`
      )
      if (!confirmed) return
    }

    setTranslating(true)
    setTranslateError(null)

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 120 second timeout for long docs

    try {
      const endpoint = baseUrl.replace(/\/$/, '') + '/chat/completions'
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content:
                '你是一位专业的技术文档翻译专家。请将以下 Markdown 技术文档完整地翻译成中文，保留所有 Markdown 格式（标题、代码块、列表等）不变，仅翻译文本内容。',
            },
            { role: 'user', content },
          ],
          temperature: 0.3,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!resp.ok) {
        const errText = await resp.text()
        throw new Error(`HTTP ${resp.status}: ${errText}`)
      }
      const data = (await resp.json()) as {
        choices: { message: { content: string } }[]
      }
      const translated = data.choices[0]?.message?.content ?? ''
      if (!translated) {
        throw new Error('翻译结果为空，请检查 API 配置是否正确')
      }
      setTranslatedContent(translated)
      setShowTranslated(true)
    } catch (err) {
      clearTimeout(timeoutId)
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setTranslateError('翻译超时（120秒），请检查网络连接或 API 配置，或尝试翻译更短的文档')
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setTranslateError(
            `网络错误，无法连接到 API。\n\n请检查:\n1. Base URL 是否正确: ${baseUrl}\n2. 网络连接是否正常\n3. 是否需要代理`
          )
        } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          setTranslateError('API Key 无效或已过期，请检查设置中的 API Key')
        } else if (err.message.includes('404')) {
          setTranslateError(
            `API 端点不存在。\n\n请检查:\n1. Base URL 是否正确: ${baseUrl}\n2. Model 名称是否正确: ${model}`
          )
        } else {
          setTranslateError(err.message)
        }
      } else {
        setTranslateError(String(err))
      }
    } finally {
      setTranslating(false)
    }
  }, [content, llmConfig, t])

  const handleReplaceOriginal = useCallback(async () => {
    if (!skill || !translatedContent || !isTauri) return

    const confirmed = window.confirm(
      '确定要用翻译后的内容替换原始 SKILL.md 文件吗？\n\n注意：此操作会覆盖原文件，建议先备份。'
    )
    if (!confirmed) return

    setReplacingOriginal(true)
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      const skillMdPath = skill.central_path.endsWith('/')
        ? `${skill.central_path}SKILL.md`
        : `${skill.central_path}/SKILL.md`

      await invoke('write_skill_md', { path: skillMdPath, content: translatedContent })

      // Update local content state
      setContent(translatedContent)
      setTranslatedContent(null)
      setShowTranslated(false)

      // Notify parent to refresh if needed
      onContentUpdate()

      alert('替换成功！原文件已更新为中文版本。')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      alert(`替换失败：${errorMsg}`)
    } finally {
      setReplacingOriginal(false)
    }
  }, [skill, translatedContent, isTauri, onContentUpdate])

  const handleRemarkSave = useCallback(() => {
    if (!skill) return
    onRemarkSave(skill.id, remarkDraft.trim())
    setEditingRemark(false)
  }, [skill, remarkDraft, onRemarkSave])

  const handleRemarkKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleRemarkSave()
      if (e.key === 'Escape') {
        setRemarkDraft(remark)
        setEditingRemark(false)
      }
    },
    [handleRemarkSave, remark],
  )

  if (!open || !skill) return null

  const displayContent = showTranslated && translatedContent ? translatedContent : content

  return (
    <div className="modal-backdrop" onClick={onRequestClose}>
      <div
        className="modal modal-xl preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header preview-modal-header">
          <div className="preview-title-block">
            <div className="modal-title" id="preview-title">
              {skill.name}
            </div>
            {/* Remark inline edit */}
            {editingRemark ? (
              <div className="preview-remark-edit-row">
                <input
                  ref={remarkInputRef}
                  className="preview-remark-input"
                  value={remarkDraft}
                  onChange={(e) => setRemarkDraft(e.target.value)}
                  onKeyDown={handleRemarkKeyDown}
                  onBlur={handleRemarkSave}
                  placeholder={t('preview.remarkPlaceholder')}
                  maxLength={60}
                />
              </div>
            ) : (
              <button
                className="preview-remark-btn"
                type="button"
                onClick={() => setEditingRemark(true)}
                title={t('preview.editRemark')}
              >
                <span className="preview-remark-text">
                  {remark || (
                    <span className="preview-remark-placeholder">
                      {t('preview.remarkPlaceholder')}
                    </span>
                  )}
                </span>
                <Pencil size={12} className="preview-remark-icon" />
              </button>
            )}
          </div>
          <div className="preview-header-actions">
            {/* Replace original button - only show when translated */}
            {translatedContent && showTranslated && (
              <button
                className="btn btn-warning preview-replace-btn"
                type="button"
                onClick={() => void handleReplaceOriginal()}
                disabled={replacingOriginal || !isTauri}
                title={t('preview.replaceOriginal')}
              >
                {replacingOriginal ? (
                  <Loader2 size={14} className="spin-icon" />
                ) : null}
                {t('preview.replaceOriginal')}
              </button>
            )}
            {/* Toggle translated / original */}
            {translatedContent && (
              <button
                className={`btn btn-secondary preview-toggle-btn ${showTranslated ? 'active' : ''}`}
                type="button"
                onClick={() => setShowTranslated((v) => !v)}
              >
                {showTranslated ? t('preview.showOriginal') : t('preview.showTranslated')}
              </button>
            )}
            {/* Translate button */}
            <button
              className="btn btn-secondary preview-translate-btn"
              type="button"
              onClick={() => void handleTranslate()}
              disabled={translating || loadingContent || !content}
              title={t('preview.translate')}
            >
              {translating ? (
                <Loader2 size={14} className="spin-icon" />
              ) : (
                <Languages size={14} />
              )}
              {t('preview.translate')}
            </button>
            <button
              className="modal-close"
              type="button"
              onClick={onRequestClose}
              aria-label={t('close')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {translateError && (
          <div className="preview-translate-error">{translateError}</div>
        )}

        <div className="preview-modal-body">
          {loadingContent ? (
            <div className="preview-loading">
              <Loader2 size={20} className="spin-icon" />
              <span>{t('preview.loading')}</span>
            </div>
          ) : (
            <pre className="preview-content">{displayContent ?? ''}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(SkillPreviewModal)
