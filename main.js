import './style.scss';
import { getUsers, createUser, updateUser, deleteUser, uploadProfilePicture, baseUrl } from './api.js';

const userForm = document.getElementById('create-user-form');
const editUserForm = document.getElementById('edit-user-form');
const userList = document.getElementById('users');
const editModal = document.getElementById('editModal');

function showError(msg){
  const alert = document.getElementById('main-alert');
  alert.hidden = false;
  alert.textContent = `${msg.res} Error: ${msg.message}`;
}

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    await createUser({ email, age: Number(age) });
    loadUsers();
    e.target.reset();
  } catch (error) {
    console.error(error);
    showError(JSON.parse(error.message))
  }
});

editUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById('edit-email').value;
    const age = document.getElementById('edit-age').value;
    const id = document.getElementById('edit-id').value;
    const pic = document.getElementById('edit-pic')
    await updateUser(id, { email, age: Number(age) });
    if(pic.files.length != 0){
      await uploadProfilePicture(id, pic.files[0]);
    }
    loadUsers();
    e.target.reset();
    document.getElementById('close').click();
  } catch (error) {
    console.error(error);
    const alert = document.getElementById('edit-alert');
    error = JSON.parse(error.message)
    alert.hidden = false;
    alert.textContent = `${error.res} Error: ${error.message}`;
  }
});

editModal.addEventListener('hidden.bs.modal', () => {
  editUserForm.reset();
})

async function loadUsers() {
  try {
    const users = await getUsers();
    userList.innerHTML = '';
    users.forEach((user) => {
      const userElement = createUserCard(user);
      userList.appendChild(userElement);
    });
    const alert = document.getElementById('main-alert');
    alert.hidden = true;
  } catch (error) {
    console.error(error);
    showError(JSON.parse(error.message))
  }
}

function createUserCard(user) {
  const userElementTemplate = document.getElementById('user-card-temp');
  const userElement = userElementTemplate.content.cloneNode(true);
  userElement.querySelector('.profile-picture').src = `${baseUrl}/users/${user.id}/profile`;
  userElement.querySelector('.card-title').textContent = user.email;
  userElement.querySelector('.card-text').textContent = `Kor: ${user.age}`;
  userElement.querySelector('.delete-user').addEventListener('click', async (e) => {
    try {
      await deleteUser(user.id);
      loadUsers();
    } catch (error) {
      console.error(error);
      showError(JSON.parse(error.message))
    }
  });
  userElement.querySelector('.edit-user').addEventListener('click', async (e) => {  
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-age').value = user.age;
    document.getElementById('edit-id').value = user.id;
    const alert = document.getElementById('edit-alert');
    alert.hidden = true;
  });
  return userElement;
}

loadUsers();