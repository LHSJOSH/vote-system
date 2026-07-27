"use client";

import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Check,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Settings2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { AiOption, ResultItem, ResultsPayload } from "@/lib/types";
import { CosmicBackground } from "@/components/cosmic-background";

type AdminView = "results" | "options";

type OptionDraft = {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  color: string;
  enabled: boolean;
  sortOrder: number;
};

const EMPTY_OPTION: OptionDraft = {
  name: "",
  description: "",
  imageUrl: "",
  color: "#286FD8",
  enabled: true,
  sortOrder: 0,
};

async function readJson(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "요청을 처리하지 못했습니다.");
  return data;
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await readJson(
        await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        }),
      );
      onSuccess();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "로그인하지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-shell">
      <CosmicBackground />
      <Link className="back-to-vote" href="/">
        <ArrowLeft size={16} />
        투표로 돌아가기
      </Link>
      <motion.form
        className="admin-login-card"
        onSubmit={login}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="admin-lock-mark">
          <LockKeyhole size={27} />
        </div>
        <span className="eyebrow">PRIVATE RESULTS</span>
        <h1>관리자 로그인</h1>
        <p>설정된 PIN 번호를 입력해 주세요.</p>
        <label className="field-group">
          <span>관리자 PIN</span>
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            placeholder="••••"
            maxLength={32}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <LockKeyhole size={18} />
          )}
          로그인
        </button>
      </motion.form>
    </main>
  );
}

function VerticalBar({
  result,
  maxVotes,
  index,
}: {
  result: ResultItem;
  maxVotes: number;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const height = maxVotes
    ? Math.max(result.votes > 0 ? 8 : 0, (result.votes / maxVotes) * 100)
    : 0;

  return (
    <article
      className="vertical-result"
      style={{ "--bar-color": result.option.color } as CSSProperties}
    >
      <div className="vertical-result__value">
        <strong>{result.votes}</strong>
        <span>{result.percentage.toFixed(1)}%</span>
      </div>
      <div className="vertical-result__track" aria-hidden="true">
        <motion.div
          className="vertical-result__bar"
          initial={reduceMotion ? false : { height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{
            duration: 0.75,
            delay: index * 0.07,
            ease: [0.2, 0.8, 0.2, 1],
          }}
        />
      </div>
      <strong className="vertical-result__name">{result.option.name}</strong>
    </article>
  );
}

function SingleLineModelName({
  children,
  maxSize,
}: {
  children: string;
  maxSize: number;
}) {
  const textRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const text = textRef.current;
    const container = text?.parentElement;
    if (!text || !container) return;

    let cancelled = false;
    const fitText = () => {
      text.style.fontSize = `${maxSize}px`;
      const availableWidth = text.clientWidth;
      const requiredWidth = text.scrollWidth;

      if (availableWidth > 0 && requiredWidth > availableWidth) {
        const fittedSize = maxSize * (availableWidth / requiredWidth) * 0.98;
        text.style.fontSize = `${Math.max(1, fittedSize)}px`;
      }
    };

    const resizeObserver = new ResizeObserver(fitText);
    resizeObserver.observe(container);
    fitText();

    void document.fonts.ready.then(() => {
      if (!cancelled) fitText();
    });

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
  }, [children, maxSize]);

  return (
    <strong ref={textRef} className="winner-loop-card__name">
      {children}
    </strong>
  );
}

function WinnerLoop({ winners }: { winners: ResultItem[] }) {
  const reduceMotion = useReducedMotion();
  const isTie = winners.length > 1;

  return (
    <section className="winner-section">
      <span className="eyebrow">BIWEEKLY BEST MODEL</span>
      <h2>격주 최고의 모델</h2>
      {winners.length ? (
        <div className="winner-loop-grid" data-count={winners.length}>
          {winners.map((winner, index) => (
            <motion.article
              key={winner.option.id}
              className="winner-loop-card"
              style={
                { "--winner-color": winner.option.color } as CSSProperties
              }
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                      rotate: [-0.7, 0.7, -0.7],
                      scale: [1, 1.015, 1],
                    }
              }
              transition={{
                duration: 4.2,
                delay: index * 0.28,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <div
                className="winner-loop-card__image"
                data-empty={!winner.option.imageUrl}
                style={
                  winner.option.imageUrl
                    ? { backgroundImage: `url("${winner.option.imageUrl}")` }
                    : undefined
                }
                role="img"
                aria-label={`${winner.option.name} 이미지`}
              >
                {!winner.option.imageUrl && winner.option.name.slice(0, 1)}
              </div>
              <div>
                <span>
                  {isTie ? "공동 1위" : "현재 1위"} · {winner.votes}표
                </span>
                <SingleLineModelName maxSize={isTie ? 40 : 48}>
                  {winner.option.name}
                </SingleLineModelName>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="winner-empty">첫 투표를 기다리고 있어요.</div>
      )}
    </section>
  );
}

function ResultsView() {
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reasonModel, setReasonModel] = useState("all");
  const [reasonOrder, setReasonOrder] = useState<"newest" | "oldest">(
    "newest",
  );

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      const next = await readJson(
        await fetch("/api/admin/results", { cache: "no-store" }),
      );
      setData(next);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "결과를 불러오지 못했습니다.",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    const initialTimeout = window.setTimeout(() => void load(), 0);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, 3000);
    return () => {
      window.clearTimeout(initialTimeout);
      window.clearInterval(interval);
    };
  }, []);

  const maxVotes = Math.max(
    0,
    ...(data?.results.map((result) => result.votes) ?? []),
  );
  const winners =
    maxVotes > 0
      ? (data?.results.filter((result) => result.votes === maxVotes) ?? [])
      : [];
  const optionById = useMemo(
    () =>
      new Map(
        (data?.results ?? []).map((result) => [
          result.option.id,
          result.option,
        ]),
      ),
    [data?.results],
  );
  const visibleReasons = useMemo(() => {
    const votes =
      reasonModel === "all"
        ? [...(data?.votes ?? [])]
        : (data?.votes ?? []).filter(
            (vote) => vote.optionId === reasonModel,
          );
    return votes.sort((a, b) => {
      const difference =
        new Date(b.votedAtIso).getTime() - new Date(a.votedAtIso).getTime();
      return reasonOrder === "newest" ? difference : -difference;
    });
  }, [data?.votes, reasonModel, reasonOrder]);

  return (
    <div className="simple-results-content">
      {error && <p className="admin-alert">{error}</p>}
      <WinnerLoop winners={winners} />

      <section className="vertical-chart-section">
        <div className="simple-section-heading">
          <div>
            <span>MODEL VOTES</span>
            <h2>모델별 투표</h2>
          </div>
          <div className="chart-heading-actions">
            <strong>{data?.totalVotes ?? 0}명 참여</strong>
            <button type="button" onClick={() => void load()}>
              <RefreshCw size={16} className={loading ? "spin" : ""} />
            </button>
          </div>
        </div>
        {loading && !data ? (
          <div className="simple-empty">
            <LoaderCircle className="spin" />
            결과를 불러오고 있어요
          </div>
        ) : data?.results.length ? (
          <div className="vertical-chart">
            {data.results.map((result, index) => (
              <VerticalBar
                key={result.option.id}
                result={result}
                maxVotes={maxVotes}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="simple-empty">표시할 선택지가 없습니다.</div>
        )}
      </section>

      <section className="reason-list-section">
        <div className="simple-section-heading reason-list-heading">
          <div>
            <span>WHY THEY PICKED</span>
            <h2>선정 사유</h2>
          </div>
          <div className="reason-list-tools">
            <select
              aria-label="모델별 선정 사유 필터"
              value={reasonModel}
              onChange={(event) => setReasonModel(event.target.value)}
            >
              <option value="all">전체 모델</option>
              {(data?.results ?? []).map((result) => (
                <option key={result.option.id} value={result.option.id}>
                  {result.option.name}
                </option>
              ))}
            </select>
            <select
              aria-label="선정 사유 정렬"
              value={reasonOrder}
              onChange={(event) =>
                setReasonOrder(event.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>
        <div className="simple-reason-list">
          {visibleReasons.length ? (
            visibleReasons.map((vote, index) => {
              const option = optionById.get(vote.optionId);
              return (
                <motion.article
                  key={vote.submissionId}
                  className="simple-reason"
                  style={
                    {
                      "--reason-color": option?.color ?? "#7c8794",
                    } as CSSProperties
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.035, 0.35) }}
                >
                  <div className="simple-reason__meta">
                    <strong>{vote.nickname}</strong>
                    <span>{vote.optionName}</span>
                  </div>
                  <p>{vote.reason}</p>
                </motion.article>
              );
            })
          ) : (
            <div className="simple-empty">
              {data?.votes.length
                ? "선택한 모델의 선정 사유가 없습니다."
                : "아직 등록된 선정 사유가 없습니다."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function OptionsView() {
  const [options, setOptions] = useState<AiOption[]>([]);
  const [draft, setDraft] = useState<OptionDraft>(EMPTY_OPTION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await readJson(
        await fetch("/api/admin/options", { cache: "no-store" }),
      );
      setOptions(data.options);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "항목을 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const data = await readJson(
        await fetch("/api/admin/options/image", {
          method: "POST",
          body,
        }),
      );
      setDraft((current) => ({ ...current, imageUrl: data.imageUrl }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "이미지를 업로드하지 못했습니다.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await readJson(
        await fetch("/api/admin/options", {
          method: draft.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }),
      );
      setDraft(EMPTY_OPTION);
      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "항목을 저장하지 못했습니다.",
      );
    } finally {
      setSaving(false);
    }
  }

  function edit(option: AiOption) {
    setDraft({
      id: option.id,
      name: option.name,
      description: option.description,
      imageUrl: option.imageUrl,
      color: option.color,
      enabled: option.enabled,
      sortOrder: option.sortOrder,
    });
  }

  return (
    <div className="option-manager">
      <section className="option-manager__list">
        <div className="simple-section-heading">
          <div>
            <span>VOTE MODELS</span>
            <h2>투표 항목</h2>
          </div>
          <button
            className="option-new-button"
            type="button"
            onClick={() => setDraft(EMPTY_OPTION)}
          >
            <Plus size={16} />
            새 항목
          </button>
        </div>
        {loading ? (
          <div className="simple-empty">
            <LoaderCircle className="spin" />
            불러오는 중
          </div>
        ) : (
          <div className="managed-option-list">
            {options.map((option) => (
              <button
                key={option.id}
                className="managed-option"
                type="button"
                data-active={draft.id === option.id}
                onClick={() => edit(option)}
              >
                <span
                  className="managed-option__image"
                  data-empty={!option.imageUrl}
                  style={
                    option.imageUrl
                      ? { backgroundImage: `url("${option.imageUrl}")` }
                      : { background: option.color }
                  }
                >
                  {!option.imageUrl && option.name.slice(0, 1)}
                </span>
                <span className="managed-option__copy">
                  <strong>{option.name}</strong>
                  <small>{option.enabled ? "투표에 노출 중" : "숨김"}</small>
                </span>
                <Pencil size={16} />
              </button>
            ))}
          </div>
        )}
      </section>

      <form className="option-manager__form" onSubmit={save}>
        <div className="simple-section-heading">
          <div>
            <span>{draft.id ? "EDIT MODEL" : "NEW MODEL"}</span>
            <h2>{draft.id ? "항목 수정" : "항목 추가"}</h2>
          </div>
          {draft.id && (
            <button
              className="option-close-button"
              type="button"
              onClick={() => setDraft(EMPTY_OPTION)}
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {error && <p className="admin-alert">{error}</p>}

        <label className="model-image-upload">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => void uploadImage(event.target.files?.[0])}
          />
          <span
            className="model-image-upload__preview"
            data-empty={!draft.imageUrl}
            style={
              draft.imageUrl
                ? { backgroundImage: `url("${draft.imageUrl}")` }
                : undefined
            }
          >
            {uploading ? (
              <LoaderCircle className="spin" />
            ) : !draft.imageUrl ? (
              <ImagePlus />
            ) : null}
          </span>
          <span>
            <strong>{draft.imageUrl ? "이미지 변경" : "모델 이미지 등록"}</strong>
            <small>JPG, PNG, WEBP, GIF · 최대 5MB</small>
          </span>
        </label>

        <label className="field-group field-group--compact">
          <span>모델 이름</span>
          <input
            required
            maxLength={40}
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="예: Claude"
          />
        </label>
        <label className="field-group field-group--compact">
          <span>짧은 설명</span>
          <input
            maxLength={120}
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="예: 정교한 추론과 글쓰기"
          />
        </label>
        <div className="option-manager__row">
          <label className="field-group field-group--compact">
            <span>강조 색상</span>
            <input
              type="color"
              value={draft.color}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  color: event.target.value.toUpperCase(),
                }))
              }
            />
          </label>
          <label className="field-group field-group--compact">
            <span>노출 순서</span>
            <input
              type="number"
              min={0}
              max={999}
              value={draft.sortOrder}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  sortOrder: Number(event.target.value),
                }))
              }
            />
          </label>
        </div>
        <label className="manager-check">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                enabled: event.target.checked,
              }))
            }
          />
          투표 화면에 노출
        </label>
        <button
          className="primary-button option-save-button"
          type="submit"
          disabled={saving || uploading}
        >
          {saving ? <LoaderCircle className="spin" size={18} /> : <Check size={18} />}
          저장하기
        </button>
      </form>
    </div>
  );
}

function AdminWorkspace({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<AdminView>("results");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  }

  return (
    <main className="simple-results-shell">
      <header className="simple-results-header">
        <div>
          <span className="eyebrow">ADMIN</span>
          <h1>{view === "results" ? "투표 결과" : "투표 항목 관리"}</h1>
        </div>
        <div className="simple-results-actions">
          <nav className="simple-admin-nav" aria-label="관리자 메뉴">
            <button
              type="button"
              data-active={view === "results"}
              onClick={() => setView("results")}
            >
              <BarChart3 size={16} />
              결과
            </button>
            <button
              type="button"
              data-active={view === "options"}
              onClick={() => setView("options")}
            >
              <Settings2 size={16} />
              투표 항목
            </button>
          </nav>
          <button type="button" onClick={logout}>
            <LogOut size={17} />
            로그아웃
          </button>
        </div>
      </header>
      {view === "results" ? <ResultsView /> : <OptionsView />}
    </main>
  );
}

export function AdminApp({
  initialAuthenticated,
}: {
  initialAuthenticated: boolean;
}) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  return authenticated ? (
    <AdminWorkspace onLogout={() => setAuthenticated(false)} />
  ) : (
    <AdminLogin onSuccess={() => setAuthenticated(true)} />
  );
}
