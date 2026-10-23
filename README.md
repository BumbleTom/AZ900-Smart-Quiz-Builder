# AZ-900 Smart Quiz Builder

## Overview

AZ-900 Smart Quiz Builder is an interactive learning platform designed to help aspiring cloud professionals prepare for the Microsoft Azure Fundamentals (AZ-900) certification exam.

The application goes beyond traditional quiz systems by providing:

- Interactive practice questions
- Instant answer validation
- Detailed explanations
- Exam readiness tracking
- Learning analytics
- African-context learning analogies

Our goal is to make cloud computing concepts easier to understand, more relatable, and accessible to learners across Africa.

---

## Problem Statement

Many AZ-900 learners struggle with:

- Understanding why answers are correct or incorrect
- Remembering cloud computing concepts
- Identifying weak knowledge areas
- Measuring exam readiness
- Relating cloud concepts to everyday experiences

Traditional quiz platforms often focus on memorization rather than understanding.

---

## Solution

AZ-900 Smart Quiz Builder provides an engaging and educational quiz experience that helps users learn while they practice.

Features include:

✅ Interactive quizzes

✅ Instant feedback

✅ Detailed answer explanations

✅ Readiness scoring

✅ Progress tracking

✅ Topic-based performance analytics

✅ African Analogy Learning Mode

---

# African Analogy Learning Feature

One of the key innovations of this project is the use of African-inspired analogies to explain cloud computing concepts.

Many technical concepts are difficult for beginners because examples are often based on unfamiliar business or technology environments.

Our platform bridges this gap by connecting Azure concepts to familiar African experiences.

### Examples

| Azure Concept | African Analogy |
|-------------|----------------|
| Azure Virtual Machines | Renting a boda boda instead of purchasing one |
| Azure Blob Storage | Storing harvested produce in a cooperative warehouse |
| Azure Load Balancer | A traffic officer directing vehicles to less congested routes |
| Azure Scaling | Adding more matatus during rush hour to meet demand |
| Azure Backup | Keeping duplicate records of important community documents |

This feature improves:

- Concept retention
- User engagement
- Learning accessibility
- Understanding of cloud computing concepts

---

# Features

## Quiz Engine

Users can:

- Start a quiz
- Answer multiple-choice questions
- Receive instant feedback
- View explanations for every question

---

## Progress Tracking

Track:

- Questions Attempted
- Correct Answers
- Incorrect Answers
- Percentage Score

---

## Readiness Assessment

Readiness Level is calculated based on performance:

| Score Range | Readiness Level |
|------------|----------------|
| 0% - 50% | Beginner |
| 51% - 75% | Intermediate |
| 76% - 100% | Exam Ready |

---

## Performance Dashboard

Displays:

- Total Quiz Attempts
- Average Score
- Readiness Percentage
- Topic Performance
- Weak Areas
- Learning Recommendations

---

# Technology Stack

## Frontend

- Lovable
- React
- TypeScript
- Tailwind CSS

## Backend

- Supabase

## Database

- PostgreSQL

## Version Control

- Git
- GitHub

---

# System Architecture

```text
                     User
                       │
                       ▼
          AZ-900 Smart Quiz Builder
                       │
                       ▼
               Lovable Frontend
                       │
                       ▼
              Supabase Backend
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
    Topics         Questions      Quiz Sessions
                                       │
                                       ▼
                                User Answers
                                       │
                                       ▼
                               Analytics Engine
                                       │
                                       ▼
                                 Dashboard
```

---

# Database Structure

## Topics Table

Stores examination topics.

```text
topics
```

Examples:

- Cloud Concepts
- Azure Architecture
- Core Azure Services
- Security and Identity
- Governance and Compliance
- Pricing and Support

---

## Questions Table

Stores quiz questions.

```text
questions
```

### Fields

- id
- topic_id
- question
- option_a
- option_b
- option_c
- option_d
- correct_answer
- explanation
- difficulty_level

---

## Quiz Sessions Table

Stores quiz attempts.

```text
quiz_sessions
```

### Fields

- id
- user_id
- score
- percentage
- readiness_level
- completed_at

---

## User Answers Table

Stores user responses.

```text
user_answers
```

### Fields

- id
- quiz_session_id
- question_id
- selected_answer
- correct

---

# Team Members

| Name | Role |
|--------|--------|
| Belinda Tom | Project Manager, Documentation & Presentation |
| Rodah Mwikali | Frontend Developer (Lovable UI/UX) |
| Asivhannzhi Muofhe | Backend Developer (Supabase Integration) |
| Emmanuel Argut | Content & Prompt Engineering Lead |
| Erick Odiwuor | QA Testing & Deployment Lead |

---

# 📋 Team Responsibilities

## Project Manager

- Requirements gathering
- Documentation
- GitHub project management
- Presentation preparation

## Frontend Developer

- Landing page
- Quiz interface
- Dashboard UI
- Responsive design

## Backend Developer

- Database setup
- Data management
- Supabase integration
- Quiz logic

## Content & Prompt Engineer

- AZ-900 question creation
- Explanations
- African analogies
- Learning content

## QA & Deployment

- Testing
- Bug fixing
- Deployment
- User acceptance testing
---

# Project Goals

This project aims to:

- Improve Azure Fundamentals exam preparation
- Encourage concept-based learning
- Provide meaningful feedback
- Increase learner confidence
- Support accessible cloud education across Africa

---

# Future Enhancements

Potential future improvements:

- AI Study Coach
- Voice-Based Learning
- Personalized Study Plans
- Flashcard System
- Leaderboards
- Azure OpenAI Integration
- Detailed Performance Analytics
- Multi-language Support

---

# Educational Disclaimer

This project is an educational tool designed to support AZ-900 learners.

It is not affiliated with, endorsed by, or sponsored by Microsoft Corporation.

All questions are original and created for educational purposes.

---

# License

This project is developed for educational and hackathon purposes.

---

# Acknowledgements

Special thanks to:

- Microsoft Learn
- 1 Million Developers Community
- Vibe Coding Hackathon Organizers
- Lovable
- Supabase

For providing tools and learning opportunities that make cloud education more accessible.
