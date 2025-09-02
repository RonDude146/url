"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button" // use named import to match shadcn export
import "./App.css"

function App() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const [toast, setToast] = useState({ show: false, message: "" })
  const inputRef = useRef(null)

  const showToast = (message) => {
    setToast({ show: true, message })
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast({ show: false, message: "" }), 2200)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      checkURL()
    }
  }

  const checkURL = async () => {
    const urlToCheck = url.trim()
    if (!urlToCheck) {
      setError("Please enter a URL to check")
      return
    }
    // Reset states
    setError(null)
    setResults(null)
    setIsLoading(true)

    try {
      const apiEndpoint =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://localhost:5000/check"
          : "/check"

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToCheck }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }
      setResults(data)
    } catch (error) {
      console.error("Error checking URL:", error)
      setError(`Failed to check URL: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    const icons = {
      safe: "fas fa-shield-check",
      suspicious: "fas fa-exclamation-triangle",
      malicious: "fas fa-skull-crossbones",
      unknown: "fas fa-question-circle",
    }
    return icons[status] || icons.unknown
  }

  const getStatusColor = (status) => {
    const colors = {
      safe: "status-safe glow-safe",
      suspicious: "status-suspicious glow-suspicious",
      malicious: "status-malicious glow-malicious",
      unknown: "status-unknown",
    }
    return colors[status] || colors.unknown
  }

  const getStatusBg = (status) => {
    const backgrounds = {
      safe: "bg-safe",
      suspicious: "bg-suspicious",
      malicious: "bg-malicious",
      unknown: "bg-unknown",
    }
    return backgrounds[status] || backgrounds.unknown
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(results?.url || "")
      showToast("URL copied")
    } catch {}
  }
  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2))
      showToast("JSON copied")
    } catch {}
  }

  // derive label float state
  const hasValue = url.length > 0

  return (
    <div className="min-h-screen">
      {/* Header / Brand */}
      <header className="py-5 px-4">
        <div className="container mx-auto">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <i className="fas fa-shield-alt text-xl text-indigo-300"></i>
            <h1 className="text-lg md:text-xl font-bold gradient-text font-heading text-pretty">URL Safety Checker</h1>
          </div>
        </div>
      </header>

      {/* Hero title */}
      <div className="px-4 pt-6 text-center">
        <div className="float-animation">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 font-heading gradient-text">
            Scan URLs with Confidence
          </h2>
          <p className="text-base md:text-lg text-slate-300">
            Protect yourself from malicious websites using trusted security services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* URL Input Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 md:p-8 mb-8 hover:shadow-blue-500/20 transition-all duration-300">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-semibold mb-2 font-heading gradient-text">Enter URL to Check</h3>
            <p className="text-slate-300">We’ll scan the URL using Google Safe Browsing and VirusTotal</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className={`flex-1 input-wrap ${hasValue ? "has-value" : ""}`}>
              <label htmlFor="urlInput" className="float-label">
                https://example.com
              </label>
              <input
                id="urlInput"
                ref={inputRef}
                type="text"
                className="input-premium w-full text-base"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                aria-label="URL to check"
                placeholder="" /* placeholder handled by float label */
              />
            </div>

            <Button
              id="checkButton"
              onClick={checkURL}
              disabled={isLoading}
              aria-label="Check URL"
              className="btn-premium min-w-[150px] active:scale-95"
            >
              {isLoading ? (
                <>
                  <div className="loading-radar w-5 h-5 mr-2" aria-hidden="true"></div>
                  Checking...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-2" aria-hidden="true"></i>
                  Check URL
                </>
              )}
            </Button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-slate-400 text-sm inline-flex items-center gap-2">
              <i className="fas fa-info-circle" aria-hidden="true"></i>
              Uses Google Safe Browsing and VirusTotal APIs
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div
            id="loadingState"
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 mb-8 text-center shadow-2xl animate-in fade-in duration-300"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full relative">
              <div className="loading-radar w-full h-full"></div>
            </div>
            <h4 className="text-2xl font-semibold mb-2 font-heading gradient-text">Analyzing URL...</h4>
            <p className="text-slate-300 mb-6">This may take a few seconds</p>
            <div className="loading-progress mb-6"></div>
            <div className="flex justify-center gap-8 text-slate-300">
              <div className="pulse-animation inline-flex items-center gap-2">
                <i className="fab fa-google text-indigo-300"></i>
                Google Safe Browsing
              </div>
              <div className="pulse-animation inline-flex items-center gap-2" style={{ animationDelay: "1s" }}>
                <i className="fas fa-virus text-teal-300"></i>
                VirusTotal
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div id="resultContainer" className="space-y-6">
            {/* Main Result Card */}
            <div
              id="mainResult"
              className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 md:p-8 ${getStatusBg(
                results.status,
              )}`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className={`text-5xl md:text-6xl mr-5 ${getStatusColor(results.status)}`}>
                    <i className={getStatusIcon(results.status)} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h5 className={`text-3xl md:text-4xl font-extrabold mb-2 font-heading gradient-text`}>
                      {results.status.toUpperCase()}
                    </h5>
                    <p className="text-slate-300 text-base md:text-lg">{results.reason}</p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-sm text-slate-400 mb-1">Checked URL:</p>
                  <div className="flex items-center gap-2 justify-center md:justify-end">
                    <p className="font-mono text-xs md:text-sm bg-black/20 px-3 py-2 rounded-lg break-all max-w-xs">
                      {results.url}
                    </p>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={copyUrl}
                      aria-label="Copy checked URL"
                      title="Copy URL"
                    >
                      <i className="far fa-copy" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Google Safe Browsing Card */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 hover:shadow-blue-500/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <i className="fab fa-google text-3xl text-indigo-300 mr-3" aria-hidden="true"></i>
                  <h6 className="text-2xl font-semibold font-heading">Google Safe Browsing</h6>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status:</span>
                    <span
                      id="gsbStatus"
                      className={`badge ${results.details.google_safebrowsing.error ? "badge-malicious" : "badge-safe"}`}
                    >
                      {results.details.google_safebrowsing.error ? "Error" : "Success"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Threats Found:</span>
                    <span id="gsbThreats" className="font-semibold text-white">
                      {results.details.google_safebrowsing.matches
                        ? results.details.google_safebrowsing.matches.length
                        : 0}
                    </span>
                  </div>
                  {results.details.google_safebrowsing.matches &&
                    results.details.google_safebrowsing.matches.length > 0 && (
                      <div className="mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="text-sm">
                          <strong className="text-red-400">Threat Types:</strong>
                          <div className="mt-1 text-slate-300">
                            {results.details.google_safebrowsing.matches.map((match) => match.threatType).join(", ")}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* VirusTotal Card */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 hover:shadow-red-500/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <i className="fas fa-virus text-3xl text-red-300 mr-3" aria-hidden="true"></i>
                  <h6 className="text-2xl font-semibold font-heading">VirusTotal</h6>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status:</span>
                    <span
                      id="vtStatus"
                      className={`badge ${results.details.virustotal.error ? "badge-malicious" : "badge-safe"}`}
                    >
                      {results.details.virustotal.error ? "Error" : "Success"}
                    </span>
                  </div>

                  {results.details.virustotal.data &&
                    results.details.virustotal.data.attributes &&
                    results.details.virustotal.data.attributes.stats && (
                      <div id="vtStats" className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-red-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">
                            {results.details.virustotal.data.attributes.stats.malicious || 0}
                          </div>
                          <div className="text-xs text-slate-400">Malicious</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400">
                            {results.details.virustotal.data.attributes.stats.suspicious || 0}
                          </div>
                          <div className="text-xs text-slate-400">Suspicious</div>
                        </div>
                        <div className="text-center p-3 bg-green-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">
                            {results.details.virustotal.data.attributes.stats.harmless || 0}
                          </div>
                          <div className="text-xs text-slate-400">Harmless</div>
                        </div>
                        <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">
                            {results.details.virustotal.data.attributes.stats.undetected || 0}
                          </div>
                          <div className="text-xs text-slate-400">Undetected</div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Technical Details (collapsible) */}
            <details id="technicalDetails" className="mt-2">
              <summary>
                <i className="fas fa-code text-indigo-300" aria-hidden="true"></i>
                <span className="ml-2">Technical Details</span>
                <i className="fas fa-chevron-right ml-auto transition-transform chev" aria-hidden="true"></i>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    copyJSON()
                  }}
                  className="icon-button ml-3"
                  aria-label="Copy JSON"
                  title="Copy JSON"
                >
                  <i className="far fa-copy" aria-hidden="true"></i> Copy JSON
                </button>
              </summary>
              <div className="content">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <pre className="text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            id="errorState"
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 text-center bg-red-500/10 border-red-500/20"
          >
            <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4" aria-hidden="true"></i>
            <h3 className="text-2xl font-semibold text-red-400 mb-3 font-heading">Error</h3>
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                inputRef.current?.focus()
              }}
              aria-label="Try checking again"
              className="btn-premium"
            >
              Try again
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p className="mb-2">&copy; 2024 URL Safety Checker. Built for educational purposes.</p>
          <p className="text-sm inline-flex items-center gap-2">
            <i className="fas fa-graduation-cap" aria-hidden="true"></i>
            College Project - Web Security &amp; API Integration
          </p>
        </div>
      </footer>

      {toast.show && (
        <div role="status" aria-live="polite" className="snackbar">
          <i className="fas fa-check-circle text-teal-300" aria-hidden="true"></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default App
