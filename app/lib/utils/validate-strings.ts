function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}
function validateJob(title: unknown) {
  if (typeof title !== 'string' || title.length < 5) {
    return `Job title must be at least 5 characters long`;
  }
}

function validateDescription(desc: unknown) {
  if (typeof desc !== 'string' || desc.length > 140) {
    return `Descriptions must be under 140 characters`;
  }
}

export { validatePassword, validateUsername, validateJob, validateDescription };
