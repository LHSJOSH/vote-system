"use client";

import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { AiOption, VoteRecord } from "@/lib/types";
import { CosmicBackground } from "@/components/cosmic-background";

type Step = 0 | 1 | 2 | 3 | 4;

type Draft = {
  step: Step;
  nickname: string;
  selectedOptionId: string;
  reason: string;
  submissionId: string;
};

type SurveyHistoryState = {
  aiVoteSurvey: true;
  surveyStep: Step;
  surveyIndex: number;
};

const EMPTY_DRAFT: Draft = {
  step: 0,
  nickname: "",
  selectedOptionId: "",
  reason: "",
  submissionId: "",
};

const ORBIT_POSITIONS = [
  [8, 12],
  [63, 5],
  [32, 31],
  [70, 40],
  [5, 57],
  [44, 65],
  [17, 80],
  [70, 78],
];

function StepProgress({ step }: { step: Step }) {
  return (
    <div className="step-progress" aria-label={`전체 5단계 중 ${step + 1}단계`}>
      <div className="step-progress__meta">
        <span>{String(step + 1).padStart(2, "0")} / 05</span>
      </div>
      <div className="step-progress__track">
        <motion.div
          className="step-progress__value"
          animate={{ width: `${((step + 1) / 5) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

function StepHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <header className="step-heading">
      <span className="eyebrow">
        <Sparkles size={14} />
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function FloatingOptions({
  options,
  selectedId,
  onSelect,
}: {
  options: AiOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion || !rootRef.current) return;
    const context = gsap.context(() => {
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        gsap.to(item, {
          y: index % 2 === 0 ? -14 : 16,
          rotateZ: index % 2 === 0 ? 1.8 : -1.8,
          duration: 2.8 + (index % 4) * 0.45,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: index * -0.24,
        });
      });
    }, rootRef);
    return () => context.revert();
  }, [options, reduceMotion]);

  return (
    <div ref={rootRef} className="orbit-stage">
      <div className="orbit-stage__halo" aria-hidden="true" />
      <div className="orbit-stage__plane" role="radiogroup" aria-label="AI 모델">
        {options.map((option, index) => {
          const position = ORBIT_POSITIONS[index] ?? [50, 50];
          const selected = option.id === selectedId;
          return (
            <div
              key={option.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="orbit-item"
              style={
                {
                  left: `${position[0]}%`,
                  top: `${position[1]}%`,
                  "--option-color": option.color,
                } as CSSProperties
              }
            >
              <motion.button
                type="button"
                role="radio"
                aria-checked={selected}
                className="model-orb-card"
                data-selected={selected}
                onClick={() => onSelect(option.id)}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  onSelect(option.id);
                }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                animate={{
                  scale: selected ? 1.08 : selectedId ? 0.94 : 1,
                  opacity: selectedId && !selected ? 0.55 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="model-orb-card__glow" aria-hidden="true" />
                <span
                  className="model-orb-card__thumb"
                  data-empty={!option.imageUrl}
                  style={
                    option.imageUrl
                      ? { backgroundImage: `url("${option.imageUrl}")` }
                      : undefined
                  }
                  aria-hidden="true"
                />
                <span className="model-orb-card__copy">
                  <strong>{option.name}</strong>
                  <span>{option.description || "당신의 선택을 기다리고 있어요"}</span>
                </span>
                <span className="model-orb-card__check">
                  {selected ? <Check size={16} strokeWidth={3} /> : null}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SurveyApp() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [options, setOptions] = useState<AiOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const historyIndexRef = useRef(0);
  const submitRunRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let restoredDraft = EMPTY_DRAFT;
      const saved = sessionStorage.getItem("ai-vote-draft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Draft;
          restoredDraft = {
            ...EMPTY_DRAFT,
            ...parsed,
            step: parsed.step === 3 ? 2 : parsed.step,
          };
        } catch {
          sessionStorage.removeItem("ai-vote-draft");
        }
      }
      setDraft(restoredDraft);
      historyIndexRef.current = 0;
      window.history.replaceState(
        {
          aiVoteSurvey: true,
          surveyStep: restoredDraft.step,
          surveyIndex: 0,
        } satisfies SurveyHistoryState,
        "",
      );
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as SurveyHistoryState | null;
      if (!state?.aiVoteSurvey) return;
      historyIndexRef.current = state.surveyIndex;
      if (state.surveyStep !== 3) submitRunRef.current += 1;
      setFormError("");
      setSubmitError("");
      setDraft((current) => ({ ...current, step: state.surveyStep }));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || draft.step === 4) return;
    sessionStorage.setItem("ai-vote-draft", JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    async function loadOptions() {
      setLoadingOptions(true);
      setOptionsError("");
      try {
        const response = await fetch("/api/options", { cache: "no-store" });
        const data = (await response.json()) as {
          error?: string;
          options: AiOption[];
          existingVote?: VoteRecord | null;
        };
        if (!response.ok) throw new Error(data.error);
        if (!active) return;
        setOptions(data.options);
        if (data.existingVote) {
          setDraft((current) => {
            const hasDraft =
              current.nickname ||
              current.selectedOptionId ||
              current.reason ||
              current.submissionId;
            if (hasDraft) return current;
            return {
              ...current,
              nickname: data.existingVote!.nickname,
              selectedOptionId: data.existingVote!.optionId,
              reason: data.existingVote!.reason,
              submissionId: data.existingVote!.submissionId,
            };
          });
        }
      } catch (error) {
        if (active) {
          setOptionsError(
            error instanceof Error
              ? error.message
              : "선택지를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (active) setLoadingOptions(false);
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, [hydrated]);

  function nextFromName(event: FormEvent) {
    event.preventDefault();
    const nickname = draft.nickname.trim();
    if (nickname.length < 2 || nickname.length > 20) {
      setFormError("닉네임은 2자 이상 20자 이하로 입력해 주세요.");
      return;
    }
    setFormError("");
    setDraft((current) => ({ ...current, nickname }));
    goToStep(1);
  }

  function nextFromOption() {
    if (!draft.selectedOptionId) {
      setFormError("가장 마음에 드는 AI 모델을 선택해 주세요.");
      return;
    }
    setFormError("");
    goToStep(2);
  }

  function goToStep(step: Step, mode: "push" | "replace" = "push") {
    if (mode === "push") {
      historyIndexRef.current += 1;
      window.history.pushState(
        {
          aiVoteSurvey: true,
          surveyStep: step,
          surveyIndex: historyIndexRef.current,
        } satisfies SurveyHistoryState,
        "",
      );
    } else {
      window.history.replaceState(
        {
          aiVoteSurvey: true,
          surveyStep: step,
          surveyIndex: historyIndexRef.current,
        } satisfies SurveyHistoryState,
        "",
      );
    }
    setDraft((current) => ({ ...current, step }));
  }

  function goBackTo(fallbackStep: Step) {
    setFormError("");
    setSubmitError("");
    if (historyIndexRef.current > 0) {
      window.history.back();
      return;
    }
    goToStep(fallbackStep, "replace");
  }

  function goToMain() {
    historyIndexRef.current = 0;
    submitRunRef.current += 1;
    setFormError("");
    setSubmitError("");
    setDraft((current) => ({ ...current, step: 0 }));
    window.history.replaceState(
      {
        aiVoteSurvey: true,
        surveyStep: 0,
        surveyIndex: 0,
      } satisfies SurveyHistoryState,
      "",
    );
  }

  async function submitVote(event?: FormEvent) {
    event?.preventDefault();
    const reason = draft.reason.trim();
    if (reason.length < 5 || reason.length > 500) {
      setFormError("이유를 5자 이상 500자 이하로 입력해 주세요.");
      return;
    }

    setFormError("");
    setSubmitError("");
    const submissionId = draft.submissionId || crypto.randomUUID();
    const submitRun = submitRunRef.current + 1;
    submitRunRef.current = submitRun;
    const payload = {
      submissionId,
      nickname: draft.nickname,
      optionId: draft.selectedOptionId,
      reason,
    };
    setDraft((current) => ({ ...current, reason, submissionId }));
    goToStep(3, draft.step === 3 ? "replace" : "push");

    const startedAt = Date.now();
    let response: Response | null = null;
    let data: { error?: string } = {};

    try {
      response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      data = await response.json();
    } catch {
      data = { error: "네트워크 연결을 확인하고 다시 시도해 주세요." };
    }

    const remaining = Math.max(0, 5000 - (Date.now() - startedAt));
    await new Promise((resolve) => window.setTimeout(resolve, remaining));

    if (submitRunRef.current !== submitRun) return;

    if (!response?.ok) {
      setSubmitError(data.error || "투표를 저장하지 못했습니다.");
      return;
    }

    sessionStorage.removeItem("ai-vote-draft");
    goToStep(4, "replace");
  }

  const selectedOption = options.find(
    (option) => option.id === draft.selectedOptionId,
  );

  if (!hydrated) return <main className="app-shell" />;

  return (
    <main className="app-shell">
      <CosmicBackground />
      <div className="survey-shell">
        <StepProgress step={draft.step} />
        <AnimatePresence mode="wait">
          <motion.section
            key={draft.step}
            className={`survey-step survey-step--${draft.step}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
            transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {draft.step === 0 && (
              <form className="intro-step" onSubmit={nextFromName}>
                <StepHeading
                  eyebrow="BIWEEKLY PICK"
                  title={<>먼저, 어떻게<br />불러드릴까요?</>}
                  description="투표에 사용할 이름이나 닉네임을 입력해 주세요."
                />
                <div className="intro-form-stage">
                  <div className="intro-form-control">
                    <label className="field-group">
                      <span>이름 또는 닉네임</span>
                      <input
                        autoFocus
                        value={draft.nickname}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            nickname: event.target.value,
                          }))
                        }
                        maxLength={20}
                        placeholder="예: AI 탐험가"
                        autoComplete="nickname"
                      />
                      <small>{draft.nickname.length} / 20</small>
                    </label>
                    {formError && <p className="form-error">{formError}</p>}
                  </div>
                  <button className="primary-button" type="submit">
                    시작하기 <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {draft.step === 1 && (
              <div className="option-step">
                <StepHeading
                  eyebrow="BIWEEKLY PICK"
                  title={<>이번 격주의<br />최고의 AI는?</>}
                  description="마음이 가는 모델을 선택해 주세요. 카드를 누르면 선택돼요."
                />
                {loadingOptions ? (
                  <div className="center-state">
                    <LoaderCircle className="spin" size={28} />
                    선택지를 불러오고 있어요
                  </div>
                ) : optionsError ? (
                  <div className="center-state center-state--error">
                    <p>{optionsError}</p>
                    <button type="button" onClick={() => location.reload()}>
                      다시 시도
                    </button>
                  </div>
                ) : options.length === 0 ? (
                  <div className="center-state">
                    <Sparkles size={26} />
                    <strong>투표 준비 중이에요</strong>
                    <span>관리자가 AI 모델 선택지를 등록하고 있어요.</span>
                  </div>
                ) : (
                  <FloatingOptions
                    options={options}
                    selectedId={draft.selectedOptionId}
                    onSelect={(id) => {
                      setDraft((current) => ({
                        ...current,
                        selectedOptionId: id,
                      }));
                      setFormError("");
                    }}
                  />
                )}
                {formError && <p className="form-error">{formError}</p>}
                <div className="bottom-actions">
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => goBackTo(0)}
                    aria-label="이전 단계"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!options.length}
                    onClick={nextFromOption}
                  >
                    이 모델로 선택 <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {draft.step === 2 && (
              <form className="reason-step" onSubmit={submitVote}>
                <StepHeading
                  eyebrow={selectedOption?.name ?? "YOUR PICK"}
                  title={<>왜 이 모델을<br />선택했나요?</>}
                  description="직접 사용하며 느낀 장점이나 인상 깊었던 순간을 들려주세요."
                />
                <div className="reason-form-stage">
                  <div className="reason-form-control">
                    <label className="field-group field-group--textarea">
                      <span>선정 이유</span>
                      <textarea
                        autoFocus
                        value={draft.reason}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            reason: event.target.value,
                          }))
                        }
                        maxLength={500}
                        placeholder="이 모델이 가장 좋았던 이유를 자유롭게 적어주세요."
                      />
                      <small>{draft.reason.length} / 500</small>
                    </label>
                    {formError && <p className="form-error">{formError}</p>}
                  </div>
                  <div className="reason-actions">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => goBackTo(1)}
                      aria-label="이전 단계"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button className="primary-button" type="submit">
                      투표 제출하기 <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {draft.step === 3 && (
              <div className="processing-panel" aria-live="polite">
                <div className="processing-orbit" aria-hidden="true">
                  <div className="processing-orbit__core" />
                  <span /><span /><span />
                </div>
                <span className="eyebrow">COUNTING YOUR VOTE</span>
                <h1>잠시만 기다려 주세요...</h1>
                <p>
                  {submitError
                    ? submitError
                    : "소중한 의견을 안전하게 기록하고 있어요."}
                </p>
                {submitError ? (
                  <button className="primary-button" type="button" onClick={() => submitVote()}>
                    <RotateCcw size={18} /> 다시 시도
                  </button>
                ) : (
                  <div className="buffer-dots" aria-label="처리 중">
                    <span /><span /><span />
                  </div>
                )}
              </div>
            )}

            {draft.step === 4 && (
              <div className="complete-panel">
                <div className="complete-panel__center">
                  <div className="complete-panel__mark">
                    <motion.div
                      className="complete-check"
                      initial={reduceMotion ? false : { scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    >
                      <Check size={48} strokeWidth={3} />
                    </motion.div>
                    <span className="eyebrow">VOTE COMPLETE</span>
                  </div>
                  <h1>투표가<br />완료됐어요</h1>
                </div>
                <button
                  className="secondary-button complete-home-button"
                  type="button"
                  onClick={goToMain}
                >
                  <ArrowLeft size={18} />
                  처음으로 돌아가기
                </button>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
