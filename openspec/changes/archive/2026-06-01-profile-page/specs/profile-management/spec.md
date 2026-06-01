## ADDED Requirements

### Requirement: User can edit their profile information
The system SHALL provide a form for authenticated users to update their `name` and `username`. The form SHALL use existing endpoints and refresh the auth store on success so the updated name appears in the navbar immediately.

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
The system SHALL render `AdminLayout` (with sidebar) for roles that have the `access-admin-panel` permission, and `DefaultLayout` (standalone) for the `user` role.

#### Scenario: Superadmin sees AdminLayout on /profile
- **WHEN** superadmin navigates to `/profile`
- **THEN** the page renders with the admin sidebar and header

#### Scenario: Admin sees AdminLayout on /profile
- **WHEN** admin navigates to `/profile`
- **THEN** the page renders with the admin sidebar and header

#### Scenario: User role sees DefaultLayout on /profile
- **WHEN** a user with the `user` role navigates to `/profile`
- **THEN** the page renders without the admin sidebar

#### Scenario: Guest is redirected to login from /profile
- **WHEN** an unauthenticated user navigates to `/profile`
- **THEN** the system redirects to `/login`

### Requirement: Full EN and ID translations for the profile page
The system SHALL provide English and Indonesian translations for all labels, placeholders, buttons, success messages, and error context on the profile page and its components.

#### Scenario: Profile page displays in English
- **WHEN** the language preference is `en`
- **THEN** all form labels, buttons, and headings display in English

#### Scenario: Profile page displays in Indonesian
- **WHEN** the user switches the language to `id`
- **THEN** all form labels, buttons, and headings switch to Indonesian without page reload
