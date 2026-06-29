## Requirements

### Requirement: User can edit their profile information
The system SHALL provide a Personal Information section with a two-sub-column form: Avatar (35%) on the left, and name, username, read-only email on the right (65%). A single "Update" button submits name and username changes. Email is displayed as a read-only field and is not submitted. Avatar upload and removal remain interactive within the section.

#### Scenario: Personal Information section shows name, username, and read-only email
- **WHEN** any authenticated user visits `/my-profile`
- **THEN** the Personal Information form displays editable Name and Username fields
- **AND** displays a read-only Email field pre-filled with the user's email

#### Scenario: Superadmin successfully updates profile info
- **WHEN** superadmin submits the info form with valid name and username
- **THEN** the system updates the user record in the database
- **AND** the auth store is refreshed so the new name appears in the header

#### Scenario: Admin successfully updates profile info
- **WHEN** admin submits the info form with valid name and username
- **THEN** the system updates the user record in the database
- **AND** the auth store is refreshed so the new name appears in the header

#### Scenario: User role successfully updates profile info
- **WHEN** a user with the `user` role submits the info form with valid name and username
- **THEN** the system updates the user record in the database

#### Scenario: Duplicate username owned by another user is rejected
- **WHEN** a user submits the info form with a username already taken by a different user
- **THEN** the system responds with 422 and displays an inline error on the username field

#### Scenario: Same username is accepted for the current user
- **WHEN** a user submits the info form with their own current username
- **THEN** the system accepts the request and updates other fields without error

### Requirement: User can change their password
The system SHALL provide a form requiring the current password, new password, and confirmation. An incorrect current password SHALL return a 422 with an error on that field.

#### Scenario: Superadmin successfully changes password
- **WHEN** superadmin submits the password form with a correct current password and matching new password
- **THEN** the password is updated in the database and a success toast is shown

#### Scenario: Admin successfully changes password
- **WHEN** admin submits the password form with a correct current password and matching new password
- **THEN** the password is updated in the database and a success toast is shown

#### Scenario: User role successfully changes password
- **WHEN** a user with the `user` role submits the password form with a correct current password
- **THEN** the password is updated in the database and a success toast is shown

#### Scenario: Incorrect current password is rejected
- **WHEN** any role submits the password form with a wrong current password
- **THEN** the system responds with 422 and displays an error on the `current_password` field
- **AND** the password is not changed

#### Scenario: Mismatched password confirmation is rejected
- **WHEN** a user submits the form with new password and confirmation that do not match
- **THEN** the system displays a validation error and does not update the password

### Requirement: User can upload and remove their avatar
The system SHALL provide an avatar upload component with a live preview, an upload button, and a remove button. Upload SHALL use `PUT /api/users/{user}/avatar`. The component SHALL update the header avatar after a successful upload.

#### Scenario: Superadmin successfully uploads avatar
- **WHEN** superadmin selects a valid image file and submits
- **THEN** the avatar is stored and the preview updates without page reload
- **AND** the header avatar reflects the new image

#### Scenario: Admin successfully uploads avatar
- **WHEN** admin selects a valid image file and submits
- **THEN** the avatar is stored and the preview updates without page reload

#### Scenario: User role successfully uploads avatar
- **WHEN** a user with the `user` role selects a valid image file and submits
- **THEN** the avatar is stored and the preview updates without page reload

#### Scenario: Existing avatar can be removed
- **WHEN** a user who already has an avatar clicks the remove button
- **THEN** the avatar is deleted from storage and the component reverts to the initials placeholder

#### Scenario: Non-image file is rejected
- **WHEN** a user attempts to upload a non-image file (e.g. .pdf, .txt)
- **THEN** the system displays a validation error and the avatar is not changed

### Requirement: Profile components are reusable
The system SHALL organize `ProfileInfoForm`, `PasswordForm`, and `AvatarUpload` as standalone Vue components in `resources/app/components/profile/` that can be imported independently by any page.

#### Scenario: ProfileInfoForm renders standalone
- **WHEN** `ProfileInfoForm` is imported and used in a page other than `ProfilePage`
- **THEN** the component renders correctly without any dependency on `ProfilePage`

#### Scenario: PasswordForm renders standalone
- **WHEN** `PasswordForm` is imported and used in a page other than `ProfilePage`
- **THEN** the component renders correctly without any dependency on `ProfilePage`

#### Scenario: AvatarUpload renders standalone
- **WHEN** `AvatarUpload` is imported with `userId` and `currentAvatarUrl` props
- **THEN** the component renders correctly without any dependency on `ProfilePage`

### Requirement: ProfilePage renders the correct layout per role
The system SHALL render `AdminLayout` (with sidebar) for roles that have the `access-admin-panel` permission, and `DefaultLayout` (standalone) for the `user` role. In both layouts, the profile body SHALL use a two-column section pattern: a 35% description column on the left and a 65% form column on the right, applied consistently across all four sections (Personal Information, Password, Two-Factor Authentication, Browser Sessions). On mobile viewports (below `md` breakpoint) the two columns SHALL stack vertically — description above form.

#### Scenario: Superadmin sees AdminLayout on /my-profile
- **WHEN** superadmin navigates to `/my-profile`
- **THEN** the page renders with the admin sidebar and header
- **AND** the profile body uses the two-column section layout

#### Scenario: Admin sees AdminLayout on /my-profile
- **WHEN** admin navigates to `/my-profile`
- **THEN** the page renders with the admin sidebar and header
- **AND** the profile body uses the two-column section layout

#### Scenario: User role sees DefaultLayout on /my-profile
- **WHEN** a user with the `user` role navigates to `/my-profile`
- **THEN** the page renders without the admin sidebar
- **AND** the profile body uses the two-column section layout

#### Scenario: Guest is redirected to login from /my-profile
- **WHEN** an unauthenticated user navigates to `/my-profile`
- **THEN** the system redirects to `/login` with a `redirect` query parameter

#### Scenario: Old /profile URL redirects to /my-profile
- **WHEN** any user navigates to `/profile`
- **THEN** the Vue Router client-side redirect sends them to `/my-profile`

### Requirement: Profile page header displays correct title and description
The system SHALL render an `h1` heading "My Profile" and description "Manage your user profile here." at the top of the profile page, for all roles.

#### Scenario: Page header shows "My Profile" heading
- **WHEN** any authenticated user visits `/my-profile`
- **THEN** the page displays an `h1` with the text "My Profile" (locale-appropriate)

#### Scenario: Page header shows updated description
- **WHEN** any authenticated user visits `/my-profile`
- **THEN** the page displays the description "Manage your user profile here." below the heading

### Requirement: Two-Factor Authentication disabled state shows explanation
The system SHALL display, when 2FA is disabled, an alert icon followed by an `h3` "You have not enabled two-factor authentication." and a descriptive paragraph explaining how 2FA works and naming example authenticator apps (Microsoft Authenticator, Google Authenticator). An "Enable" button SHALL be present below the paragraph.

#### Scenario: 2FA disabled state renders explanation text
- **WHEN** a user visits `/my-profile` and 2FA is not enabled
- **THEN** the section shows the heading "You have not enabled two-factor authentication."
- **AND** displays the explanation paragraph about authenticator apps
- **AND** shows an "Enable" button

#### Scenario: 2FA enabled state still renders correctly
- **WHEN** a user visits `/my-profile` and 2FA is enabled
- **THEN** the section shows the regenerate and disable controls (unchanged behavior)

### Requirement: Profile page layout is responsive across viewports
The system SHALL render the profile page correctly on mobile (375px), tablet (769px), and desktop (1280px) viewports. On mobile the two-column section pattern SHALL collapse to a single-column stack (description above form). On tablet and desktop the two columns SHALL render side by side. The page content SHALL NOT overflow horizontally at any viewport. Each `[data-testid="section-description"]` left column and `[data-testid="section-form"]` right column SHALL be addressable by Playwright for viewport layout assertions.

#### Scenario: Mobile layout stacks sections vertically (user role)
- **WHEN** a user visits `/my-profile` on a 375x667 viewport
- **THEN** the description column renders above the form column for each section (stacked)
- **AND** all four section headings (Personal Information, Password, Two-Factor Authentication, Browser Sessions) are visible
- **AND** form fields (Name, Username, Email, Current Password, New Password, Confirm Password) are accessible
- **AND** the page has no horizontal overflow

#### Scenario: Mobile layout shows 2FA Enable button (user role)
- **WHEN** a user without 2FA visits `/my-profile` on a 375x667 viewport
- **THEN** the "Enable" button is visible

#### Scenario: Mobile layout shows Browser Sessions section (user role)
- **WHEN** a user visits `/my-profile` on a 375x667 viewport
- **THEN** the Browser Sessions section heading and "Log Out Other Browser Sessions" button are visible

#### Scenario: Tablet layout uses two-column sections (user role)
- **WHEN** a user visits `/my-profile` on a 769x1024 viewport
- **THEN** the section description column is to the LEFT of the form column (side by side)
- **AND** all form fields are visible and accessible

#### Scenario: Desktop layout uses two-column sections with nested avatar sub-column (user role)
- **WHEN** a user visits `/my-profile` on a 1280x800 viewport
- **THEN** the section description column is to the LEFT of the form column
- **AND** the Personal Information form column shows the avatar to the LEFT of the name/username/email fields

#### Scenario: Admin mobile layout has accessible bottom nav and stacked profile content
- **WHEN** an admin visits `/my-profile` on a 375x667 viewport
- **THEN** the admin bottom nav is visible
- **AND** all four profile section headings are visible
- **AND** layout stacks vertically (no horizontal overflow)

#### Scenario: Admin tablet layout shows sidebar alongside 2-column profile content
- **WHEN** an admin visits `/my-profile` on a 769x1024 viewport
- **THEN** the admin sidebar is visible
- **AND** the bottom nav is hidden
- **AND** profile sections use the two-column layout

#### Scenario: Superadmin mobile profile matches admin mobile behavior
- **WHEN** a superadmin visits `/my-profile` on a 375x667 viewport
- **THEN** the admin bottom nav is visible, all four section headings are visible, and layout is stacked

#### Scenario: Superadmin tablet profile shows sidebar and two-column layout
- **WHEN** a superadmin visits `/my-profile` on a 769x1024 viewport
- **THEN** the sidebar with Settings group is visible and the profile sections use the two-column layout

### Requirement: Full EN and ID translations for the profile page
The system SHALL provide English and Indonesian translations for all labels, placeholders, buttons, success messages, and error context on the profile page and its components, including all new strings introduced by this redesign.

#### Scenario: Profile page displays in English
- **WHEN** the language preference is `en`
- **THEN** all form labels, buttons, and headings display in English including "My Profile", "Manage your user profile here.", "Personal Information", "Browser Sessions", "Log Out Other Browser Sessions", "You have not enabled two-factor authentication.", and "Enable"

#### Scenario: Profile page displays in Indonesian
- **WHEN** the user switches the language to `id`
- **THEN** all form labels, buttons, and headings switch to Indonesian without page reload
