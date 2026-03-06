import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import type { TFunction } from 'i18next'

export type LlmConfig = {
  baseUrl: string
  apiKey: string
  model: string
}

type SettingsModalProps = {
  open: boolean
  isTauri: boolean
  language: string
  storagePath: string
  gitCacheCleanupDays: number
  gitCacheTtlSecs: number
  themePreference: 'system' | 'light' | 'dark'
  llmConfig: LlmConfig
  onPickStoragePath: () => void
  onToggleLanguage: () => void
  onThemeChange: (nextTheme: 'system' | 'light' | 'dark') => void
  onGitCacheCleanupDaysChange: (nextDays: number) => void
  onGitCacheTtlSecsChange: (nextSecs: number) => void
  onClearGitCacheNow: () => void
  onLlmConfigChange: (cfg: LlmConfig) => void
  onRequestClose: () => void
  t: TFunction
}

const SettingsModal = ({
  open,
  isTauri,
  language,
  storagePath,
  gitCacheCleanupDays,
  gitCacheTtlSecs,
  themePreference,
  llmConfig,
  onPickStoragePath,
  onToggleLanguage,
  onThemeChange,
  onGitCacheCleanupDaysChange,
  onGitCacheTtlSecsChange,
  onClearGitCacheNow,
  onLlmConfigChange,
  onRequestClose,
  t,
}: SettingsModalProps) => {
  const [appVersion, setAppVersion] = useState<string | null>(null)
  const [llmDraft, setLlmDraft] = useState<LlmConfig>(llmConfig)
  const [testingConnection, setTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    latency?: number
  } | null>(null)

  const versionText = useMemo(() => {
    if (!isTauri) return t('notAvailable')
    if (!appVersion) return t('unknown')
    return `v${appVersion}`
  }, [appVersion, isTauri, t])

  const loadAppVersion = useCallback(async () => {
    if (!isTauri) {
      setAppVersion(null)
      return
    }
    try {
      const { getVersion } = await import('@tauri-apps/api/app')
      const v = await getVersion()
      setAppVersion(v)
    } catch {
      setAppVersion(null)
    }
  }, [isTauri])

  useEffect(() => {
    if (!open) {
      setAppVersion(null)
      return
    }
    setLlmDraft(llmConfig)
    setTestResult(null)
    void loadAppVersion()
  }, [loadAppVersion, open, llmConfig])

  const handleLlmBlur = useCallback(() => {
    onLlmConfigChange(llmDraft)
  }, [llmDraft, onLlmConfigChange])

  const handleTestConnection = useCallback(async () => {
    const { baseUrl, apiKey, model } = llmDraft
    if (!baseUrl || !apiKey || !model) {
      setTestResult({
        success: false,
        message: '请先填写完整的 API 配置',
      })
      return
    }

    setTestingConnection(true)
    setTestResult(null)
    const startTime = Date.now()

    try {
      const endpoint = baseUrl.replace(/\/$/, '') + '/chat/completions'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for test

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
              role: 'user',
              content: 'Hi',
            },
          ],
          max_tokens: 5,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const latency = Date.now() - startTime

      if (!resp.ok) {
        const errText = await resp.text()
        setTestResult({
          success: false,
          message: `连接失败: HTTP ${resp.status}\n${errText.substring(0, 200)}`,
        })
        return
      }

      // Try to parse response
      await resp.json()

      setTestResult({
        success: true,
        message: '连接成功！API 配置正确。',
        latency,
      })
    } catch (err) {
      const latency = Date.now() - startTime
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setTestResult({
            success: false,
            message: '连接超时（>10秒），请检查网络或 Base URL',
            latency,
          })
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setTestResult({
            success: false,
            message: `网络错误，无法连接到:\n${baseUrl}\n\n请检查 Base URL 和网络连接`,
          })
        } else {
          setTestResult({
            success: false,
            message: err.message,
          })
        }
      } else {
        setTestResult({
          success: false,
          message: String(err),
        })
      }
    } finally {
      setTestingConnection(false)
    }
  }, [llmDraft])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onRequestClose}>
      <div
        className="modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title" id="settings-title">
            {t('settings')}
          </div>
          <button
            className="modal-close"
            type="button"
            onClick={onRequestClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>
        <div className="modal-body settings-body">
          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-language">
              {t('interfaceLanguage')}
            </label>
            <div className="settings-select-wrap">
              <select
                id="settings-language"
                className="settings-select"
                value={language}
                onChange={(event) => {
                  if (event.target.value !== language) {
                    onToggleLanguage()
                  }
                }}
              >
                <option value="en">{t('languageOptions.en')}</option>
                <option value="zh">{t('languageOptions.zh')}</option>
              </select>
              <svg
                className="settings-select-caret"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label" id="settings-theme-label">
              {t('themeMode')}
            </label>
            <div className="settings-theme-options" role="group" aria-labelledby="settings-theme-label">
              <button
                type="button"
                className={`settings-theme-btn ${
                  themePreference === 'system' ? 'active' : ''
                }`}
                aria-pressed={themePreference === 'system'}
                onClick={() => onThemeChange('system')}
              >
                {t('themeOptions.system')}
              </button>
              <button
                type="button"
                className={`settings-theme-btn ${
                  themePreference === 'light' ? 'active' : ''
                }`}
                aria-pressed={themePreference === 'light'}
                onClick={() => onThemeChange('light')}
              >
                {t('themeOptions.light')}
              </button>
              <button
                type="button"
                className={`settings-theme-btn ${
                  themePreference === 'dark' ? 'active' : ''
                }`}
                aria-pressed={themePreference === 'dark'}
                onClick={() => onThemeChange('dark')}
              >
                {t('themeOptions.dark')}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-storage">
              {t('skillsStoragePath')}
            </label>
            <div className="settings-input-row">
              <input
                id="settings-storage"
                className="settings-input mono"
                value={storagePath}
                readOnly
              />
              <button
                className="btn btn-secondary settings-browse"
                type="button"
                onClick={onPickStoragePath}
              >
                {t('browse')}
              </button>
            </div>
            <div className="settings-helper">{t('skillsStorageHint')}</div>
          </div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-git-cache-days">
              {t('gitCacheCleanupDays')}
            </label>
            <div className="settings-input-row">
              <input
                id="settings-git-cache-days"
                className="settings-input"
                type="number"
                min={0}
                max={3650}
                step={1}
                value={gitCacheCleanupDays}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isNaN(next)) {
                    onGitCacheCleanupDaysChange(next)
                  }
                }}
              />
              <button
                className="btn btn-secondary settings-browse"
                type="button"
                onClick={onClearGitCacheNow}
              >
                {t('cleanNow')}
              </button>
            </div>
            <div className="settings-helper">{t('gitCacheCleanupHint')}</div>
          </div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-git-cache-ttl">
              {t('gitCacheTtlSecs')}
            </label>
            <div className="settings-input-row">
              <input
                id="settings-git-cache-ttl"
                className="settings-input"
                type="number"
                min={0}
                max={3600}
                step={1}
                value={gitCacheTtlSecs}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isNaN(next)) {
                    onGitCacheTtlSecsChange(next)
                  }
                }}
              />
            </div>
            <div className="settings-helper">{t('gitCacheTtlHint')}</div>
          </div>

          {/* LLM Configuration */}
          <div className="settings-section-title">{t('llm.sectionTitle')}</div>
          <div className="settings-helper settings-llm-hint">{t('llm.hint')}</div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-llm-base-url">
              {t('llm.baseUrl')}
            </label>
            <input
              id="settings-llm-base-url"
              className="settings-input mono"
              type="text"
              placeholder="https://api.openai.com/v1"
              value={llmDraft.baseUrl}
              onChange={(e) => setLlmDraft((d) => ({ ...d, baseUrl: e.target.value }))}
              onBlur={handleLlmBlur}
            />
          </div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-llm-api-key">
              {t('llm.apiKey')}
            </label>
            <input
              id="settings-llm-api-key"
              className="settings-input mono"
              type="password"
              placeholder="sk-..."
              value={llmDraft.apiKey}
              onChange={(e) => setLlmDraft((d) => ({ ...d, apiKey: e.target.value }))}
              onBlur={handleLlmBlur}
            />
          </div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-llm-model">
              {t('llm.model')}
            </label>
            <input
              id="settings-llm-model"
              className="settings-input mono"
              type="text"
              placeholder="gpt-4o-mini"
              value={llmDraft.model}
              onChange={(e) => setLlmDraft((d) => ({ ...d, model: e.target.value }))}
              onBlur={handleLlmBlur}
            />
            <div className="settings-helper">{t('llm.modelHint')}</div>
          </div>

          <div className="settings-field">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => void handleTestConnection()}
              disabled={testingConnection}
            >
              {testingConnection ? '测试中...' : t('llm.testConnection')}
            </button>
            {testResult && (
              <div className={`settings-test-result ${testResult.success ? 'success' : 'error'}`}>
                <div className="test-result-message">{testResult.message}</div>
                {testResult.latency !== undefined && (
                  <div className="test-result-latency">
                    延迟: {testResult.latency}ms
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="settings-version">
            {t('appName')} {versionText}
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn btn-primary btn-full" onClick={onRequestClose}>
            {t('done')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SettingsModal)
