import 'server-only';
import { z } from 'zod';
import { AiConfigurationError, generateObject } from '@/lib/ai/client';
import { ResumeAnalysisResponse } from '@/lib/contracts/resume-analysis';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export const dynamic = 'force-dynamic';

const AnalyzeResumeRequest = z.object({
  resumeText: z.string().max(30000).optional(),
});

const SKILL_ROLE_MAP = [
  { terms: ['react', 'javascript', 'typescript', 'frontend', 'front end'], role: 'Frontend Engineering Internship' },
  { terms: ['python', 'pandas', 'sql', 'tableau', 'statistics'], role: 'Data Science Internship' },
  { terms: ['machine learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision'], role: 'Machine Learning Internship' },
  { terms: ['figma', 'ux', 'ui', 'design', 'prototype'], role: 'Product Design Internship' },
  { terms: ['marketing', 'social media', 'seo', 'content', 'brand'], role: 'Marketing Internship' },
  { terms: ['finance', 'excel', 'valuation', 'accounting', 'investment'], role: 'Finance Internship' },
  { terms: ['cad', 'solidworks', 'mechanical', 'manufacturing'], role: 'Mechanical Engineering Internship' },
  { terms: ['cybersecurity', 'security', 'network', 'linux'], role: 'Cybersecurity Internship' },
];

function words(text: string) {
  return text.toLowerCase().match(/[a-z0-9+#.]+/g) ?? [];
}

function hasMetric(text: string) {
  return /(\d+%|\$\d+|\d+\+|\d+x|\b\d{2,}\b)/.test(text);
}

function bulletLines(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => /^[-*•]|\b(developed|built|created|led|managed|designed|implemented|analyzed|improved)\b/i.test(line));
}

function localAnalyze(resumeText: string) {
  const normalized = resumeText.toLowerCase();
  const tokens = words(resumeText);
  const bullets = bulletLines(resumeText);
  const hasEducation = /education|university|college|bachelor|major|gpa/.test(normalized);
  const hasExperience = /experience|intern|project|work|research/.test(normalized);
  const hasSkills = /skills|python|java|react|sql|excel|figma|cad/.test(normalized);
  const metrics = hasMetric(resumeText);
  const actionBullets = bullets.filter((line) =>
    /\b(built|created|led|managed|designed|implemented|analyzed|improved|launched|automated|reduced|increased)\b/i.test(
      line,
    ),
  );

  let score = 35;
  if (resumeText.length > 1200) score += 12;
  if (resumeText.length > 2500) score += 8;
  if (hasEducation) score += 10;
  if (hasExperience) score += 12;
  if (hasSkills) score += 10;
  if (metrics) score += 12;
  if (actionBullets.length >= 3) score += 10;
  score = Math.max(0, Math.min(100, score));

  const strengths = [
    hasEducation ? 'Education details are visible.' : '',
    hasSkills ? 'Skills are easy to detect for matching.' : '',
    actionBullets.length > 0 ? 'Some bullets use action-oriented language.' : '',
    metrics ? 'At least one result uses numbers or measurable impact.' : '',
  ].filter(Boolean);

  const improvements = [
    !metrics ? 'Add measurable outcomes, such as percentages, dollar impact, users served, speed improvements, or project scale.' : '',
    actionBullets.length < 3 ? 'Rewrite more bullets to start with strong action verbs and end with impact.' : '',
    !hasSkills ? 'Add a dedicated Skills section with tools, languages, frameworks, and domain skills.' : '',
    !hasExperience ? 'Add projects, coursework, research, internships, or leadership experience relevant to your target roles.' : '',
    'Tailor the top 3-5 bullets to the role you are applying for, using keywords from the internship posting.',
  ].filter(Boolean);

  const firstWeakBullet = bullets.find((line) => !hasMetric(line)) ?? 'Worked on a project for class.';
  const roleMatches = SKILL_ROLE_MAP.filter((item) =>
    item.terms.some((term) => normalized.includes(term)),
  ).slice(0, 4);
  const recommendedSearches =
    roleMatches.length > 0
      ? roleMatches.map((item) => ({
          title: item.role,
          query: item.role,
          reason: `Your resume mentions ${item.terms.find((term) => normalized.includes(term)) ?? item.terms[0]}, which aligns with this role.`,
        }))
      : [
          {
            title: 'General Internship',
            query: 'internship',
            reason: 'Add more specific skills to your resume to unlock sharper recommendations.',
          },
        ];

  return ResumeAnalysisResponse.parse({
    score,
    summary:
      score >= 75
        ? 'Your resume is fairly strong for internship search, especially if you tailor it per role.'
        : 'Your resume has a usable foundation, but stronger metrics, keywords, and project impact would improve internship matching.',
    strengths,
    improvements,
    rewrites: [
      {
        before: firstWeakBullet,
        after: `Built or improved [project/process] using [tools], resulting in [measurable outcome] for [users/team/class].`,
        reason: 'This format makes the action, tools, and impact obvious to recruiters and ATS systems.',
      },
    ],
    recommendedSearches,
    source: 'local',
  });
}

export async function POST(req: Request) {
  let user: Awaited<ReturnType<typeof requireAuth>>;
  try {
    user = await requireAuth(req);
  } catch (res) {
    return res as Response;
  }

  const json = await req.json().catch(() => null);
  const parsed = AnalyzeResumeRequest.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const profile = await prisma.userProfile.findUnique({ where: { userId: user.id } });
  const resumeText = (parsed.data.resumeText || profile?.resumeText || '').trim();
  if (resumeText.length < 80) {
    return Response.json({ error: 'Upload or paste more resume text first.' }, { status: 400 });
  }

  try {
    const analysis = await generateObject({
      temperature: 0.2,
      responseFormat: 'json_object',
      messages: [
        {
          role: 'system',
          content:
            'You are an internship career coach. Return only JSON matching this shape: score number 0-100, summary string, strengths string[], improvements string[], rewrites array of {before, after, reason}, recommendedSearches array of {title, query, reason}. Be concrete and student-focused.',
        },
        {
          role: 'user',
          content: `Analyze this resume for internship readiness. Recommend internships the student should search for, and suggest resume improvements/rewrite examples.\n\nResume:\n${resumeText.slice(0, 24000)}`,
        },
      ],
    });
    return Response.json(ResumeAnalysisResponse.parse({ ...(analysis as object), source: 'ai' }));
  } catch (error) {
    if (!(error instanceof AiConfigurationError)) {
      console.error('[resume/analyze] AI analysis failed; falling back locally', error);
    }
    return Response.json(localAnalyze(resumeText));
  }
}
