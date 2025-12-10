SkillSwap

Smart Peer Skill-Exchange Platform (MERN)

🚀 Overview

SkillSwap connects people who want to learn and people who can teach.
It uses a matching algorithm to suggest the best partners based on:

Skills you know

Skills you want to learn

Learning style compatibility

Bio similarity (cosine similarity NLP)

Once matched, users can send requests and connect via email or LinkedIn to collaborate.

Learn faster by teaching. Grow faster by connecting.

🧠 Key Features
Feature	Description
🔐 Authentication	Secure login using JWT
👤 User Profiles	SkillsKnow, SkillsWant, Learning Style, Bio, LinkedIn
🎯 Smart Matching	Match score calculated from 3 factors
🤝 Connection Workflow	Send, accept, reject requests
📬 Contact Sharing	Show email/LinkedIn only after accepted
🔎 Suggestions Page	Shows best compatible partners
🎨 Modern UI	Clean professional auth layout
🧮 Matching Algorithm (Core Logic)

Match score =
✔ Skill overlap score
✔ Learning-style compatibility
✔ Bio similarity (cosine similarity between embeddings)

This logic makes SkillSwap more than a CRUD app —
It’s an intelligent matchmaking system.
