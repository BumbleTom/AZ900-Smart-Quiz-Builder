# AZ900-Smart-Quiz-Builder

## Overview

A smart AZ-900 exam preparation tool built with Lovable and Supabase, featuring interactive quizzes, detailed explanations, progress tracking, and readiness assessment for Azure Fundamentals learners.

## Problem Statement

Many AZ-900 learners struggle to:

- Understand why answers are correct or incorrect
- Identify weak knowledge areas
- Track exam readiness
- Maintain a structured exam preparation process

This project solves these challenges by providing interactive quizzes with explanations and progress analytics.

## Features

### Quiz System

- Multiple-choice AZ-900 practice questions
- One question displayed at a time
- Instant answer validation
- Explanation for every question

### Progress Tracking

- Total questions attempted
- Correct answers
- Incorrect answers
- Percentage score

### Readiness Assessment

Based on performance:

| Score | Readiness Level |
|---------|---------------|
| 0-50% | Beginner |
| 51-75% | Intermediate |
| 76-100% | Exam Ready |

### Dashboard

- Performance summary
- Readiness percentage
- Category-based performance tracking

---

## Technology Stack

### Frontend

- Lovable
- React
- TypeScript
- Tailwind CSS

### Backend

- Supabase

### Database

- PostgreSQL (Supabase)

### Deployment

- Lovable Publish
- GitHub

---

## System Architecture

```text
User
  |
  v
Lovable Frontend
  |
  v
Supabase Database
  |
  v
Quiz Engine
  |
  v
Scoring System
  |
  v
Dashboard
```

---

## Database Schema
