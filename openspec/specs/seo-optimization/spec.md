## ADDED Requirements

### Requirement: SeoMeta provides page-level meta tags
The system SHALL inject SEO meta tags dynamically based on route configuration.

#### Scenario: Home page meta tags
- **WHEN** user navigates to home page (/)
- **THEN** document.title = "Laravel Vue Starter - Production-Ready SPA Admin Dashboard", meta description = "Skip the boilerplate. Laravel 13 + Vue 3 + TypeScript + Tailwind + Pest + Playwright."

#### Scenario: Features page meta tags
- **WHEN** user navigates to /features
- **THEN** document.title = "Features - Laravel Vue Starter", meta description includes authentication, RBAC, media library features

#### Scenario: About page meta tags
- **WHEN** user navigates to /about
- **THEN** document.title = "About - Laravel Vue Starter", meta description describes target audience

#### Scenario: Contact page meta tags
- **WHEN** user navigates to /contact
- **THEN** document.title = "Contact - Laravel Vue Starter", meta description invites user to get in touch

### Requirement: OpenGraph provides social sharing metadata
The system SHALL inject Open Graph meta tags for social media sharing.

#### Scenario: Open Graph basic tags
- **WHEN** any public page loads
- **THEN** og:title, og:description, og:type (website), og:url are set

#### Scenario: Open Graph image tag
- **WHEN** any public page loads
- **THEN** og:image is set to 1200x630px social share image

### Requirement: TwitterCards provides Twitter metadata
The system SHALL inject Twitter Card meta tags for Twitter sharing.

#### Scenario: Twitter Card tags
- **WHEN** any public page loads
- **THEN** twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image are set

### Requirement: JsonLd provides structured data
The system SHALL inject JSON-LD structured data for search engines.

#### Scenario: SoftwareApplication schema
- **WHEN** home page loads
- **THEN** JSON-LD script tag with SoftwareApplication schema including name, description, applicationCategory, offers (free), codeRepository, license

#### Scenario: BreadcrumbList schema
- **WHEN** any public page loads
- **THEN** JSON-LD includes BreadcrumbList schema for site navigation

### Requirement: CanonicalUrl provides canonical links
The system SHALL inject canonical URL links to prevent duplicate content.

#### Scenario: Canonical URL injection
- **WHEN** any public page loads
- **THEN** <link rel="canonical" href="https://your-domain.com{currentPath}"> is injected

### Requirement: RobotsMeta provides indexing directives
The system SHALL inject robots meta tags for search engine crawling.

#### Scenario: Robots index follow
- **WHEN** any public page loads
- **THEN** <meta name="robots" content="index, follow"> is injected

### Requirement: SemanticHTML uses proper HTML5 structure
The system SHALL use semantic HTML5 elements for better accessibility and SEO.

#### Scenario: Semantic section elements
- **WHEN** landing page renders
- **THEN** sections use <header>, <nav>, <main>, <section>, <article>, <footer>, <aside> appropriately

#### Scenario: Heading hierarchy
- **WHEN** landing page renders
- **THEN** proper h1 → h2 → h3 hierarchy is maintained (one h1 per page)

#### Scenario: ARIA landmarks
- **WHEN** landing page renders
- **THEN** ARIA roles (role="navigation", role="main", role="contentinfo") are applied where needed
