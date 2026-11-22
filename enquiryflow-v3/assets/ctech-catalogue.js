/** Ctech Academy editorial course proposals. NOT authorized live offerings. No fees, dates, trainer or certification claims. */
export const courseTemplates=Object.freeze([
  {
    "title": "AWS Cloud Engineering",
    "category": "Cloud Computing",
    "level": "Beginner to Intermediate",
    "description": "A proposed hands-on pathway covering core AWS cloud services, secure networking, compute, storage, observability, and deployment fundamentals.",
    "prerequisites": "Basic computer and networking knowledge; Linux fundamentals are helpful.",
    "audience": "Students, graduates, support engineers, and developers exploring AWS cloud roles.",
    "curriculum": [
      "Cloud fundamentals, AWS global infrastructure and shared responsibility",
      "IAM identities, policies, MFA and secure account access",
      "VPC networking, subnets, route tables and security groups",
      "EC2 instances, load balancing and Auto Scaling concepts",
      "S3 storage, lifecycle policies and backup principles",
      "RDS databases and managed service selection",
      "CloudWatch monitoring, alarms and troubleshooting",
      "Cost awareness, architecture review and a capstone deployment"
    ],
    "outcomes": [
      "Explain core AWS services and security responsibilities",
      "Design a basic secure cloud architecture",
      "Deploy and observe a small cloud application"
    ],
    "projects": [
      "Build a secure VPC and web application deployment",
      "Prepare a monitoring and cost-awareness runbook"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "aws-cloud-engineering"
  },
  {
    "title": "Microsoft Azure Cloud Fundamentals",
    "category": "Cloud Computing",
    "level": "Beginner to Intermediate",
    "description": "A proposed Azure training path introducing resources, identity, networking, virtual machines, storage, monitoring and cloud governance.",
    "prerequisites": "Basic IT concepts; some operating-system knowledge is helpful.",
    "audience": "Graduates, system administrators and software professionals beginning Azure cloud work.",
    "curriculum": [
      "Azure regions, subscriptions, resource groups and governance",
      "Microsoft Entra ID, roles and access management",
      "Virtual networks, subnets, network security groups and DNS",
      "Azure virtual machines and application hosting options",
      "Storage accounts, blobs, backup and recovery concepts",
      "Azure Monitor, logs and basic alerting",
      "Azure CLI and Bicep introduction",
      "Cost control and a supervised deployment capstone"
    ],
    "outcomes": [
      "Navigate common Azure services and resource structures",
      "Apply least-privilege and networking principles",
      "Deploy and monitor a basic Azure workload"
    ],
    "projects": [
      "Create an Azure environment using structured resources",
      "Document monitoring alerts and a recovery checklist"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "microsoft-azure-cloud-fundamentals"
  },
  {
    "title": "DevOps Engineering and CI/CD",
    "category": "DevOps & Platform",
    "level": "Beginner to Intermediate",
    "description": "A proposed engineering path covering version control, build automation, continuous delivery, infrastructure workflows, quality gates and operational reliability.",
    "prerequisites": "Basic scripting or programming knowledge is recommended.",
    "audience": "Developers, system engineers and graduates moving toward DevOps roles.",
    "curriculum": [
      "Linux command line and source-control workflows",
      "Git branches, pull requests and review practices",
      "Build tools, dependency management and artifact repositories",
      "Jenkins pipelines and CI fundamentals",
      "GitHub Actions and automated validation",
      "Docker images, registries and secure builds",
      "Environment configuration, release strategies and rollback",
      "Pipeline security, observability and delivery capstone"
    ],
    "outcomes": [
      "Design a reproducible CI pipeline",
      "Explain automated release gates and rollback",
      "Troubleshoot common build and deployment failures"
    ],
    "projects": [
      "Create a CI/CD pipeline with tests and security checks",
      "Document and rehearse a deployment rollback"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "devops-engineering-and-ci-cd"
  },
  {
    "title": "Docker and Kubernetes Administration",
    "category": "DevOps & Platform",
    "level": "Intermediate",
    "description": "A proposed container engineering path focused on reliable image builds, Kubernetes workloads, services, configuration, storage and troubleshooting.",
    "prerequisites": "Comfort with Linux and basic application deployment concepts.",
    "audience": "Application engineers, infrastructure administrators and platform learners.",
    "curriculum": [
      "Containers, images, registries and Dockerfiles",
      "Multi-stage builds, image optimization and vulnerability basics",
      "Kubernetes architecture and local cluster setup",
      "Pods, Deployments, ReplicaSets and rolling updates",
      "Services, Ingress and cluster networking concepts",
      "ConfigMaps, Secrets and persistent volumes",
      "Health probes, resource limits and autoscaling concepts",
      "Logs, events, troubleshooting and cluster capstone"
    ],
    "outcomes": [
      "Containerize a small application safely",
      "Deploy and update workloads on Kubernetes",
      "Investigate common workload and networking failures"
    ],
    "projects": [
      "Containerize a web API with a multi-stage build",
      "Deploy an application with health checks and rollout strategy"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "docker-and-kubernetes-administration"
  },
  {
    "title": "Terraform and Infrastructure as Code",
    "category": "DevOps & Platform",
    "level": "Intermediate",
    "description": "A proposed infrastructure automation path introducing declarative cloud provisioning, Terraform modules, state management and reviewable changes.",
    "prerequisites": "Basic cloud networking and command-line knowledge.",
    "audience": "Cloud engineers, DevOps professionals and infrastructure administrators.",
    "curriculum": [
      "Infrastructure as Code concepts and Terraform workflow",
      "Providers, resources, data sources and variables",
      "Plan, apply, destroy and change review",
      "Terraform state, remote backends and locking",
      "Module design, reuse and composition",
      "Cloud identity, networking and secure provisioning",
      "Drift detection, validation and CI integration",
      "Environment separation, policy considerations and capstone"
    ],
    "outcomes": [
      "Describe safe infrastructure change workflows",
      "Build reusable Terraform modules",
      "Review plans and manage state responsibly"
    ],
    "projects": [
      "Provision a small cloud environment using reusable modules",
      "Create a plan-and-review CI workflow"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "terraform-and-infrastructure-as-code"
  },
  {
    "title": "Python Programming and Automation",
    "category": "Programming",
    "level": "Beginner",
    "description": "A proposed practical Python course covering programming foundations, files, data handling, APIs, testing, scripting and small automation projects.",
    "prerequisites": "No previous programming experience required; basic computer familiarity recommended.",
    "audience": "Beginners, students, analysts and IT professionals learning Python.",
    "curriculum": [
      "Python setup, variables, data types and operators",
      "Conditions, loops and problem-solving patterns",
      "Functions, modules and code organization",
      "Lists, dictionaries, sets and comprehensions",
      "File operations, CSV, JSON and error handling",
      "Object-oriented programming essentials",
      "HTTP APIs, requests and scripting workflows",
      "Testing, virtual environments and automation capstone"
    ],
    "outcomes": [
      "Write clear Python programs",
      "Process common file and API formats",
      "Automate a repeatable manual task"
    ],
    "projects": [
      "Build a CSV-based report automation script",
      "Create an API data retrieval and validation tool"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "python-programming-and-automation"
  },
  {
    "title": "Java and Spring Boot Backend Development",
    "category": "Programming",
    "level": "Beginner to Intermediate",
    "description": "A proposed backend pathway from Java basics to object-oriented design, REST services, data persistence, security concepts and testing.",
    "prerequisites": "Logical problem solving; familiarity with any programming language can help.",
    "audience": "Students and developers preparing for Java backend development.",
    "curriculum": [
      "Java syntax, control flow and exception handling",
      "Object orientation, collections and generics",
      "Streams, modern Java language features and build tools",
      "Relational database fundamentals and JDBC",
      "Spring Boot application structure and configuration",
      "REST API design, validation and error responses",
      "Spring Data JPA and persistence patterns",
      "Authentication concepts, unit tests and backend capstone"
    ],
    "outcomes": [
      "Build and explain a Java REST API",
      "Apply basic persistence and API validation",
      "Write automated tests for common service logic"
    ],
    "projects": [
      "Develop a course-enquiry REST service",
      "Add validation, persistence and unit tests"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "java-and-spring-boot-backend-development"
  },
  {
    "title": "C# and ASP.NET Core Development",
    "category": "Programming",
    "level": "Beginner to Intermediate",
    "description": "A proposed C# and modern .NET development path covering language fundamentals, web APIs, data access, dependency injection and testing.",
    "prerequisites": "Basic programming knowledge is helpful but not mandatory.",
    "audience": "Graduates and developers interested in C# and .NET backend roles.",
    "curriculum": [
      "C# syntax, types, conditions and collections",
      "Object-oriented design and interfaces",
      "LINQ, async/await and exception handling",
      "ASP.NET Core project structure and dependency injection",
      "REST endpoints, model binding and validation",
      "Entity Framework Core and database migrations",
      "Configuration, logging, security and error handling",
      "Unit testing, deployment basics and API capstone"
    ],
    "outcomes": [
      "Develop a C# web API",
      "Connect application logic to a relational database",
      "Test and troubleshoot a service"
    ],
    "projects": [
      "Build a student course catalogue API",
      "Implement structured logging and automated API tests"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "c-and-asp-net-core-development"
  },
  {
    "title": "Frontend Web Development",
    "category": "Web Development",
    "level": "Beginner",
    "description": "A proposed front-end pathway covering responsive websites, accessible HTML, CSS, JavaScript and component-based UI development.",
    "prerequisites": "No coding background required; familiarity with using websites helps.",
    "audience": "Beginners and students learning browser-based development.",
    "curriculum": [
      "Semantic HTML, forms and document structure",
      "CSS layout, flexbox, grid and responsive design",
      "JavaScript variables, functions and data structures",
      "DOM updates, events and browser debugging",
      "Fetching APIs and displaying remote information",
      "Accessibility, focus states and form validation",
      "React fundamentals and reusable components",
      "Testing basics, performance and portfolio capstone"
    ],
    "outcomes": [
      "Build a responsive accessible webpage",
      "Add interactivity and API data",
      "Organize reusable UI components"
    ],
    "projects": [
      "Create a responsive course listing website",
      "Develop an interactive course-search interface"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "frontend-web-development"
  },
  {
    "title": "Full-Stack JavaScript with React and Node.js",
    "category": "Web Development",
    "level": "Intermediate",
    "description": "A proposed full-stack path covering React interfaces, Node.js APIs, relational data, authentication fundamentals and deployment.",
    "prerequisites": "HTML, CSS and basic JavaScript are recommended.",
    "audience": "Frontend learners and developers moving into full-stack projects.",
    "curriculum": [
      "Modern JavaScript, modules and async workflows",
      "React components, hooks and application state",
      "Routing, forms and client-side validation",
      "Node.js and Express API architecture",
      "REST patterns, validation and error handling",
      "SQL data models and server-side persistence",
      "Authentication concepts and secure API boundaries",
      "Testing, deployment practices and full-stack capstone"
    ],
    "outcomes": [
      "Build a UI connected to a backend API",
      "Design basic relational data models",
      "Apply secure data-handling practices"
    ],
    "projects": [
      "Create a course registration application",
      "Add role-aware admin features and a test suite"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "full-stack-javascript-with-react-and-node-js"
  },
  {
    "title": "Software Testing and API Automation",
    "category": "Quality Engineering",
    "level": "Beginner to Intermediate",
    "description": "A proposed software quality course spanning requirements analysis, test-case design, exploratory testing, APIs and UI automation foundations.",
    "prerequisites": "Basic computer skills; introductory programming is useful for automation.",
    "audience": "Freshers, manual testers and developers expanding their QA skills.",
    "curriculum": [
      "Software testing principles and SDLC/STLC",
      "Test scenarios, test cases and defect reporting",
      "Boundary-value, equivalence and exploratory testing",
      "API concepts, HTTP, JSON and Postman collections",
      "SQL checks and test data strategies",
      "UI automation concepts with Playwright or Selenium",
      "Assertions, reusable fixtures and CI execution",
      "Reporting, debugging, accessibility and test capstone"
    ],
    "outcomes": [
      "Write effective test cases and defect reports",
      "Validate REST API behavior",
      "Build a small automated regression suite"
    ],
    "projects": [
      "Test an admissions form end to end",
      "Automate a smoke test for a sample web app"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "software-testing-and-api-automation"
  },
  {
    "title": "SQL, Excel and Power BI Data Analytics",
    "category": "Data & Analytics",
    "level": "Beginner to Intermediate",
    "description": "A proposed analytics pathway covering structured datasets, spreadsheet analysis, relational queries, visual dashboards and data storytelling.",
    "prerequisites": "Basic spreadsheet familiarity helpful; no advanced mathematics required.",
    "audience": "Students, graduates and professionals exploring data analyst work.",
    "curriculum": [
      "Data cleaning, quality and analytical questions",
      "Excel formulas, tables and pivot summaries",
      "SQL SELECT, filters, joins and aggregates",
      "Subqueries, window functions and query practice",
      "Data modeling and business metric definitions",
      "Power Query and Power BI transformation",
      "DAX basics, charts and interactive reports",
      "Dashboard narrative, validation and capstone"
    ],
    "outcomes": [
      "Clean and summarize tabular data",
      "Write useful analytical SQL queries",
      "Design a dashboard with clear measures"
    ],
    "projects": [
      "Analyze an anonymized sales dataset",
      "Create a Power BI KPI dashboard with explanations"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "sql-excel-and-power-bi-data-analytics"
  },
  {
    "title": "Data Science and Machine Learning Foundations",
    "category": "Data & Analytics",
    "level": "Intermediate",
    "description": "A proposed applied data science introduction covering Python data analysis, statistics, supervised learning, model evaluation and responsible interpretation.",
    "prerequisites": "Python basics and school-level mathematics are recommended.",
    "audience": "Analysts, programmers and students starting applied machine learning.",
    "curriculum": [
      "Python data tools, NumPy and pandas",
      "Data exploration and visualization",
      "Statistics, probability and sampling concepts",
      "Feature engineering and train/test separation",
      "Regression and classification techniques",
      "Metrics, cross-validation and data leakage",
      "Model interpretation, bias and limitations",
      "Reproducible experiment notebook and capstone"
    ],
    "outcomes": [
      "Prepare and explore a dataset",
      "Train and evaluate introductory models",
      "Explain uncertainty, bias and model limitations"
    ],
    "projects": [
      "Predict a numeric outcome from public sample data",
      "Compare classifiers with proper validation"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "data-science-and-machine-learning-foundations"
  },
  {
    "title": "Linux Administration and Cybersecurity Basics",
    "category": "IT Operations & Security",
    "level": "Beginner to Intermediate",
    "description": "A proposed IT operations and defensive security introduction covering Linux systems, identity, permissions, networking, logs and incident response basics.",
    "prerequisites": "Basic computer and operating system familiarity.",
    "audience": "IT support learners, system administrators and security beginners.",
    "curriculum": [
      "Linux shell, filesystem and package managers",
      "Users, groups, permissions and privilege boundaries",
      "Processes, services and systemd concepts",
      "Networking tools, SSH and firewall basics",
      "Patch management, backups and configuration checks",
      "Security hygiene, authentication and secrets handling",
      "Log review, monitoring and incident triage",
      "Hardening checklist and recovery scenario"
    ],
    "outcomes": [
      "Operate a Linux system from the terminal",
      "Apply basic security hardening practices",
      "Interpret logs during a simple incident"
    ],
    "projects": [
      "Prepare a documented Linux hardening baseline",
      "Investigate a simulated service outage from logs"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "linux-administration-and-cybersecurity-basics"
  },
  {
    "title": "Generative AI and Practical LLM Applications",
    "category": "AI & Automation",
    "level": "Beginner to Intermediate",
    "description": "A proposed practical introduction to large language models, retrieval-augmented generation, prompt evaluation, privacy and safe AI-enabled workflows.",
    "prerequisites": "Basic digital literacy; Python fundamentals helpful for coding projects.",
    "audience": "Students, developers and business users exploring applied AI.",
    "curriculum": [
      "LLM capabilities, limitations and responsible use",
      "Prompt design, evaluation and error patterns",
      "Structured outputs and task automation concepts",
      "Embeddings and semantic search fundamentals",
      "Retrieval-augmented generation pipelines",
      "Grounding, citation quality and hallucination checks",
      "Privacy, access control, costs and model evaluation",
      "Prototype, test and document an AI workflow"
    ],
    "outcomes": [
      "Design and evaluate a useful AI workflow",
      "Explain grounding and model limitations",
      "Build a small prototype with safe handling"
    ],
    "projects": [
      "Create a knowledge-base question answering prototype",
      "Test responses against an evaluation set"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "generative-ai-and-practical-llm-applications"
  },
  {
    "title": "Site Reliability Engineering and Observability",
    "category": "DevOps & Platform",
    "level": "Intermediate",
    "description": "A proposed reliability course introducing service health, SLOs, metrics, logs, traces, incident response, automation and capacity planning.",
    "prerequisites": "Basic Linux, scripting and service deployment experience.",
    "audience": "Operations engineers, DevOps practitioners and developers interested in reliability.",
    "curriculum": [
      "Reliability goals, SLI/SLO/SLA concepts",
      "Metrics, logs and distributed tracing",
      "Monitoring dashboards and alert design",
      "Incident severity, communication and escalation",
      "Root cause analysis and blameless postmortems",
      "Error budgets, toil and runbook automation",
      "Performance bottlenecks and capacity basics",
      "Failure simulation and reliability capstone"
    ],
    "outcomes": [
      "Define meaningful service indicators",
      "Investigate service issues using telemetry",
      "Document operational response and improvements"
    ],
    "projects": [
      "Create a synthetic service health dashboard",
      "Write an incident runbook and postmortem"
    ],
    "source": "CTECH_EDITORIAL_PROPOSAL",
    "published": false,
    "verified_at": null,
    "fee_inr": null,
    "fee_note": "Fees not approved; confirm with institute before publishing.",
    "duration_weeks": null,
    "delivery_modes": [],
    "source_url": null,
    "slug": "site-reliability-engineering-and-observability"
  }
]);
export const catalogueVersion='ctech-course-proposals-2026-11-22';
export function remainingCourseTemplates(existing=[]){
 const normalize=s=>String(s||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const known=new Set(existing.map(x=>normalize(x.slug||x.title)));
 return courseTemplates.filter(t=>!known.has(normalize(t.slug)));
}

/** Suggested *unpublished* website FAQ drafts. Review before publishing. */
export const faqTemplates=Object.freeze([
  {
    "question": "How do I submit an enquiry to Ctech Academy?",
    "answer": "Open the Enquiry section, sign in with a verified Google account, read the privacy notice, complete the form and confirm consent. A successful submission displays a reference number. Staff review enquiries in their private dashboard.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "Where can I find course prices?",
    "answer": "Only fees explicitly published on a course page should be treated as quoted. When a fee is not available, contact Ctech Academy using the enquiry form for confirmation before enrolling or paying.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "Where are upcoming batches shown?",
    "answer": "Only schedules approved and published by Ctech Academy appear in Upcoming batches. If none appear for a course, ask staff about potential future availability. An enquiry is not a seat reservation.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "Are classes online or in-person?",
    "answer": "The learning format for each course is shown only after Ctech Academy has confirmed and published it. Ask staff about delivery options if the course page does not specify a mode.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "Does submitting an enquiry mean I am enrolled?",
    "answer": "No. Submitting an enquiry sends your request to authorized staff; it does not reserve a seat, confirm admission, or initiate a payment.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "Does Ctech Academy guarantee employment or placement?",
    "answer": "This website does not promise placement, employment, interviews, or a particular salary. Ask institute staff for any documented career-support policy before making an enrolment decision.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "Does a course include a certificate?",
    "answer": "Certificate arrangements have not been confirmed on this website. Ask institute staff whether a specific course includes a certificate, assessment requirements, and any conditions before registering.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  },
  {
    "question": "How do I request correction or deletion of my enquiry?",
    "answer": "Review the website's Privacy and deletion requests page and contact the institute's published privacy email. Only authorized staff can access private enquiries; automatic deletion is not currently configured.",
    "published": false,
    "course_id": null,
    "source_url": null,
    "reviewed_at": null,
    "source": "CTECH_EDITORIAL_PROPOSAL"
  }
]);
export function remainingFaqTemplates(existing=[]){
 const normalize=x=>String(x||'').trim().toLowerCase().replace(/\s+/g,' ');
 const known=new Set(existing.map(x=>normalize(x.question)));
 return faqTemplates.filter(t=>!known.has(normalize(t.question)));
}
