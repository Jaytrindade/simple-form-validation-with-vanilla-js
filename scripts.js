const form = document.getElementById('form');
const formMessage = form.querySelector('.form-message');
const username = form.querySelector('#username');
const email = form.querySelector('#email');
const password = form.querySelector('#password');
const passwordConfirmation = form.querySelector('#password-confirmation');
const formControlInputs = form.querySelectorAll('.form-control input');

let formData = {};

function updateFormData(field, value) {
  const name = field.name;
  if (typeof value === 'string') delete formData[name];
  else formData[name] = field.value;
}

// remove form message
function removeFormMessage() {
  if (formMessage.className.includes('success')) {
    formMessage.classList = 'form-message';
    formMessage.innerText = '';
  }
}

// get field label text
function getFieldLabelText(field) {
  const parent = field.parentElement;
  const label = parent.querySelector('label');
  return label.innerText;
}

// show error message on field
function showErrorMessageOnField(field, message) {
  const parent = field.parentElement;
  const errorMessage = parent.querySelector('small');
  parent.className = 'form-control error';
  errorMessage.innerText = message;
  updateFormData(field, '');
}

// show success message on field
function showSuccessMessageOnField(field) {
  const parent = field.parentElement;
  const errorMessage = parent.querySelector('small');
  parent.className = 'form-control success';
  errorMessage.innerText = ' ';
  updateFormData(field);
}

// check required fields
function requiredField(field) {
  if (field.value.length === 0) {
    showErrorMessageOnField(field, `${getFieldLabelText(field)} is required!`);
    updateFormData(field, '');
  } else {
    showSuccessMessageOnField(field);
    updateFormData(field);
  }
}

function requiredFields(fields) {
  fields.forEach(field => requiredField(field));
}

// check min and max character on Fields
function checkMinAndMaxCharactersOnField(field, minValue, maxValue) {
  if (field.value.length > 0) {
    if (typeof minValue === 'number') {
      if (field.value.length < minValue) {
        showErrorMessageOnField(
          field,
          `${getFieldLabelText(field)} characters must be at least ${minValue}`
        );
        updateFormData(field, '');
      }
    }
    if (typeof maxValue === 'number') {
      if (field.value.length > maxValue) {
        showErrorMessageOnField(
          field,
          `${getFieldLabelText(field)} characters must be less than ${maxValue}`
        );
        updateFormData(field, '');
      }
    }
  }
}

function checkMinAndMaxCharactersOnFields(...fields) {
  fields.forEach(element => {
    const [field, minValue, maxValue] = element;
    checkMinAndMaxCharactersOnField(field, minValue, maxValue);
  });
}

// username validation
function usernameFieldValidation(field) {
  if (field.value.length > 0) {
    const regExp = /^[a-z0-9_]+$/;

    if (!regExp.test(field.value)) {
      showErrorMessageOnField(
        field,
        `${getFieldLabelText(
          field
        )} must have only alphanumeric characters and "_"`
      );
    }
  }
}

// email validation
function emailFieldValidation(field) {
  if (field.value.length > 0) {
    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!regExp.test(field.value)) {
      showErrorMessageOnField(field, `Invalid ${getFieldLabelText(field)}`);
    }
  }
}

// password matches
function passwordMatches(field, field2) {
  if (field.value.length > 0 && field2.value.length > 0) {
    if (field.value !== field2.value)
      showErrorMessageOnField(field2, `Password not matched`);
  }
}

// execute multiple validations
function executeValidations() {
  requiredFields([username, email, password, passwordConfirmation]);
  checkMinAndMaxCharactersOnFields([username, 3, 20], [password, 8, 20]);
  usernameFieldValidation(username);
  emailFieldValidation(email);
  passwordMatches(password, passwordConfirmation);
}

// remove message on change field
function removeMessageOnChangeField() {
  formControlInputs.forEach(field => {
    const parent = field.parentElement;
    field.addEventListener('keyup', () => {
      if (
        parent.className.includes('success') ||
        parent.className.includes('error')
      ) {
        parent.className = 'form-control';
        const errorMessage = parent.querySelector('small');
        errorMessage.innerText = ' ';
      }
      removeFormMessage();
    });
  });
}

removeMessageOnChangeField();

// reset fields value
function resetFieldsValue() {
  formData = {};
  formControlInputs.forEach(field => {
    const parent = field.parentElement;
    parent.className = 'form-control';
    field.value = '';
  });
}

// event submit
form.addEventListener('submit', e => {
  e.preventDefault();
  executeValidations();
  removeFormMessage();

  if (Object.values(formData).length === 4) {
    const btnSend = form.querySelector('#send');
    formControlInputs.forEach(field => field.setAttribute('disabled', true));
    btnSend.setAttribute('disabled', true);
    btnSend.value = 'Sending...';
    setTimeout(() => {
      formControlInputs.forEach(field => field.removeAttribute('disabled'));
      btnSend.removeAttribute('disabled');
      btnSend.value = 'Send Data';
      formMessage.innerText = 'Success!';
      formMessage.className = 'form-message success';
      resetFieldsValue();
    }, 2000);
  }
});
