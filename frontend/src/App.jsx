import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";


/* =====================================================
   RETURNING USER WELCOME
   ===================================================== */

function WelcomePage({
  profile,
  assessment,
  recommendations,
  onContinue,
  onNewAssessment
}) {
  const skills = [
    { key: "python", name: "Python" },
    { key: "r", name: "R" },
    { key: "sql", name: "SQL" },
    { key: "statistics", name: "Statistics" },
    { key: "data_visualization", name: "Data Visualization" },
    { key: "ai_ml", name: "AI / Machine Learning" }
  ];

  const values = skills.map((skill) => ({
    ...skill,
    score: Number(assessment?.[skill.key]) || 0
  }));

  const hasAssessment = values.some((skill) => skill.score > 0);
  const overallScore = hasAssessment
    ? Math.round(
        values.reduce((sum, skill) => sum + skill.score, 0) /
          values.length
      )
    : null;

  const focusAreas = [...values]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const hasResults = hasAssessment && recommendations?.length > 0;

  return (
    <div className="card welcome-card">
      <div className="app-title">
        <h1>StatSkill AI</h1>
        <p>Your skills, learning needs, and recommendations — all in one place.</p>
      </div>

      <div className="welcome-content">
        <div className="welcome-eyebrow">YOUR LEARNING DASHBOARD</div>
        <h2>Welcome back, {profile.name}</h2>
        <p className="welcome-subtitle">
          Your previous profile is saved on this device, so you can pick up
          where you left off.
        </p>

        {hasResults ? (
          <>
            <div className="welcome-score">
              <span className="welcome-score-label">Last overall score</span>
              <strong>{overallScore}<span className="score-denominator"> / 100</span></strong>
            </div>

            <div className="welcome-focus">
              <h3>Areas you were working on</h3>

              <div className="focus-chips">
                {focusAreas.map((skill) => (
                  <div className="focus-chip" key={skill.key}>
                    <span>{skill.name}</span>
                    <strong>{skill.score} <span>/ 100</span></strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="welcome-empty">
            <h3>Your profile is ready.</h3>
            <p>
              Complete a skill assessment to see your score, focus areas,
              and personalized learning recommendations.
            </p>
          </div>
        )}

        <div className="welcome-actions">
          <button
            className="primary-btn"
            onClick={onContinue}
          >
            {hasResults ? "Continue with my profile" : "Continue to Assessment"}
          </button>

          <button
            className="secondary-btn"
            onClick={onNewAssessment}
          >
            Start a new assessment
          </button>
        </div>

        <p className="welcome-note">
          Starting a new assessment keeps your profile details — only your
          previous skill scores and recommendations are cleared.
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   PROFILE PAGE
   ===================================================== */

function ProfilePage({ profile, updateProfile, onContinue, onClear }) {
  return (
    <div className="card">

      <div className="app-title">
        <h1>StatSkill AI</h1>
        <p>A simple way to understand your skills and find the right learning opportunities.</p>
      </div>

      <h2>Let's get to know you</h2>

      <div className="profile-form">
        <div className="profile-grid">

          <div className="profile-field">
            <label>Employee Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                updateProfile("name", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Employee ID</label>
            <input
              type="text"
              value={profile.employeeId}
              onChange={(e) =>
                updateProfile("employeeId", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Designation</label>
            <input
              type="text"
              value={profile.designation}
              onChange={(e) =>
                updateProfile("designation", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Department</label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) =>
                updateProfile("department", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Current Role</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) =>
                updateProfile("role", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>What are you currently working on?</label>
            <input
              type="text"
              value={profile.assignment}
              onChange={(e) =>
                updateProfile("assignment", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Education</label>
            <input
              type="text"
              value={profile.education}
              onChange={(e) =>
                updateProfile("education", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Years of Experience</label>
            <input
              type="number"
              value={profile.experience}
              onChange={(e) =>
                updateProfile("experience", e.target.value)
              }
            />
          </div>

          <div className="profile-field">
            <label>Training you've completed</label>
            <input
              type="text"
              value={profile.trainings}
              onChange={(e) =>
                updateProfile("trainings", e.target.value)
              }
            />
          </div>

        </div>

        <p
          style={{
            marginTop: "14px",
            marginBottom: "10px",
            fontSize: "14px",
            color: "#6b7280"
          }}
        >
          Your details are saved on this device, so you won't
          need to enter them again next time.
        </p>

        <button
          className="primary-btn"
          onClick={onContinue}
        >
          Continue to Assessment
        </button>

        <button
          type="button"
          onClick={onClear}
          style={{
            marginTop: "10px",
            background: "none",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          Clear saved details
        </button>
      </div>
    </div>
  );
}


/* =====================================================
   ASSESSMENT PAGE
   ===================================================== */

function AssessmentPage({
  assessment,
  updateAssessment,
  onSubmit
}) {
  const skills = [
    {
      key: "python",
      name: "Python",
      description:
        "How would you rate your Python skills for data analysis?"
    },
    {
      key: "r",
      name: "R",
      description:
        "How would you rate your R programming skills?"
    },
    {
      key: "sql",
      name: "SQL",
      description:
        "How would you rate your SQL and database skills?"
    },
    {
      key: "statistics",
      name: "Statistics",
      description:
        "How would you rate your understanding of statistics?"
    },
    {
      key: "data_visualization",
      name: "Data Visualization",
      description:
        "How would you rate your data visualization skills?"
    },
    {
      key: "ai_ml",
      name: "AI / ML",
      description:
        "How would you rate your AI and Machine Learning skills?"
    }
  ];

  return (
    <div className="card">

      <h2>Competency Assessment</h2>

      <p className="assessment-intro">
        Give each skill a quick rating based on what you can comfortably do today.
      </p>

      <div className="assessment-guide">
        <strong>Quick guide:</strong> 0 = just starting &nbsp; • &nbsp; 50 = comfortable with the basics &nbsp; • &nbsp; 100 = highly confident
      </div>

      <div className="assessment">

        {skills.map((skill) => (
          <div className="skill" key={skill.key}>

            <h3>{skill.name}</h3>

            <p>{skill.description}</p>

            <input
              type="number"
              min="0"
              max="100"
              value={assessment[skill.key]}
              onChange={(e) =>
                updateAssessment(
                  skill.key,
                  e.target.value
                )
              }
            />

          </div>
        ))}

        <button
          className="primary-btn"
          onClick={onSubmit}
        >
          Analyze Skill Gaps
        </button>

      </div>
    </div>
  );
}


/* =====================================================
   RESULTS PAGE
   ===================================================== */

function ResultsPage({
  profile,
  assessment,
  recommendations,
  quizPerformance,
  onRetake
}) {
  const [learningPlan, setLearningPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");
  const skills = [
    { key: "python", name: "Python", icon: "", training: "Python-focused training through NSSTA / TPAC" },
    { key: "r", name: "R", icon: "", training: "R Programming training through NSSTA / TPAC" },
    { key: "sql", name: "SQL", icon: "", training: "SQL and data management training through NSSTA / TPAC" },
    { key: "statistics", name: "Statistics", icon: "", training: "Statistics training through NSSTA / TPAC" },
    { key: "data_visualization", name: "Data Visualization", icon: "", training: "Data visualization training through NSSTA / TPAC" },
    { key: "ai_ml", name: "AI / Machine Learning", icon: "", training: "AI and Machine Learning training through NSSTA / TPAC" }
  ];

  const scoredSkills = skills.map((skill) => ({
    ...skill,
    score: Number(assessment?.[skill.key]) || 0
  }));

  const overallScore = Math.round(
    scoredSkills.reduce((total, skill) => total + skill.score, 0) /
      scoredSkills.length
  );

  const strongestSkill = [...scoredSkills].sort(
    (a, b) => b.score - a.score
  )[0];

  const focusSkills = [...scoredSkills]
    .filter((skill) => skill.score < 60)
    .sort((a, b) => a.score - b.score);

  const strongCount = scoredSkills.filter((skill) => skill.score >= 75).length;
  const developingCount = scoredSkills.filter(
    (skill) => skill.score >= 60 && skill.score < 75
  ).length;

  const highPriorityCount = focusSkills.filter(
    (skill) => skill.score < 40
  ).length;

  const scoreLabel =
    overallScore >= 75
      ? "Strong foundation"
      : overallScore >= 60
      ? "Good foundation"
      : "Growth opportunity";

  const quizTopic = quizPerformance?.topic || "Learning Material";
  let quizInsight = "";

  if (quizPerformance) {
    const quizPercent = Number(quizPerformance.percentage) || 0;

    if (quizPercent >= 80) {
      quizInsight = `Your quiz performance shows a strong grasp of the material covered in ${quizTopic}.`;
    } else if (quizPercent >= 60) {
      quizInsight = `You have a developing understanding of ${quizTopic}. Targeted practice can help strengthen your understanding.`;
    } else {
      quizInsight = `This quiz highlights an opportunity to strengthen your understanding of ${quizTopic}.`;
    }
  }

  function getStatus(score) {
    if (score >= 75) return "Strong";
    if (score >= 60) return "Developing";
    return "Needs attention";
  }

  function getPriority(score) {
    if (score < 40) return "High priority";
    if (score < 60) return "Medium priority";
    return "Optional";
  }

  function getRecommendationMessage(skillName, score) {
    if (score < 40) {
      return `Your ${skillName} score shows that starting with the fundamentals would be most useful right now.`;
    }

    if (score < 60) {
      return `You already have some exposure to ${skillName}. This recommendation is aimed at strengthening the areas where you need more practice.`;
    }

    return `Your ${skillName} foundation is developing well. This is a good option if you want to take the next step.`;
  }

  function normalizeSkill(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function findSkill(item) {
    const normalized = normalizeSkill(item.skill);

    return scoredSkills.find((skill) => {
      const skillNormalized = normalizeSkill(skill.name);

      return (
        normalized === skillNormalized ||
        (normalized.includes("aiml") && skill.key === "ai_ml") ||
        (normalized === "datavisualization" &&
          skill.key === "data_visualization")
      );
    });
  }

  const smartRecommendations = recommendations
    .map((item) => ({
      ...item,
      matchedSkill: findSkill(item)
    }))
    .filter((item) => item.matchedSkill)
    .sort((a, b) => a.matchedSkill.score - b.matchedSkill.score);

  async function generateLearningPlan() {
    setPlanLoading(true);
    setPlanError("");

    try {
      const response = await fetch(`${API_URL}/learning-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessment, profile })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Learning plan generation failed");
      }

      setLearningPlan(data.plan || null);
    } catch (error) {
      console.error(error);
      const message = String(error?.message || "").toLowerCase();

      if (
        message.includes("failed to fetch") ||
        message.includes("networkerror") ||
        message.includes("network error") ||
        message.includes("load failed")
      ) {
        setPlanError(
          "Unable to connect to the learning-plan service. Please make sure the server is running and try again."
        );
      } else {
        setPlanError(error.message || "Could not generate the AI learning plan. Please try again.");
      }
    } finally {
      setPlanLoading(false);
    }
  }

  return (
    <div className="card results-card">
      <div className="results">

        <div className="results-hero">
          <div>
            <span className="results-eyebrow">YOUR LEARNING DASHBOARD</span>
            <h2>Here's what we recommend next</h2>
            <p className="assessment-intro">
              Your assessment gives you a clear picture of what you already
              do well and where focused learning can help you grow.
            </p>
          </div>

          <div className="results-hero-badge">
            <span>Profile reviewed</span>
            <strong></strong>
          </div>
        </div>

        <section className="results-summary">
          <div
            className="score-ring"
            style={{ "--score": overallScore }}
          >
            <div className="score-ring-inner">
              <strong>{overallScore}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="summary-copy">
            <span className="summary-label">OVERALL SKILL SCORE</span>
            <h3>{scoreLabel}</h3>
            <p>
              Your strongest area is <strong>{strongestSkill.name}</strong> with
              a score of <strong>{strongestSkill.score}/100</strong>.
            </p>
          </div>

          <div className="summary-stats">
            <div>
              <strong>{strongCount}</strong>
              <span>Strong</span>
            </div>
            <div>
              <strong>{developingCount}</strong>
              <span>Developing</span>
            </div>
            <div>
              <strong>{focusSkills.length}</strong>
              <span>Focus areas</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SKILL PROFILE</span>
              <h3>Your current skill profile</h3>
            </div>
            <span className="section-count">{scoredSkills.length} skills</span>
          </div>

          <div className="skill-dashboard-grid">
            {scoredSkills.map((skill) => (
              <div className="skill-dashboard-card" key={skill.key}>
                <div className="skill-card-top">
                  <div className="skill-name">
                    <div>
                      <strong>{skill.name}</strong>
                      <span>{getStatus(skill.score)}</span>
                    </div>
                  </div>

                  <strong className="skill-score">{skill.score}</strong>
                </div>

                <div className="skill-progress">
                  <div
                    className="skill-progress-fill"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

                <div className="skill-card-bottom">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="focus-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SKILL GAPS</span>
              <h3>Where should you focus?</h3>
            </div>

            {highPriorityCount > 0 && (
              <span className="priority-summary">
                {highPriorityCount} high-priority{" "}
                {highPriorityCount === 1 ? "area" : "areas"}
              </span>
            )}
          </div>

          {focusSkills.length === 0 ? (
            <div className="success-message focus-success">
              
              <div>
                <strong>No major skill gaps found</strong>
                <p>
                  You have a solid foundation across all assessed areas.
                  Keep practicing and applying these skills in your work.
                </p>
              </div>
            </div>
          ) : (
            <div className="focus-grid">
              {focusSkills.slice(0, 3).map((skill, index) => (
                <div className="focus-card" key={skill.key}>
                  <div className="focus-card-number">0{index + 1}</div>

                  <div className="focus-card-content">
                    <div className="focus-card-title">
                      <strong>{skill.name}</strong>
                      <span>{skill.score}/100</span>
                    </div>

                    <p>
                      {skill.score < 40
                        ? "Start with the fundamentals and build confidence step by step."
                        : "A little more focused practice can help strengthen this skill."}
                    </p>

                    <span
                      className={`priority-pill ${
                        skill.score < 40 ? "high" : "medium"
                      }`}
                    >
                      {getPriority(skill.score)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="recommendation-section">
          <div className="recommendation-heading">
            <div>
              <span className="section-kicker">PERSONALIZED LEARNING</span>
              <h2>What we recommend for you</h2>
              <p className="assessment-intro">
                These suggestions connect your current skill gaps with learning
                opportunities available through iGOT Karmayogi and NSSTA / TPAC.
              </p>
            </div>
          </div>

          {smartRecommendations.length === 0 ? (
            <div className="success-message">
              No major skill gaps were found. Keep strengthening your
              current skills.
            </div>
          ) : (
            <div className="recommendation-list">
              {smartRecommendations.map((item, index) => {
                const skill = item.matchedSkill;

                return (
                  <article
                    className="recommendation-card"
                    key={`${item.skill}-${index}`}
                  >
                    <div className="recommendation-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="recommendation-main">
                      <div className="recommendation-top">
                        <div className="recommendation-skill">
                          <div>
                            <span className="recommendation-label">
                              RECOMMENDED FOR
                            </span>
                            <h3>{skill.name}</h3>
                          </div>
                        </div>

                        <div className="recommendation-score">
                          <strong>{skill.score}</strong>
                          <span>/100</span>
                        </div>
                      </div>

                      <div className="recommendation-reason">
                        <span>WHY THIS?</span>
                        <p>
                          {item.reason || getRecommendationMessage(skill.name, skill.score)}
                        </p>
                        {(profile.role || profile.designation || profile.assignment) && (
                          <span className="role-alignment-badge">Aligned to your role and assignment</span>
                        )}
                      </div>

                      <div className="learning-path">
                        <div className="learning-step">
                          <div>
                            <span>RECOMMENDED COURSE</span>
                            <strong>{item.course}</strong>
                          </div>
                        </div>

                        <div className="learning-step">
                          <div>
                            <span>PLATFORM</span>
                            <strong>{item.platform}</strong>
                          </div>
                        </div>

                        <div className="learning-step">
                          <div>
                            <span>FURTHER TRAINING</span>
                            <strong>{skill.training}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="ai-plan-section">
          <div className="ai-plan-header">
            <div>
              <span className="section-kicker">AI LEARNING PLAN</span>
              <h3>Build your 4-week improvement plan </h3>
              <p className="assessment-intro">
                Gemini uses your skill gaps and profile details to create a practical weekly learning path.
              </p>
            </div>
            <button
              className="primary-btn"
              onClick={generateLearningPlan}
              disabled={planLoading}
            >
              {planLoading ? "Generating plan..." : learningPlan ? "Regenerate AI Plan" : "Generate AI Plan "}
            </button>
          </div>

          {planError && <div className="quiz-error">{planError}</div>}

          {learningPlan && (
            <div className="ai-plan-card">
              <div className="ai-plan-summary">
                <span className="recommendation-label">PERSONALIZED ROADMAP</span>
                <h3>{learningPlan.title}</h3>
                <p>{learningPlan.summary}</p>
              </div>
              <div className="ai-plan-weeks">
                {(learningPlan.weeks || []).map((week) => (
                  <article className="ai-week-card" key={week.week}>
                    <div className="ai-week-number">W{week.week}</div>
                    <div>
                      <span className="section-kicker">WEEK {week.week}</span>
                      <h4>{week.focus}</h4>
                      <strong>Activities</strong>
                      <ul>{(week.activities || []).map((item, index) => <li key={index}>{item}</li>)}</ul>
                      <strong>Resources</strong>
                      <ul>{(week.resources || []).map((item, index) => <li key={index}>{item}</li>)}</ul>
                      <p><strong>Expected outcome:</strong> {week.outcome}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {quizPerformance && (
          <section className="quiz-evidence-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">LEARNING EVIDENCE</span>
                <h3>What your quiz tells us</h3>
              </div>
              <span className="evidence-badge">{quizTopic}</span>
            </div>

            <div className="quiz-evidence-card">
              <div className="evidence-score">
                <strong>{quizPerformance.percentage}%</strong>
                <span>
                  {quizPerformance.score} / {quizPerformance.total} correct
                </span>
              </div>

              <div className="evidence-copy">
                <span>RECENT QUIZ PERFORMANCE</span>
                <h4>{quizTopic}</h4>
                <p>{quizInsight}</p>
                <small>Based on: {quizPerformance.fileName}</small>
              </div>
            </div>

            <div className="evidence-note">
              
              <p>
                This quiz evidence complements your competency assessment. It is generated
                directly from the uploaded learning material and helps show your
                demonstrated understanding of that topic.
              </p>
            </div>
          </section>
        )}

        <div className="results-footer">
          <div>
            <strong>Ready to improve your skill profile?</strong>
            <span>
              Update your assessment anytime to refresh your recommendations.
            </span>
          </div>

          <button
            className="primary-btn results-retake-btn"
            onClick={onRetake}
          >
            Update My Assessment
          </button>
        </div>

        <div className="success-message">
          Your recommendations are based on your current skill profile.
        </div>

      </div>
    </div>
  );
}


/* =====================================================
   AI QUIZ PAGE
   ===================================================== */

function QuizPage({ onQuizComplete }) {
  const [quizFile, setQuizFile] = useState(null);
  const [quizTopic, setQuizTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  function resetQuiz() {
    setQuiz([]);
    setAnswers({});
    setCurrentQuestion(0);
    setQuizScore(null);
    setShowResults(false);
    setQuizStarted(false);
    setQuizTopic("");
    setError("");
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;

    if (file && file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      setQuizFile(null);
      return;
    }

    setQuizFile(file);
    resetQuiz();
  }

  async function generateQuiz() {
    if (!quizFile) {
      setError("Please upload a PDF learning material first.");
      return;
    }

    setLoading(true);
    setError("");
    resetQuiz();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", quizFile);
      formData.append(
        "number_of_questions",
        String(numberOfQuestions)
      );

      const response = await fetch(
        `${API_URL}/generate-quiz`,
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("Quiz generation failed. Please try again.");
      }

      const data = await response.json();
      const detectedTopic = data.topic || "Learning Material";
      const questions = data.questions || [];

      if (questions.length === 0) {
        throw new Error("No questions were generated from this PDF.");
      }

      setQuizTopic(detectedTopic);
      setQuiz(questions);
      setAnswers({});
      setCurrentQuestion(0);
      setQuizScore(null);
      setShowResults(false);
      setQuizStarted(true);
    } catch (err) {
      const message = String(err?.message || "").toLowerCase();

      if (
        message.includes("failed to fetch") ||
        message.includes("networkerror") ||
        message.includes("network error") ||
        message.includes("load failed")
      ) {
        setError(
          "Unable to connect to the quiz service. Please make sure the server is running and try again."
        );
      } else {
        setError(
          err?.message ||
            "Unable to generate the quiz right now. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionIndex, option) {
    if (showResults) return;

    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: option
    }));
  }

  function calculateScore() {
    let correct = 0;

    quiz.forEach((question, index) => {
      const selected = answers[index];
      const correctAnswer =
        question.answer ??
        question.correct_answer ??
        question.correctAnswer;

      if (
        selected &&
        correctAnswer &&
        String(selected).trim().toLowerCase() ===
          String(correctAnswer).trim().toLowerCase()
      ) {
        correct += 1;
      }
    });

    return correct;
  }

  function finishQuiz() {
    const unanswered = quiz.length - Object.keys(answers).length;

    if (unanswered > 0) {
      const shouldFinish = window.confirm(
        `You still have ${unanswered} unanswered ${
          unanswered === 1 ? "question" : "questions"
        }. Submit anyway?`
      );

      if (!shouldFinish) return;
    }

    const score = calculateScore();
    const percentage = Math.round((score / quiz.length) * 100);

    const performance = {
      skill: null,
      topic: quizTopic || "Learning Material",
      score,
      total: quiz.length,
      percentage,
      fileName: quizFile?.name || "Uploaded learning material",
      completedAt: new Date().toISOString()
    };

    localStorage.setItem(
      "statskill_quiz_performance",
      JSON.stringify(performance)
    );

    if (onQuizComplete) {
      onQuizComplete(performance);
    }

    setQuizScore(score);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restartGeneratedQuiz() {
    setAnswers({});
    setCurrentQuestion(0);
    setQuizScore(null);
    setShowResults(false);
    setQuizStarted(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getScoreMessage(score, total) {
    const percentage = Math.round((score / total) * 100);

    if (percentage >= 80) {
      return {
        emoji: "",
        title: "Excellent work!",
        text: "You have a strong understanding of the material."
      };
    }

    if (percentage >= 60) {
      return {
        emoji: "",
        title: "Good progress!",
        text: "You have a solid base. A little more practice can make it stronger."
      };
    }

    return {
      emoji: "",
      title: "Keep learning!",
      text: "Review the material and try the quiz again to build confidence."
    };
  }

  function getCorrectAnswer(question) {
    return (
      question.answer ??
      question.correct_answer ??
      question.correctAnswer ??
      ""
    );
  }

  function getQuestionOptions(question) {
    if (Array.isArray(question.options)) return question.options;

    return ["A", "B", "C", "D"]
      .map((letter) => question[letter] ?? question[letter.toLowerCase()])
      .filter(Boolean);
  }

  if (!quizStarted) {
    return (
      <div className="card quiz-card">
        <div className="quiz-page">
          <div className="quiz-hero">
            <div>
              <span className="quiz-eyebrow">AI POWERED LEARNING</span>
              <h2>AI Intelligent Assessment Engine</h2>
              <p>
                Turn your learning material into a focused practice quiz.
                Upload a PDF and let StatSkill AI create questions from it.
              </p>
            </div>

          </div>

          <div className="quiz-setup-grid">
            <div className="quiz-setup-card">
              <div className="setup-number">01</div>
              <h3>Upload learning material</h3>
              <p>
                Choose a PDF containing the topic or training material you want
                to practise.
              </p>

              <label className="upload-box">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                />
                <strong>
                  {quizFile ? quizFile.name : "Choose a PDF file"}
                </strong>
                <small>
                  {quizFile
                    ? `${(quizFile.size / 1024 / 1024).toFixed(2)} MB`
                    : "PDF files only"}
                </small>
              </label>
            </div>

            <div className="quiz-setup-card">
              <div className="setup-number">02</div>
              <h3>Choose your quiz length</h3>
              <p>
                Pick how many questions you want to answer from the uploaded
                material.
              </p>

              <div className="question-count-options">
                {[5, 10, 15].map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={
                      numberOfQuestions === count
                        ? "count-option active"
                        : "count-option"
                    }
                    onClick={() => setNumberOfQuestions(count)}
                  >
                    <strong>{count}</strong>
                    <span>questions</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="quiz-error">{error}</div>}

          <div className="quiz-generate-area">
            <div>
              <strong>Ready to test yourself?</strong>
              <span>
                Questions will be generated from the PDF you upload.
              </span>
            </div>

            <button
              className="primary-btn quiz-generate-btn"
              onClick={generateQuiz}
              disabled={loading}
            >
              {loading ? "Generating your quiz..." : "Generate My Quiz "}
            </button>
          </div>

          {loading && (
            <div className="quiz-loading">
              <div className="loading-spinner" />
              <strong>Creating your questions...</strong>
              <span>
                StatSkill AI is reading the learning material and preparing
                your quiz.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showResults) {
    const total = quiz.length;
    const percentage = Math.round((quizScore / total) * 100);
    const resultMessage = getScoreMessage(quizScore, total);

    return (
      <div className="card quiz-card">
        <div className="quiz-page">
          <div className="quiz-result-hero">
            <div className="result-emoji">{resultMessage.emoji}</div>
            <span className="quiz-eyebrow">QUIZ COMPLETE</span>
            <h2>{resultMessage.title}</h2>
            <p>{resultMessage.text}</p>

            <div className="quiz-final-score">
              <strong>{percentage}%</strong>
              <span>
                {quizScore} out of {total} correct
              </span>
            </div>
          </div>

          <div className="quiz-performance">
            <div>
              <span>Questions</span>
              <strong>{total}</strong>
            </div>
            <div>
              <span>Correct</span>
              <strong>{quizScore}</strong>
            </div>
            <div>
              <span>Needs review</span>
              <strong>{total - quizScore}</strong>
            </div>
          </div>

          <section className="answer-review">
            <div className="section-heading">
              <div>
                <span className="section-kicker">ANSWER REVIEW</span>
                <h3>See how you performed</h3>
              </div>
            </div>

            <div className="answer-review-list">
              {quiz.map((question, index) => {
                const selected = answers[index];
                const correct = getCorrectAnswer(question);
                const isCorrect =
                  String(selected || "").trim().toLowerCase() ===
                  String(correct || "").trim().toLowerCase();

                return (
                  <div
                    className={`answer-review-card ${
                      isCorrect ? "correct" : "incorrect"
                    }`}
                    key={index}
                  >
                    <div className="review-status">
                      {isCorrect ? "" : "Incorrect"}
                    </div>

                    <div>
                      <span className="review-question-number">
                        QUESTION {index + 1}
                      </span>
                      <h4>{question.question}</h4>

                      <p>
                        <strong>Your answer:</strong>{" "}
                        {selected || "Not answered"}
                      </p>

                      {!isCorrect && correct && (
                        <p className="correct-answer">
                          <strong>Correct answer:</strong> {correct}
                        </p>
                      )}

                      {question.explanation && (
                        <div className="answer-explanation">
                          <strong> Explanation</strong>
                          <span>{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="quiz-result-actions">
            <button
              className="secondary-btn"
              onClick={restartGeneratedQuiz}
            >
              Retake Quiz
            </button>

            <button
              className="primary-btn"
              onClick={() => {
                resetQuiz();
                setQuizFile(quizFile);
              }}
            >
              Create Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz[currentQuestion];
  const options = getQuestionOptions(question);
  const selectedAnswer = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.length) * 100;
  const isLastQuestion = currentQuestion === quiz.length - 1;

  return (
    <div className="card quiz-card">
      <div className="quiz-page">

        <div className="active-quiz-header">
          <div>
            <span className="quiz-eyebrow">AI GENERATED QUIZ</span>
            <h2>Test your understanding</h2>
            <span className="quiz-active-topic">Topic: {quizTopic || "Learning Material"}</span>
          </div>

          <button
            className="quiz-exit-btn"
            onClick={resetQuiz}
          >
            Exit quiz
          </button>
        </div>

        <div className="quiz-progress-header">
          <div>
            <strong>
              Question {currentQuestion + 1}{" "}
              <span>of {quiz.length}</span>
            </strong>
            <span>{Object.keys(answers).length} answered</span>
          </div>

          <strong>{Math.round(progress)}%</strong>
        </div>

        <div className="quiz-progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className="quiz-question-card">
          <span className="question-tag">
            QUESTION {String(currentQuestion + 1).padStart(2, "0")}
          </span>

          <h3>{question.question}</h3>

          <div className="quiz-options">
            {options.map((option, optionIndex) => {
              const optionText =
                typeof option === "string"
                  ? option
                  : option.text ?? option.label ?? String(option);

              const optionLetter = String.fromCharCode(65 + optionIndex);

              return (
                <button
                  key={optionIndex}
                  type="button"
                  className={
                    selectedAnswer === optionText
                      ? "quiz-option selected"
                      : "quiz-option"
                  }
                  onClick={() =>
                    selectAnswer(currentQuestion, optionText)
                  }
                >
                  <span className="option-letter">{optionLetter}</span>
                  <span>{optionText}</span>

                  {selectedAnswer === optionText && (
                    <span className="option-check"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            className="secondary-btn"
            disabled={currentQuestion === 0}
            onClick={() =>
              setCurrentQuestion((previous) => Math.max(0, previous - 1))
            }
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              className="primary-btn"
              onClick={finishQuiz}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={() =>
                setCurrentQuestion((previous) =>
                  Math.min(quiz.length - 1, previous + 1)
                )
              }
            >
              Next Question 
            </button>
          )}
        </div>

        {!selectedAnswer && (
          <p className="quiz-tip">
             Select an answer to continue. You can also go back and change
            previous answers before submitting.
          </p>
        )}
      </div>
    </div>
  );
}


function App() {

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("statskill_theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("statskill_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [page, setPage] =
    useState(() => {
      try {
        const savedProfile = localStorage.getItem("statskill_profile");
        const savedAssessment = localStorage.getItem("statskill_assessment_v2");
        const savedRecommendations = localStorage.getItem("statskill_recommendations");

        const profileData = savedProfile ? JSON.parse(savedProfile) : null;
        const assessmentData = savedAssessment ? JSON.parse(savedAssessment) : null;
        const recommendationData = savedRecommendations
          ? JSON.parse(savedRecommendations)
          : [];

        const returningUser =
          profileData?.name?.trim() &&
          (
            Object.values(assessmentData || {}).some(
              (value) => value !== "" && Number(value) > 0
            ) ||
            recommendationData.length > 0
          );

        return returningUser ? "welcome" : "profile";
      } catch {
        return "profile";
      }
    });

  // Keep the employee details between visits so they do not have to
  // type the same information again. The data is stored only in the
  // browser on this device.
  const [profile, setProfile] =
    useState(() => {
      try {
        const saved = localStorage.getItem("statskill_profile");

        return saved
          ? JSON.parse(saved)
          : {
              name: "",
              employeeId: "",
              designation: "",
              department: "",
              role: "",
              assignment: "",
              education: "",
              experience: "",
              trainings: ""
            };
      } catch {
        return {
          name: "",
          employeeId: "",
          designation: "",
          department: "",
          role: "",
          assignment: "",
          education: "",
          experience: "",
          trainings: ""
        };
      }
    });

  const [assessment, setAssessment] =
    useState(() => {
      try {
        const saved = localStorage.getItem("statskill_assessment_v2");

        return saved
          ? JSON.parse(saved)
          : {
              python: "",
              r: "",
              sql: "",
              statistics: "",
              data_visualization: "",
              ai_ml: ""
            };
      } catch {
        return {
          python: "",
          r: "",
          sql: "",
          statistics: "",
          data_visualization: "",
          ai_ml: ""
        };
      }
    });

  const [recommendations, setRecommendations] =
    useState(() => {
      try {
        const saved = localStorage.getItem("statskill_recommendations");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

  const [quizPerformance, setQuizPerformance] =
    useState(() => {
      try {
        const saved = localStorage.getItem("statskill_quiz_performance");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    });

  // Save changes automatically whenever the user edits their profile
  // or assessment. This makes the app remember previous entries.
  useEffect(() => {
    localStorage.setItem(
      "statskill_profile",
      JSON.stringify(profile)
    );
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "statskill_assessment_v2",
      JSON.stringify(assessment)
    );
  }, [assessment]);

  useEffect(() => {
    localStorage.setItem(
      "statskill_recommendations",
      JSON.stringify(recommendations)
    );
  }, [recommendations]);


  function updateProfile(field, value) {

    setProfile((previous) => ({
      ...previous,
      [field]: value
    }));

  }


  function clearSavedProfile() {
    const emptyProfile = {
      name: "",
      employeeId: "",
      designation: "",
      department: "",
      role: "",
      assignment: "",
      education: "",
      experience: "",
      trainings: ""
    };

    setProfile(emptyProfile);
    localStorage.removeItem("statskill_profile");
  }


  function startNewAssessment() {
    const emptyAssessment = {
      python: "",
      r: "",
      sql: "",
      statistics: "",
      data_visualization: "",
      ai_ml: ""
    };

    setAssessment(emptyAssessment);
    setRecommendations([]);
    setQuizPerformance(null);

    localStorage.removeItem("statskill_assessment_v2");
    localStorage.removeItem("statskill_recommendations");
    localStorage.removeItem("statskill_quiz_performance");

    setPage("assessment");
  }


  function updateAssessment(field, value) {

    setAssessment((previous) => ({
      ...previous,
      [field]: value
    }));

  }


  async function submitAssessment() {

    const skillLabels = {
      python: "Python",
      r: "R",
      sql: "SQL",
      statistics: "Statistics",
      data_visualization: "Data Visualization",
      ai_ml: "AI / Machine Learning"
    };

    const invalidSkill = Object.keys(skillLabels).find((key) => {
      const rawValue = assessment[key];
      if (rawValue === "" || rawValue === null || rawValue === undefined) {
        return true;
      }

      const value = Number(rawValue);
      return !Number.isFinite(value) || value < 0 || value > 100;
    });

    if (invalidSkill) {
      alert(
        `${skillLabels[invalidSkill]} must have a score between 0 and 100.`
      );
      return;
    }

    const assessmentData = {
      python: Number(assessment.python) || 0,
      r: Number(assessment.r) || 0,
      sql: Number(assessment.sql) || 0,
      statistics: Number(assessment.statistics) || 0,
      data_visualization: Number(assessment.data_visualization) || 0,
      ai_ml: Number(assessment.ai_ml) || 0
    };

    try {

      const response = await fetch(
        `${API_URL}/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            assessment: assessmentData,
            profile
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Recommendation request failed"
        );
      }

      const data =
        await response.json();

      setRecommendations(
        data.recommendations || []
      );

    } catch (error) {

      console.error(error);

      /*
       * Fallback recommendations
       * if backend is unavailable.
       */

      const fallback = [];

      if (assessment.python < 60) {
        fallback.push({
          skill: "Python",
          course:
            "Python for Data Analysis",
          platform:
            "iGOT Karmayogi"
        });
      }

      if (assessment.r < 60) {
        fallback.push({
          skill: "R",
          course:
            "R Programming Fundamentals",
          platform:
            "iGOT Karmayogi"
        });
      }

      if (assessment.sql < 60) {
        fallback.push({
          skill: "SQL",
          course:
            "SQL for Data Management",
          platform:
            "iGOT Karmayogi"
        });
      }

      if (assessment.statistics < 60) {
        fallback.push({
          skill: "Statistics",
          course:
            "Statistics for Official Data Analysis",
          platform:
            "iGOT Karmayogi"
        });
      }

      if (
        assessment.data_visualization <
        60
      ) {
        fallback.push({
          skill:
            "Data Visualization",
          course:
            "Data Visualization Fundamentals",
          platform:
            "iGOT Karmayogi"
        });
      }

      if (assessment.ai_ml < 60) {
        fallback.push({
          skill: "AI/ML",
          course:
            "Introduction to Artificial Intelligence and Machine Learning",
          platform:
            "iGOT Karmayogi"
        });
      }

      setRecommendations(
        fallback
      );

    }

    setPage("results");

  }


  return (
    <div className="app">

      {/* NAVIGATION */}

      <button
        className="theme-toggle"
        onClick={() => setDarkMode((current) => !current)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="theme-toggle-icon" aria-hidden="true">
          {darkMode ? "☀" : "☾"}
        </span>
      </button>

      <div className="navbar">
        <button
          className={page === "profile" ? "active" : ""}
          onClick={() => setPage("profile")}
        >
          Profile
        </button>

        <button
          className={page === "assessment" ? "active" : ""}
          onClick={() => setPage("assessment")}
        >
          Assessment
        </button>

        <button
          className={page === "results" ? "active" : ""}
          onClick={() => setPage("results")}
        >
          Results
        </button>

        <button
          className={page === "quiz" ? "active" : ""}
          onClick={() => setPage("quiz")}
        >
          AI Quiz
        </button>
      </div>


      {/* PAGES */}

      {page === "welcome" && (
        <WelcomePage
          profile={profile}
          assessment={assessment}
          recommendations={recommendations}
          onContinue={() =>
            setPage(
              recommendations.length > 0
                ? "results"
                : "assessment"
            )
          }
          onNewAssessment={startNewAssessment}
        />
      )}

      {page === "profile" && (

        <ProfilePage
          profile={profile}
          updateProfile={updateProfile}
          onClear={clearSavedProfile}
          onContinue={() =>
            setPage("assessment")
          }
        />

      )}


      {page === "assessment" && (

        <AssessmentPage
          assessment={assessment}
          updateAssessment={
            updateAssessment
          }
          onSubmit={
            submitAssessment
          }
        />

      )}


      {page === "results" && (

        <ResultsPage
          profile={profile}
          assessment={assessment}
          recommendations={
            recommendations
          }
          quizPerformance={quizPerformance}
          onRetake={() =>
            setPage("assessment")
          }
        />

      )}


      {page === "quiz" && (
        <QuizPage
          onQuizComplete={(performance) =>
            setQuizPerformance(performance)
          }
        />
      )}

    </div>
  );
}

export default App;