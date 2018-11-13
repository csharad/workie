function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export const nameRules = ({ required = false }) =>
  required ? [v => !!v || 'Your name is required.'] : [];

export const emailRules = ({ notUnique, notFound } = {}) => [
  v => !!v || 'Email is required.',
  v => (!!v && validateEmail(v)) || 'Does not look like a valid email.',
  () => !notUnique || 'This email is already registered.',
  () => !notFound || 'This email is not registered.'
];

export const passwordRules = ({ wrong, required = true } = {}) => [
  v => (required ? !!v || 'Password is required.' : true),
  v =>
    required || !!v
      ? (!!v && v.length >= 8) || 'Password must be atleast 8 characters long.'
      : true,
  () => !wrong || 'Given password is wrong.'
];
